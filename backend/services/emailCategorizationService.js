const fs = require('fs');
const path = require('path');
const BaseEmailProcessor = require('./baseEmailProcessor');

class EmailCategorizationService extends BaseEmailProcessor {
  constructor() {
    super(); // Call parent constructor to initialize matchWeights
    
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
    // Extract subject and content
    const subject = (emailData.subject || '').toLowerCase();
    const content = this.extractContent(emailData);
    const categoryScores = {};

    // Calculate scores for each category
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
    return this.calculateBaseScore(category, sender, subject, content);
  }

  addCustomRule(categoryId, rules) {
    this.addCustomRuleToCollection(categoryId, rules, this.categories, this.categoryPriority);
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