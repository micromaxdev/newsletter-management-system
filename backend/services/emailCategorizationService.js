// const fs = require('fs');
// const path = require('path');
// const BaseEmailProcessor = require('./baseEmailProcessor');

// class EmailCategorizationService extends BaseEmailProcessor {
//   constructor() {
//     super(); // Call parent constructor to initialize matchWeights
    
//     // Define comprehensive categorization rules with enhanced patterns
//     this.categories = {
//       supplier: {
//         senderKeywords: [
//           'supplier', 'vendor', 'procurement', 'purchase', 'billing',
//           'invoice', 'payment', 'accounting', 'finance', 'wholesale',
//           'distributor', 'manufacturer', 'logistics', 'shipping',
//           'fulfillment', 'inventory', 'supply chain', 'b2b'
//         ],
//         subjectKeywords: [
//           'invoice', 'purchase order', 'po', 'payment', 'bill',
//           'receipt', 'delivery', 'shipment', 'order confirmation',
//           'quote', 'quotation', 'proposal', 'contract', 'agreement',
//           'terms', 'pricing', 'catalog', 'product list', 'delivery schedule'
//         ],
//         domainPatterns: [
//           /.*supplier.*/, /.*vendor.*/, /.*wholesale.*/, 
//           /.*distribution.*/, /.*logistics.*/, /.*b2b.*/,
//           /.*supply.*/, /.*procurement.*/
//         ],
//         contentKeywords: [
//           'net 30', 'payment terms', 'due date', 'account payable',
//           'purchase order', 'delivery date', 'terms and conditions'
//         ]
//       },
//       competitor: {
//         senderKeywords: [
//           'competitor', 'analysis', 'market', 'industry', 'research',
//           'benchmark', 'comparison', 'intelligence', 'trends',
//           'consulting', 'analyst', 'report'
//         ],
//         subjectKeywords: [
//           'market analysis', 'competitor', 'industry report', 
//           'market research', 'benchmark', 'comparison', 'trends',
//           'market intelligence', 'competitive analysis', 'industry insights',
//           'market share', 'competitive landscape', 'market study'
//         ],
//         domainPatterns: [
//           /.*research.*/, /.*analytics.*/, /.*intelligence.*/,
//           /.*consulting.*/, /.*analyst.*/, /.*market.*/
//         ],
//         contentKeywords: [
//           'market position', 'competitive advantage', 'market trends',
//           'industry analysis', 'competitor pricing', 'market dynamics'
//         ]
//       },
//       information: {
//         senderKeywords: [
//           'newsletter', 'news', 'updates', 'digest', 'bulletin',
//           'report', 'insights', 'weekly', 'monthly', 'daily',
//           'blog', 'publication', 'magazine', 'journal', 'superhuman'
//         ],
//         subjectKeywords: [
//           'newsletter', 'news', 'update', 'announcement', 'digest',
//           'bulletin', 'report', 'insights', 'weekly', 'monthly',
//           'industry news', 'press release', 'blog', 'article',
//           'trending', 'breaking news', 'latest news', 'news alert', 'ai'
//         ],
//         domainPatterns: [
//           /.*news.*/, /.*newsletter.*/, /.*media.*/, /.*press.*/,
//           /.*blog.*/, /.*publication.*/, /.*magazine.*/
//         ],
//         contentKeywords: [
//           'subscribe', 'unsubscribe', 'read more', 'full article',
//           'breaking news', 'latest update', 'industry news'
//         ]
//       },
//       customers: {
//         senderKeywords: [
//           'customer', 'client', 'support', 'service', 'help',
//           'inquiry', 'feedback', 'complaint', 'review', 'request',
//           'user', 'member', 'subscriber', 'buyer'
//         ],
//         subjectKeywords: [
//           'customer', 'support', 'inquiry', 'question', 'help',
//           'issue', 'problem', 'complaint', 'feedback', 'review',
//           'request', 'assistance', 'service', 'technical support',
//           'order status', 'return', 'refund', 'exchange'
//         ],
//         domainPatterns: [
//           /.*support.*/, /.*service.*/, /.*help.*/,
//           /.*customer.*/, /.*client.*/
//         ],
//         contentKeywords: [
//           'ticket number', 'case number', 'order number',
//           'please help', 'issue with', 'problem with', 'not working'
//         ]
//       },
//       marketing: {
//         senderKeywords: [
//           'marketing', 'promo', 'promotion', 'sale', 'offer',
//           'deal', 'discount', 'campaign', 'advertisement', 'ad',
//           'special', 'limited', 'exclusive', 'free'
//         ],
//         subjectKeywords: [
//           'marketing', 'promotion', 'sale', 'offer', 'deal',
//           'discount', 'special', 'limited time', 'exclusive',
//           'campaign', 'advertisement', 'flash sale', 'clearance',
//           'free shipping', 'coupon', 'voucher', '% off', 'save money',
//           'black friday', 'cyber monday', 'holiday sale'
//         ],
//         domainPatterns: [
//           /.*marketing.*/, /.*promo.*/, /.*deals.*/,
//           /.*offers.*/, /.*sales.*/
//         ],
//         contentKeywords: [
//           'buy now', 'shop now', 'limited time', 'expires soon',
//           'while supplies last', 'act fast', 'don\'t miss out'
//         ]
//       }
//     };

//     // Priority order for categorization (highest to lowest)
//     this.categoryPriority = [
//       'supplier', 'customers', 'competitor', 'marketing', 'information'
//     ];

//     // Minimum score threshold for categorization
//     this.minCategoryScore = 15;

//     // The sender-to-folder mapping will be passed in from the controller.
//   }

//   // The sender-to-folder mapping is now managed by the controller and the database.

//   /**
//    * Categorize email based on sender, subject, and content with scoring
//    * @param {Object} emailData - Email object with from, subject, text, html
//    * @param {Object} senderPreferences - A map of sender addresses to folder IDs
//    * @returns {string} - Category folder ID
//    */
//   categorizeEmail(emailData, senderPreferences = {}) {
//     const sender = this.extractSenderInfo(emailData);
//     const senderAddress = sender.email;

//     // Check if sender exists in the preferences
//     if (senderAddress && senderPreferences[senderAddress]) {
//       // Return the preferred folder directly
//       return senderPreferences[senderAddress];
//     }
//     // Extract subject and content
//     const subject = (emailData.subject || '').toLowerCase();
//     const content = this.extractContent(emailData);
//     const categoryScores = {};

//     // Calculate scores for each category
//     for (const categoryId of this.categoryPriority) {
//       categoryScores[categoryId] = this.calculateCategoryScore(
//         categoryId, sender, subject, content
//       );
//     }

//     let bestCategory = 'inbox';
//     let highestScore = 0;
//     for (const [categoryId, score] of Object.entries(categoryScores)) {
//       if (score > highestScore && score >= this.minCategoryScore) {
//         highestScore = score;
//         bestCategory = categoryId;
//       }
//     }

//     console.log(`📁 Email categorization:`, {
//       subject: emailData.subject?.substring(0, 50) + '...', 
//       from: sender.email,
//       scores: categoryScores,
//       assigned: bestCategory,
//       confidence: highestScore
//     });

//     return bestCategory;
//   }

//   /**
//    * Calculate category score based on various factors
//    * @param {string} categoryId 
//    * @param {Object} sender 
//    * @param {string} subject 
//    * @param {string} content 
//    * @returns {number}
//    */
//   calculateCategoryScore(categoryId, sender, subject, content) {
//     const category = this.categories[categoryId];
//     return this.calculateBaseScore(category, sender, subject, content);
//   }

//   addCustomRule(categoryId, rules) {
//     this.addCustomRuleToCollection(categoryId, rules, this.categories, this.categoryPriority);
//   }

//   /**
//    * Bulk categorize for multiple emails
//    * @param {Array} emails
//    * @returns {Object}
//    */
//   bulkCategorize(emails, senderPreferences = {}) {
//     const results = {
//       total: emails.length,
//       categorized: 0,
//       categories: {},
//       uncategorized: 0,
//       averageConfidence: 0,
//       details: []
//     };

//     let totalConfidence = 0;

//     for (const email of emails) {
//       const category = this.categorizeEmail(email, senderPreferences);
//       const sender = this.extractSenderInfo(email);
//       const confidence = this.calculateCategoryScore(
//         category,
//         sender,
//         (email.subject || '').toLowerCase(),
//         this.extractContent(email)
//       );

//       if (!results.categories[category]) {
//         results.categories[category] = 0;
//       }
//       results.categories[category]++;

//       if (category !== 'inbox') {
//         results.categorized++;
//       } else {
//         results.uncategorized++;
//       }

//       totalConfidence += confidence;

//       results.details.push({
//         subject: email.subject,
//         from: sender.email, // sender.email is now senderAddress
//         category: category,
//         confidence: confidence
//       });
//     }

//     results.averageConfidence = emails.length > 0 ? totalConfidence / emails.length : 0;

//     return results;
//   }

//   getCategoryInfo() {
//     const info = {};

//     for (const [categoryId, category] of Object.entries(this.categories)) {
//       info[categoryId] = {
//         senderKeywords: category.senderKeywords.length,
//         subjectKeywords: category.subjectKeywords.length,
//         domainPatterns: category.domainPatterns ? category.domainPatterns.length : 0,
//         contentKeywords: category.contentKeywords ? category.contentKeywords.length : 0,
//         priority: this.categoryPriority.indexOf(categoryId) + 1
//       };
//     }

//     return info;
//   }

//   learnFromCorrection(emailData, correctCategory, predictedCategory) {
//     const sender = this.extractSenderInfo(emailData);
//     const senderAddress = sender.email;

//     // The controller now handles saving the sender preference to the database.
//     // This function can be extended to improve the keyword-based rules in the future.

//     // Existing rule improvements...
//     this.improveRulesFromCorrection(emailData, correctCategory, sender);
//   }

//   improveRulesFromCorrection(emailData, correctCategory, sender) {
   
//   }
// }

// module.exports = EmailCategorizationService;


const BaseEmailProcessor = require('./baseEmailProcessor');
const Folder = require('../models/folderModel');

class EmailCategorizationService extends BaseEmailProcessor {
  constructor() {
    super();

    this.categories = {
      suppliers: {
        senderKeywords: [
          'supplier',
          'vendor',
          'procurement',
          'purchasing',
          'billing',
          'accounts',
          'payables',
          'warehouse',
          'logistics',
          'shipping',
          'fulfillment',
          'distribution',
          'inventory',
          'manufacturer',
          'wholesale',
          'distributor',
        ],
        subjectKeywords: [
          'invoice',
          'tax invoice',
          'purchase order',
          'po #',
          'payment due',
          'payment reminder',
          'bill',
          'receipt',
          'shipment',
          'delivery',
          'order confirmation',
          'quote',
          'quotation',
          'pricing',
          'catalog',
          'stock update',
          'backorder',
          'supply update',
          'contract renewal',
          'vendor update',
          'shipment confirmation',
        ],
        domainPatterns: [
          /supplier/i,
          /vendor/i,
          /wholesale/i,
          /distribution/i,
          /logistics/i,
          /freight/i,
          /shipping/i,
          /supply/i,
          /procurement/i,
          /warehouse/i,
        ],
        contentKeywords: [
          'payment terms',
          'due date',
          'account payable',
          'purchase order',
          'delivery date',
          'tracking number',
          'shipment status',
          'invoice attached',
          'remittance',
          'terms and conditions',
          'minimum order quantity',
          'unit price',
          'lead time',
        ],
      },

      customers: {
        senderKeywords: [
          'customer success',
          'community',
          'user research',
          'member',
          'subscriber',
          'customer',
          'client',
          'user',
          'advocate',
          'ambassador',
        ],
        subjectKeywords: [
          'customer story',
          'customer feedback',
          'user feedback',
          'community update',
          'member update',
          'subscriber update',
          'client update',
          'user insights',
          'customer insights',
          'voice of the customer',
          'customer spotlight',
          'member newsletter',
          'subscriber newsletter',
          'community highlights',
          'user story',
        ],
        domainPatterns: [
          /customer/i,
          /client/i,
          /community/i,
          /member/i,
          /subscriber/i,
          /users?/i,
        ],
        contentKeywords: [
          'customer feedback',
          'user feedback',
          'what customers are saying',
          'member engagement',
          'subscriber community',
          'customer story',
          'user story',
          'client success',
          'community highlights',
          'customer spotlight',
          'voice of the customer',
        ],
      },

      competitors: {
        senderKeywords: [
          'competitive intelligence',
          'competitor',
          'industry analyst',
          'market intelligence',
          'benchmarking',
          'research team',
          'analyst relations',
          'techcrunch',
          'crunchbase',
          'pitchbook',
          'cb insights',
          'forrester',
          'gartner',
          'similarweb',
          'semrush',
          'ahrefs',
          'statista',
        ],
        subjectKeywords: [
          'competitor analysis',
          'competitive analysis',
          'competitive landscape',
          'market intelligence',
          'industry benchmark',
          'benchmark report',
          'market share',
          'rival launch',
          'industry outlook',
          'competitive update',
          'industry watch',
          'product launch',
          'feature launch',
          'industry trends',
          'startup update',
          'tech trends',
          'product update',
          'new feature',
          'ai trends',
        ],
        domainPatterns: [
          /gartner/i,
          /forrester/i,
          /cbinsights/i,
          /pitchbook/i,
          /crunchbase/i,
          /similarweb/i,
          /semrush/i,
          /ahrefs/i,
          /statista/i,
          /techcrunch/i,
          /theinformation/i,
          /venturebeat/i,
        ],
        contentKeywords: [
          'market share',
          'competitive advantage',
          'competitor pricing',
          'industry analysis',
          'rival product',
          'competitor launch',
          'competitive positioning',
          'industry trends report',
          'peer comparison',
          'competitive benchmark',
          'new feature',
          'product update',
          'industry trend',
          'startup funding',
          'feature release',
        ],
      },
    };

    this.categoryPriority = ['suppliers', 'customers', 'competitors'];
    this.minCategoryScore = 24;

    this.blockedDomains = [
      'linkedin.com',
      'facebookmail.com',
      'facebook.com',
      'instagram.com',
      'threads.net',
      'x.com',
      'twitter.com',
      'tiktok.com',
      'snapchat.com',
      'discord.com',
      'slack.com',
      'redditmail.com',
      'pinterest.com',
      'quora.com',
      'youtube.com',
      'accounts.google.com',
      'mail.instagram.com',
      'notifications.github.com',
      'github.com',
      'noreply.github.com',
    ];

    this.blockedSenderKeywords = [
      'linkedin',
      'facebook',
      'instagram',
      'twitter',
      'tiktok',
      'snapchat',
      'discord',
      'slack',
      'reddit',
      'pinterest',
      'quora',
      'github',
      'security',
      'verification',
      'otp',
      'password reset',
      'login alert',
    ];

    this.blockedSubjectKeywords = [
      'someone viewed your profile',
      'new login',
      'security alert',
      'verify your email',
      'verification code',
      'reset your password',
      'password reset',
      'sign-in attempt',
      'new device',
      'missed notification',
      'people are looking at your profile',
      'jobs you may be interested in',
      'connection request',
      'invitation to connect',
      'social',
      'promotion',
      'promotions',
      'junk',
      'spam',
    ];
  }

  extractSenderDomain(senderEmail = '') {
    if (!senderEmail || typeof senderEmail !== 'string' || !senderEmail.includes('@')) {
      return '';
    }

    return senderEmail.split('@')[1].toLowerCase().trim();
  }

  normalizeText(value) {
    return String(value || '').toLowerCase().trim();
  }

  countKeywordMatches(text, keywords = []) {
    const normalizedText = this.normalizeText(text);
    let count = 0;

    for (const keyword of keywords) {
      if (normalizedText.includes(String(keyword).toLowerCase())) {
        count++;
      }
    }

    return count;
  }

  countPatternMatches(text, patterns = []) {
    const normalizedText = this.normalizeText(text);
    let count = 0;

    for (const pattern of patterns) {
      if (pattern.test(normalizedText)) {
        count++;
      }
    }

    return count;
  }

  getEmailFingerprint(emailData) {
    const sender = this.extractSenderInfo(emailData);
    const senderName = this.normalizeText(sender.name);
    const senderEmail = this.normalizeText(sender.email);
    const senderDomain = this.extractSenderDomain(senderEmail);
    const subject = this.normalizeText(emailData.subject || '');
    const content = this.normalizeText(this.extractContent(emailData));

    return {
      sender,
      senderName,
      senderEmail,
      senderDomain,
      subject,
      content,
      combinedText: `${senderName} ${senderEmail} ${senderDomain} ${subject} ${content}`.trim(),
    };
  }

  isBlockedEmail(emailData) {
    const fp = this.getEmailFingerprint(emailData);

    if (this.blockedDomains.some((domain) => fp.senderDomain.includes(domain))) {
      return true;
    }

    if (this.blockedSenderKeywords.some((keyword) => fp.combinedText.includes(keyword))) {
      return true;
    }

    if (this.blockedSubjectKeywords.some((keyword) => fp.subject.includes(keyword))) {
      return true;
    }

    return false;
  }

  isNewsletter(emailData) {
    if (!emailData) return false;
    if (this.isBlockedEmail(emailData)) return false;

    return true;
  }

  calculateCategoryScoreDetailed(categoryId, emailData) {
    const category = this.categories[categoryId];

    if (!category) {
      return {
        score: 0,
        matchGroups: 0,
        senderKeywordMatches: 0,
        subjectKeywordMatches: 0,
        domainMatches: 0,
        contentKeywordMatches: 0,
      };
    }

    const fp = this.getEmailFingerprint(emailData);

    const senderKeywordMatches =
      this.countKeywordMatches(fp.senderName, category.senderKeywords) +
      this.countKeywordMatches(fp.senderEmail, category.senderKeywords);

    const subjectKeywordMatches = this.countKeywordMatches(fp.subject, category.subjectKeywords);
    const domainMatches = this.countPatternMatches(fp.senderDomain, category.domainPatterns || []);
    const contentKeywordMatches = this.countKeywordMatches(fp.content, category.contentKeywords || []);

    let score = 0;
    let matchGroups = 0;

    if (senderKeywordMatches > 0) {
      score += senderKeywordMatches * 7;
      matchGroups++;
    }

    if (subjectKeywordMatches > 0) {
      score += subjectKeywordMatches * 12;
      matchGroups++;
    }

    if (domainMatches > 0) {
      score += domainMatches * 14;
      matchGroups++;
    }

    if (contentKeywordMatches > 0) {
      score += contentKeywordMatches * 7;
      matchGroups++;
    }

    return {
      score,
      matchGroups,
      senderKeywordMatches,
      subjectKeywordMatches,
      domainMatches,
      contentKeywordMatches,
    };
  }

  isStrongSupplierMatch(details, fp) {
    const strictSupplier =
      fp.subject.includes('invoice') ||
      fp.subject.includes('tax invoice') ||
      fp.subject.includes('purchase order') ||
      fp.subject.includes('payment due') ||
      fp.subject.includes('payment reminder') ||
      fp.subject.includes('shipment confirmation') ||
      fp.subject.includes('order confirmation') ||
      fp.content.includes('invoice attached') ||
      fp.content.includes('tracking number') ||
      fp.content.includes('payment terms');

    return (
      details.score >= this.minCategoryScore &&
      details.matchGroups >= 1 &&
      strictSupplier
    );
  }

  isStrongCustomerMatch(details, fp) {
    const customerSignals =
      fp.subject.includes('customer') ||
      fp.subject.includes('user') ||
      fp.subject.includes('community') ||
      fp.subject.includes('member') ||
      fp.subject.includes('subscriber') ||
      fp.subject.includes('client') ||
      fp.content.includes('customer feedback') ||
      fp.content.includes('user feedback') ||
      fp.content.includes('customer story') ||
      fp.content.includes('community') ||
      fp.content.includes('member engagement') ||
      fp.content.includes('voice of the customer');

    return (
      details.score >= this.minCategoryScore - 4 &&
      details.matchGroups >= 1 &&
      customerSignals
    );
  }

  isStrongCompetitorMatch(details, fp) {
    const competitorSignals =
      fp.subject.includes('competitor') ||
      fp.subject.includes('competitive') ||
      fp.subject.includes('benchmark') ||
      fp.subject.includes('market share') ||
      fp.subject.includes('ai') ||
      fp.subject.includes('startup') ||
      fp.subject.includes('tech') ||
      fp.subject.includes('industry') ||
      fp.subject.includes('trends') ||
      fp.subject.includes('tools') ||
      fp.subject.includes('product') ||
      fp.subject.includes('launch') ||
      fp.subject.includes('feature') ||
      fp.content.includes('new feature') ||
      fp.content.includes('product update') ||
      fp.content.includes('industry trend') ||
      fp.content.includes('competitor pricing') ||
      fp.content.includes('competitive positioning') ||
      fp.content.includes('rival product');

    return (
      details.score >= this.minCategoryScore - 4 &&
      details.matchGroups >= 1 &&
      competitorSignals
    );
  }

  async findBestSubfolder(parentFolderId, emailData) {
    if (!parentFolderId) return null;

    const subfolders = await Folder.find({
      parentFolderId: String(parentFolderId).toLowerCase().trim(),
    }).lean();

    if (!subfolders.length) {
      return null;
    }

    const fp = this.getEmailFingerprint(emailData);
    const combined = `${fp.subject} ${fp.content} ${fp.senderName} ${fp.senderEmail}`.toLowerCase();

    const scoredSubfolders = subfolders.map((subfolder) => {
      const folderName = this.normalizeText(subfolder.name);
      const folderId = this.normalizeText(subfolder.folderId);
      const icon = this.normalizeText(subfolder.icon);

      let score = 0;

      if (folderName && combined.includes(folderName)) score += 40;
      if (folderId && combined.includes(folderId.replace(`${parentFolderId}-`, ''))) score += 25;

      if (
        folderName.includes('newsletter') ||
        folderName.includes('newsletters') ||
        folderName.includes('digest') ||
        icon.includes('newspaper')
      ) {
        score += 15;
      }

      return {
        ...subfolder,
        score,
      };
    });

    scoredSubfolders.sort((a, b) => b.score - a.score);

    if (scoredSubfolders[0].score > 0) {
      return scoredSubfolders[0];
    }

    const genericNewsletterSubfolder = scoredSubfolders.find((item) => {
      const folderName = this.normalizeText(item.name);
      const icon = this.normalizeText(item.icon);

      return (
        folderName.includes('newsletter') ||
        folderName.includes('newsletters') ||
        folderName.includes('digest') ||
        icon.includes('newspaper')
      );
    });

    return genericNewsletterSubfolder || null;
  }

  async categorizeEmail(emailData, senderPreferences = {}) {
    const sender = this.extractSenderInfo(emailData);
    const senderAddress = this.normalizeText(sender.email);

    if (!this.isNewsletter(emailData)) {
      return null;
    }

    if (senderAddress && senderPreferences[senderAddress]) {
      return String(senderPreferences[senderAddress]).toLowerCase();
    }

    const fp = this.getEmailFingerprint(emailData);

    const supplierDetails = this.calculateCategoryScoreDetailed('suppliers', emailData);
    const customerDetails = this.calculateCategoryScoreDetailed('customers', emailData);
    const competitorDetails = this.calculateCategoryScoreDetailed('competitors', emailData);

    const candidates = [];

    if (this.isStrongSupplierMatch(supplierDetails, fp)) {
      candidates.push({ category: 'suppliers', score: supplierDetails.score });
    }

    if (this.isStrongCustomerMatch(customerDetails, fp)) {
      candidates.push({ category: 'customers', score: customerDetails.score });
    }

    if (this.isStrongCompetitorMatch(competitorDetails, fp)) {
      candidates.push({ category: 'competitors', score: competitorDetails.score });
    }

    if (candidates.length === 0) {
      return 'uncategorised';
    }

    candidates.sort((a, b) => {
      if (Math.abs(b.score - a.score) < 5) {
        return this.categoryPriority.indexOf(a.category) - this.categoryPriority.indexOf(b.category);
      }

      return b.score - a.score;
    });

    const baseFolder = candidates[0].category;

    const bestSubfolder = await this.findBestSubfolder(baseFolder, emailData);

    if (bestSubfolder) {
      return bestSubfolder.folderId;
    }

    return baseFolder;
  }

  async classifyEmail(emailData, senderPreferences = {}) {
    const isNewsletter = this.isNewsletter(emailData);

    if (!isNewsletter) {
      return {
        visible: false,
        isNewsletter: false,
        category: null,
        reason: 'blocked_email',
      };
    }

    const category = await this.categorizeEmail(emailData, senderPreferences);

    return {
      visible: true,
      isNewsletter: true,
      category: category || 'uncategorised',
      reason: category === 'uncategorised' ? 'no_category_match' : 'categorized',
    };
  }

  async bulkCategorize(emails, senderPreferences = {}) {
    const results = {
      total: emails.length,
      visible: 0,
      hidden: 0,
      newsletters: 0,
      nonNewsletters: 0,
      categorized: 0,
      uncategorized: 0,
      categories: {},
      averageConfidence: 0,
      details: [],
    };

    let totalConfidence = 0;

    for (const email of emails) {
      const sender = this.extractSenderInfo(email);
      const classification = await this.classifyEmail(email, senderPreferences);

      if (!classification.visible) {
        results.hidden++;
        results.nonNewsletters++;

        results.details.push({
          subject: email.subject || '',
          from: sender.email || '',
          visible: false,
          isNewsletter: false,
          category: null,
          confidence: 0,
          reason: classification.reason,
        });

        continue;
      }

      results.visible++;
      results.newsletters++;

      let confidence = 0;

      if (classification.category.startsWith('suppliers')) {
        confidence = this.calculateCategoryScoreDetailed('suppliers', email).score;
      } else if (classification.category.startsWith('customers')) {
        confidence = this.calculateCategoryScoreDetailed('customers', email).score;
      } else if (classification.category.startsWith('competitors')) {
        confidence = this.calculateCategoryScoreDetailed('competitors', email).score;
      }

      if (!results.categories[classification.category]) {
        results.categories[classification.category] = 0;
      }

      results.categories[classification.category]++;

      if (classification.category !== 'uncategorised') {
        results.categorized++;
      } else {
        results.uncategorized++;
      }

      totalConfidence += confidence;

      results.details.push({
        subject: email.subject || '',
        from: sender.email || '',
        visible: true,
        isNewsletter: true,
        category: classification.category,
        confidence,
        reason: classification.reason,
      });
    }

    results.averageConfidence = results.visible > 0 ? totalConfidence / results.visible : 0;

    return results;
  }

  addCustomRule(categoryId, rules) {
    this.addCustomRuleToCollection(
      categoryId,
      rules,
      this.categories,
      this.categoryPriority
    );
  }

  getCategoryInfo() {
    const info = {};

    for (const [categoryId, category] of Object.entries(this.categories)) {
      info[categoryId] = {
        senderKeywords: category.senderKeywords.length,
        subjectKeywords: category.subjectKeywords.length,
        domainPatterns: category.domainPatterns ? category.domainPatterns.length : 0,
        contentKeywords: category.contentKeywords ? category.contentKeywords.length : 0,
        priority: this.categoryPriority.indexOf(categoryId) + 1,
      };
    }

    return info;
  }

  learnFromCorrection(emailData, correctCategory, predictedCategory) {
    const sender = this.extractSenderInfo(emailData);
    this.improveRulesFromCorrection(emailData, correctCategory, sender, predictedCategory);
  }

  improveRulesFromCorrection(emailData, correctCategory, sender, predictedCategory) {
    console.log('Learning from correction:', {
      subject: emailData?.subject || '',
      from: sender?.email || '',
      correctCategory,
      predictedCategory,
    });
  }
}

module.exports = EmailCategorizationService;