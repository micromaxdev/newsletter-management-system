const POP3Client = require('poplib');
const { simpleParser } = require('mailparser');
const Email = require('../models/emailModel');
const SenderPreference = require('../models/senderPreferenceModel');
const EmailCategorizationService = require('../services/emailCategorizationService');
const EmailTaggingService = require('../services/emailTaggingService');

const emailCategorizationService = new EmailCategorizationService();
const emailTaggingService = new EmailTaggingService();

const syncEmailsFromPOP3 = () => {
  return new Promise((resolve, reject) => {
    console.log('[EMAIL SYNC] Starting email synchronization...');
    const host = process.env.POP3_HOST || 'pop.gmail.com';
    const pop3Port = 995;
    const username = process.env.POP3_USER;
    const password = process.env.POP3_PASS;

    const client = new POP3Client(pop3Port, host, {
      tlserrs: false,
      enabletls: true,
      debug: false,
      ignoretlserrs: true,
    });

    client.on("error", (err) => {
      console.error("[EMAIL SYNC] POP3 client error:", err);
      reject(new Error(`POP3 client error: ${err.message}`));
    });

    client.on("connect", () => {
      console.log('[EMAIL SYNC] POP3 client connected. Logging in...');
      client.login(username, password);
    });

    client.on("login", async (status) => {
      if (status) {
        console.log('[EMAIL SYNC] POP3 login successful. Loading sender preferences...');
        try {
          const preferences = await SenderPreference.find({});
          const senderPreferencesCache = {};
          preferences.forEach(pref => {
            senderPreferencesCache[pref.senderAddress] = pref.folderId;
          });
          client.emit('preferences_loaded', senderPreferencesCache);
        } catch (dbError) {
          console.error("[EMAIL SYNC] Error loading sender preferences:", dbError);
          client.quit();
          reject(new Error('Failed to load sender preferences.'));
        }
      } else {
        console.error("[EMAIL SYNC] POP3 Login failed for user:", username);
        client.quit();
        reject(new Error('POP3 login failed.'));
      }
    });

    client.on("preferences_loaded", (senderPreferencesCache) => {
      console.log('[EMAIL SYNC] Preferences loaded. Listing emails...');
      client.list();
      client.senderPreferencesCache = senderPreferencesCache;
    });

    client.on("list", (status, msgcount) => {
      if (!status) {
        console.error("[EMAIL SYNC] Failed to list emails from POP3 server");
        client.quit();
        return reject(new Error('Failed to list emails.'));
      }

      console.log(`[EMAIL SYNC] Found ${msgcount} emails to process.`);
      if (msgcount === 0) {
        client.quit();
        return resolve({ message: "No new emails to process." });
      }

      let emailsToFetch = Array.from({ length: msgcount }, (_, i) => (i + 1).toString());
      let emailsProcessed = 0;

      const fetchNextEmail = () => {
        if (emailsToFetch.length === 0) {
          client.quit();
          return;
        }
        const msgNumber = emailsToFetch.shift();
        client.retr(msgNumber);
      };

      client.on("retr", async (status, msgnumber, data) => {
        if (status) {
          try {
            const parsed = await simpleParser(data);
            console.log(`[EMAIL SYNC] Processing email: ${parsed.subject}, MessageID: ${parsed.messageId}`);
            
            const existingEmail = await Email.findOne({ messageId: parsed.messageId });
            console.log(`[EMAIL SYNC] Existing email check result: ${existingEmail ? 'FOUND' : 'NOT FOUND'}`);

            if (!existingEmail) {
              const folderId = emailCategorizationService.categorizeEmail(parsed, client.senderPreferencesCache);
              const tags = emailTaggingService.generateTags(parsed);
              const newEmail = new Email({
                subject: parsed.subject,
                from: {
                  name: parsed.from?.value?.[0]?.name || '',
                  address: parsed.from?.value?.[0]?.address || '',
                },
                date: parsed.date,
                text: parsed.text,
                html: parsed.html,
                messageId: parsed.messageId,
                folderId: folderId,
                tags: tags,
                isRead: false,
                isStarred: false,
              });
              await newEmail.save();
              console.log(`[EMAIL SYNC] Saved new email: ${parsed.subject}`);
              
              // Emit WebSocket notification for new email
              if (global.io) {
                global.io.emit('new-email', {
                  email: newEmail,
                  message: `New email received: ${parsed.subject}`,
                  timestamp: new Date().toISOString()
                });
                console.log(`[WEBSOCKET] Emitted new-email event for: ${parsed.subject}`);
              }
            } else {
              console.log(`[EMAIL SYNC] Skipping duplicate email: ${parsed.subject}`);
            }
          } catch (parseError) {
            console.error(`[EMAIL SYNC] Error parsing or saving email ${msgnumber}:`, parseError);
          }
        }

        emailsProcessed++;
        console.log(`[EMAIL SYNC] Processed ${emailsProcessed}/${msgcount} emails`);
        
        if (emailsProcessed === msgcount) {
          console.log(`[EMAIL SYNC] All emails processed, quitting client`);
          client.quit();
        } else {
          // Continue fetching the next email
          fetchNextEmail();
        }
      });

      fetchNextEmail(); // Start the fetch loop
    });

    client.on("quit", () => {
      console.log('[EMAIL SYNC] POP3 client quit. Synchronization finished.');
      resolve({ message: "Synchronization finished." });
    });
  });
};

module.exports = { syncEmailsFromPOP3 };
