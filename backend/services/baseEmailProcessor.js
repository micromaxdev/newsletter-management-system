class BaseEmailProcessor {
  constructor() {
    // Scoring weights for different match types
    this.matchWeights = {
      senderAddress: 10,
      senderName: 8,
      domainPattern: 9,
      subjectKeyword: 7,
      contentKeyword: 5
    };
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
   * Calculate base score for a rule/tag based on various factors
   * @param {Object} rule - Rule object containing keywords and patterns
   * @param {Object} sender - Sender information
   * @param {string} subject - Email subject
   * @param {string} content - Email content
   * @returns {number}
   */
  calculateBaseScore(rule, sender, subject, content) {
    if (!rule) return 0;

    let score = 0;

    // Check sender email keywords
    if (rule.senderKeywords) {
      const senderAddressMatches = this.countKeywordMatches(sender.email, rule.senderKeywords);
      score += senderAddressMatches * this.matchWeights.senderAddress;

      // Check sender name keywords
      const senderNameMatches = this.countKeywordMatches(sender.name, rule.senderKeywords);
      score += senderNameMatches * this.matchWeights.senderName;
    }

    // For tagging service compatibility, also check general keywords
    if (rule.keywords) {
      const senderAddressMatches = this.countKeywordMatches(sender.email, rule.keywords);
      score += senderAddressMatches * this.matchWeights.senderAddress;

      const senderNameMatches = this.countKeywordMatches(sender.name, rule.keywords);
      score += senderNameMatches * this.matchWeights.senderName;
    }

    // Check domain patterns
    if (rule.domainPatterns && sender.domain) {
      for (const pattern of rule.domainPatterns) {
        if (pattern.test(sender.domain)) {
          score += this.matchWeights.domainPattern;
          break; // Only count one domain match
        }
      }
    }

    // Check subject keywords
    const subjectKeywords = rule.subjectKeywords || rule.keywords;
    if (subjectKeywords) {
      const subjectMatches = this.countKeywordMatches(subject, subjectKeywords);
      score += subjectMatches * this.matchWeights.subjectKeyword;
    }

    // Check content keywords
    if (content) {
      const contentKeywords = rule.contentKeywords || rule.keywords;
      if (contentKeywords) {
        const contentMatches = this.countKeywordMatches(content, contentKeywords);
        score += contentMatches * this.matchWeights.contentKeyword;
      }
    }

    return score;
  }

  /**
   * Add custom rule validation
   * @param {string} ruleId 
   * @param {Object} rules 
   * @param {Object} ruleCollection 
   * @param {Array} priorityList 
   */
  addCustomRuleToCollection(ruleId, rules, ruleCollection, priorityList) {
    if (!ruleCollection[ruleId]) {
      ruleCollection[ruleId] = {
        senderKeywords: [],
        subjectKeywords: [],
        domainPatterns: [],
        contentKeywords: [],
        keywords: [] // For tagging service compatibility
      };
      if (!priorityList.includes(ruleId)) {
        priorityList.push(ruleId);
      }
    }

    if (rules.senderKeywords && Array.isArray(rules.senderKeywords)) {
      ruleCollection[ruleId].senderKeywords.push(...rules.senderKeywords);
    }

    if (rules.subjectKeywords && Array.isArray(rules.subjectKeywords)) {
      ruleCollection[ruleId].subjectKeywords.push(...rules.subjectKeywords);
    }

    if (rules.keywords && Array.isArray(rules.keywords)) {
      ruleCollection[ruleId].keywords.push(...rules.keywords);
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
      ruleCollection[ruleId].domainPatterns.push(...patterns);
    }

    if (rules.contentKeywords && Array.isArray(rules.contentKeywords)) {
      ruleCollection[ruleId].contentKeywords.push(...rules.contentKeywords);
    }
  }
}

module.exports = BaseEmailProcessor;
