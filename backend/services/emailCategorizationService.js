const fs = require('fs');
const path = require('path');

class EmailCategorizationService {
  constructor() {
    // Define comprehensive categorization rules with enhanced patterns
    this.categories = {
      supplier: {
        senderKeywords: [
          'supplier', 'vendor', 'procurement', 'purchase', 'billing',
          'invoice', 'payment', 'accounting', 'finance', 'wholesale',
          'distributor', 'manufacturer', 'logistics', 'shipping',
          'fulfillment', 'inventory', 'supply chain', 'b2b'
        ],
        subjectKeywords: [
          'invoice', 'purchase order', 'po', 'payment', 'bill',
          'receipt', 'delivery', 'shipment', 'order confirmation',
          'quote', 'quotation', 'proposal', 'contract', 'agreement',
          'terms', 'pricing', 'catalog', 'product list', 'delivery schedule'
        ],
        domainPatterns: [
          /.*supplier.*/, /.*vendor.*/, /.*wholesale.*/, 
          /.*distribution.*/, /.*logistics.*/, /.*b2b.*/,
          /.*supply.*/, /.*procurement.*/
        ],
        contentKeywords: [
          'net 30', 'payment terms', 'due date', 'account payable',
          'purchase order', 'delivery date', 'terms and conditions'
        ]
      },
      competitor: {
        senderKeywords: [
          'competitor', 'analysis', 'market', 'industry', 'research',
          'benchmark', 'comparison', 'intelligence', 'trends',
          'consulting', 'analyst', 'report'
        ],
        subjectKeywords: [
          'market analysis', 'competitor', 'industry report', 
          'market research', 'benchmark', 'comparison', 'trends',
          'market intelligence', 'competitive analysis', 'industry insights',
          'market share', 'competitive landscape', 'market study'
        ],
        domainPatterns: [
          /.*research.*/, /.*analytics.*/, /.*intelligence.*/,
          /.*consulting.*/, /.*analyst.*/, /.*market.*/
        ],
        contentKeywords: [
          'market position', 'competitive advantage', 'market trends',
          'industry analysis', 'competitor pricing', 'market dynamics'
        ]
      },
      information: {
        senderKeywords: [
          'newsletter', 'news', 'updates', 'digest', 'bulletin',
          'report', 'insights', 'weekly', 'monthly', 'daily',
          'blog', 'publication', 'magazine', 'journal', 'superhuman'
        ],
        subjectKeywords: [
          'newsletter', 'news', 'update', 'announcement', 'digest',
          'bulletin', 'report', 'insights', 'weekly', 'monthly',
          'industry news', 'press release', 'blog', 'article',
          'trending', 'breaking news', 'latest news', 'news alert', 'ai'
        ],
        domainPatterns: [
          /.*news.*/, /.*newsletter.*/, /.*media.*/, /.*press.*/,
          /.*blog.*/, /.*publication.*/, /.*magazine.*/
        ],
        contentKeywords: [
          'subscribe', 'unsubscribe', 'read more', 'full article',
          'breaking news', 'latest update', 'industry news'
        ]
      },
      customers: {
        senderKeywords: [
          'customer', 'client', 'support', 'service', 'help',
          'inquiry', 'feedback', 'complaint', 'review', 'request',
          'user', 'member', 'subscriber', 'buyer'
        ],
        subjectKeywords: [
          'customer', 'support', 'inquiry', 'question', 'help',
          'issue', 'problem', 'complaint', 'feedback', 'review',
          'request', 'assistance', 'service', 'technical support',
          'order status', 'return', 'refund', 'exchange'
        ],
        domainPatterns: [
          /.*support.*/, /.*service.*/, /.*help.*/,
          /.*customer.*/, /.*client.*/
        ],
        contentKeywords: [
          'ticket number', 'case number', 'order number',
          'please help', 'issue with', 'problem with', 'not working'
        ]
      },
      marketing: {
        senderKeywords: [
          'marketing', 'promo', 'promotion', 'sale', 'offer',
          'deal', 'discount', 'campaign', 'advertisement', 'ad',
          'special', 'limited', 'exclusive', 'free'
        ],
        subjectKeywords: [
          'marketing', 'promotion', 'sale', 'offer', 'deal',
          'discount', 'special', 'limited time', 'exclusive',
          'campaign', 'advertisement', 'flash sale', 'clearance',
          'free shipping', 'coupon', 'voucher', '% off', 'save money',
          'black friday', 'cyber monday', 'holiday sale'
        ],
        domainPatterns: [
          /.*marketing.*/, /.*promo.*/, /.*deals.*/,
          /.*offers.*/, /.*sales.*/
        ],
        contentKeywords: [
          'buy now', 'shop now', 'limited time', 'expires soon',
          'while supplies last', 'act fast', 'don\'t miss out'
        ]
      }
    };

    // Priority order for categorization (highest to lowest)
    this.categoryPriority = [
      'supplier', 'customers', 'competitor', 'marketing', 'information'
    ];

    // Scoring weights for different match types
    this.matchWeights = {
      senderAddress: 10,
      senderName: 8,
      domainPattern: 9,
      subjectKeyword: 7,
      contentKeyword: 5
    };

    // Minimum score threshold for categorization
    this.minCategoryScore = 15;

    // The sender-to-folder mapping will be passed in from the controller.
  }

  // The sender-to-folder mapping is now managed by the controller and the database.

  /**
   * Categorize email based on sender, subject, and content with scoring
   * @param {Object} emailData - Email object with from, subject, text, html
   * @param {Object} senderPreferences - A map of sender addresses to folder IDs
   * @returns {string} - Category folder ID
   */
  categorizeEmail(emailData, senderPreferences = {}) {
    const sender = this.extractSenderInfo(emailData);
    const senderAddress = sender.email;

    // Check if sender exists in the preferences
    if (senderAddress && senderPreferences[senderAddress]) {
      // Return the preferred folder directly
      return senderPreferences[senderAddress];
    }

    const subject = (emailData.subject || '').toLowerCase();
    const content = this.extractContent(emailData);
    const categoryScores = {};

    for (const categoryId of this.categoryPriority) {
      categoryScores[categoryId] = this.calculateCategoryScore(
        categoryId, sender, subject, content
      );
    }

    let bestCategory = 'inbox';
    let highestScore = 0;
    for (const [categoryId, score] of Object.entries(categoryScores)) {
      if (score > highestScore && score >= this.minCategoryScore) {
        highestScore = score;
        bestCategory = categoryId;
      }
    }

    console.log(`📁 Email categorization:`, {
      subject: emailData.subject?.substring(0, 50) + '...', 
      from: sender.email,
      scores: categoryScores,
      assigned: bestCategory,
      confidence: highestScore
    });

    return bestCategory;
  }

  /**
   * Calculate category score based on various factors
   * @param {string} categoryId 
   * @param {Object} sender 
   * @param {string} subject 
   * @param {string} content 
   * @returns {number}
   */
  calculateCategoryScore(categoryId, sender, subject, content) {
    const category = this.categories[categoryId];
    if (!category) return 0;

    let score = 0;

    // Check sender email keywords
    const senderAddressMatches = this.countKeywordMatches(sender.email, category.senderKeywords);
    score += senderAddressMatches * this.matchWeights.senderAddress;

    // Check sender name keywords
    const senderNameMatches = this.countKeywordMatches(sender.name, category.senderKeywords);
    score += senderNameMatches * this.matchWeights.senderName;

    // Check domain patterns
    if (category.domainPatterns && sender.domain) {
      for (const pattern of category.domainPatterns) {
        if (pattern.test(sender.domain)) {
          score += this.matchWeights.domainPattern;
          break; // Only count one domain match
        }
      }
    }

    // Check subject keywords
    const subjectMatches = this.countKeywordMatches(subject, category.subjectKeywords);
    score += subjectMatches * this.matchWeights.subjectKeyword;

    // Check content keywords
    if (content && category.contentKeywords) {
      const contentMatches = this.countKeywordMatches(content, category.contentKeywords);
      score += contentMatches * this.matchWeights.contentKeyword;
    }

    return score;
  }

  /**
   * Count how many keywords match in the text
   * @param {string} text 
   * @param {Array} keywords 
   * @returns {number}
   */
  countKeywordMatches(text, keywords) {
    if (!text || !keywords) return 0;

    let matches = 0;
    const lowerText = text.toLowerCase();

    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        matches++;
      }
    }

    return matches;
  }

  /**
   * Extract sender information from email
   * @param {Object} emailData 
   * @returns {Object} - Normalized sender info
   */
  extractSenderInfo(emailData) {
    let senderAddress = '';
    let senderName = '';
    let senderDomain = '';

    if (emailData.from) {
      if (typeof emailData.from === 'string') {
        senderAddress = emailData.from.toLowerCase();
      } else if (emailData.from.address) {
        senderAddress = emailData.from.address.toLowerCase();
        senderName = (emailData.from.name || '').toLowerCase();
      } else if (emailData.from?.value && emailData.from.value.length > 0) {
        // fallback if from.value exists
        senderAddress = emailData.from.value[0].address.toLowerCase();
        senderName = (emailData.from.value[0].name || '').toLowerCase();
      }
    }

    if (senderAddress.includes('@')) {
      senderDomain = senderAddress.split('@')[1];
    }

    return { email: senderAddress, name: senderName, domain: senderDomain };
  }

  /**
   * Extract content from email text/html
   * @param {Object} emailData 
   * @returns {string}
   */
  extractContent(emailData) {
    let content = '';

    if (emailData.text) {
      content += emailData.text.toLowerCase();
    }

    if (emailData.html) {
      // Strip HTML tags and get text content
      const htmlText = emailData.html.replace(/<[^>]*>/g, ' ').toLowerCase();
      content += ' ' + htmlText;
    }

    // Limit content length for performance
    return content.trim().substring(0, 2000);
  }

  /**
   * Bulk categorize for multiple emails
   * @param {Array} emails
   * @returns {Object}
   */
  bulkCategorize(emails, senderPreferences = {}) {
    const results = {
      total: emails.length,
      categorized: 0,
      categories: {},
      uncategorized: 0,
      averageConfidence: 0,
      details: []
    };

    let totalConfidence = 0;

    for (const email of emails) {
      const category = this.categorizeEmail(email, senderPreferences);
      const sender = this.extractSenderInfo(email);
      const confidence = this.calculateCategoryScore(
        category,
        sender,
        (email.subject || '').toLowerCase(),
        this.extractContent(email)
      );

      if (!results.categories[category]) {
        results.categories[category] = 0;
      }
      results.categories[category]++;

      if (category !== 'inbox') {
        results.categorized++;
      } else {
        results.uncategorized++;
      }

      totalConfidence += confidence;

      results.details.push({
        subject: email.subject,
        from: sender.email, // sender.email is now senderAddress
        category: category,
        confidence: confidence
      });
    }

    results.averageConfidence = emails.length > 0 ? totalConfidence / emails.length : 0;

    return results;
  }

  getCategoryInfo() {
    const info = {};

    for (const [categoryId, category] of Object.entries(this.categories)) {
      info[categoryId] = {
        senderKeywords: category.senderKeywords.length,
        subjectKeywords: category.subjectKeywords.length,
        domainPatterns: category.domainPatterns ? category.domainPatterns.length : 0,
        contentKeywords: category.contentKeywords ? category.contentKeywords.length : 0,
        priority: this.categoryPriority.indexOf(categoryId) + 1
      };
    }

    return info;
  }

  addCustomRule(categoryId, rules) {
    if (!this.categories[categoryId]) {
      this.categories[categoryId] = {
        senderKeywords: [],
        subjectKeywords: [],
        domainPatterns: [],
        contentKeywords: []
      };
      if (!this.categoryPriority.includes(categoryId)) {
        this.categoryPriority.push(categoryId);
      }
    }

    if (rules.senderKeywords && Array.isArray(rules.senderKeywords)) {
      this.categories[categoryId].senderKeywords.push(...rules.senderKeywords);
    }

    if (rules.subjectKeywords && Array.isArray(rules.subjectKeywords)) {
      this.categories[categoryId].subjectKeywords.push(...rules.subjectKeywords);
    }

    if (rules.domainPatterns && Array.isArray(rules.domainPatterns)) {
      const patterns = rules.domainPatterns.map(pattern => {
        if (typeof pattern === 'string') {
          // Prevent invalid regex: trailing backslash or malformed
          if (/\\$/.test(pattern)) {
            console.warn('Skipped invalid regex pattern (trailing backslash):', pattern);
            return null;
          }
          try {
            return new RegExp(pattern, 'i');
          } catch (e) {
            console.warn('Skipped invalid regex pattern:', pattern, e.message);
            return null;
          }
        }
        return pattern;
      }).filter(Boolean);
      this.categories[categoryId].domainPatterns.push(...patterns);
    }

    if (rules.contentKeywords && Array.isArray(rules.contentKeywords)) {
      this.categories[categoryId].contentKeywords.push(...rules.contentKeywords);
    }
  }

  learnFromCorrection(emailData, correctCategory, predictedCategory) {
    const sender = this.extractSenderInfo(emailData);
    const senderAddress = sender.email;

    // The controller now handles saving the sender preference to the database.
    // This function can be extended to improve the keyword-based rules in the future.

    // Existing rule improvements...
    this.improveRulesFromCorrection(emailData, correctCategory, sender);
  }

  improveRulesFromCorrection(emailData, correctCategory, sender) {
   
  }
}

module.exports = EmailCategorizationService;