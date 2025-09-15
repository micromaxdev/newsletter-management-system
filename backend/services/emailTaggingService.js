const fs = require('fs');
const path = require('path');
const BaseEmailProcessor = require('./baseEmailProcessor');

class EmailTaggingService extends BaseEmailProcessor {
  constructor() {
    super(); // Call parent constructor to initialize matchWeights
    
    // Define comprehensive tagging rules with enhanced patterns
    this.tags = {
      technology: {
        keywords: [
          'technology', 'tech', 'software', 'hardware', 'IT', 'information technology',
          'computer', 'developer', 'programmer', 'code', 'coding', 'programming',
          'data', 'database', 'cloud', 'security', 'cybersecurity', 'network',
          'innovation', 'gadget', 'device', 'digital', 'virtual', 'augmented reality',
          'virtual reality', 'VR', 'AR', 'SaaS', 'platform', 'API'
        ],
        domainPatterns: [
          /.*tech.*/, /.*software.*/, /.*hardware.*/, /.*it.*/, /.*cloud.*/
        ]
      },
      financial: {
        keywords: [
          'finance', 'financial', 'fintech', 'investment', 'stock', 'market',
          'trading', 'economy', 'economic', 'bank', 'banking', 'payment',
          'billing', 'invoice', 'purchase', 'receipt', 'transaction', 'revenue',
          'profit', 'loss', 'asset', 'liability', 'equity', 'capital', 'funding',
          'cryptocurrency', 'bitcoin', 'ethereum', 'blockchain'
        ],
        domainPatterns: [
          /.*finance.*/, /.*invest.*/, /.*bank.*/, /.*fintech.*/
        ]
      },
      AI: {
        keywords: [
          'artificial intelligence', 'AI', 'machine learning', 'ML', 'deep learning',
          'neural network', 'natural language processing', 'NLP', 'computer vision',
          'data science', 'automation', 'robotics', 'chatbot', 'generative AI',
          'large language model', 'LLM', 'GPT', 'Bard', 'Gemini'
        ],
        domainPatterns: [
          /.*ai.*/, /.*ml.*/, /.*openai.*/, /.*deepmind.*/
        ]
      },
      health: {
        keywords: [
          'health', 'healthcare', 'medical', 'medicine', 'doctor', 'hospital',
          'clinic', 'patient', 'treatment', 'disease', 'wellness', 'fitness',
          'nutrition', 'pharmaceutical', 'biotech', 'mental health', 'therapy',
          'telehealth', 'telemedicine'
        ],
        domainPatterns: [
          /.*health.*/, /.*medical.*/, /.*pharma.*/, /.*biotech.*/
        ]
      }
    };

    // Minimum score threshold for assigning a tag (increased to be more strict)
    this.minTagScore = 25;
  }

  /**
   * Generate tags for an email based on sender, subject, and content
   * @param {Object} emailData - Email object with from, subject, text, html
   * @returns {Array<string>} - A list of generated tags
   */
  generateTags(emailData) {
    const sender = this.extractSenderInfo(emailData);
    const subject = (emailData.subject || '').toLowerCase();
    const content = this.extractContent(emailData);
    const tagScores = {};

    // Calculate scores for each tag
    for (const tagId in this.tags) {
      tagScores[tagId] = this.calculateTagScore(
        tagId, sender, subject, content
      );
    }

    // Sort tags by score in descending order
    const sortedTags = Object.entries(tagScores)
      .filter(([tagId, score]) => score >= this.minTagScore)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

    // Get the top 2 tags, but only if they meet the threshold
    const generatedTags = sortedTags.length > 0 ? sortedTags.slice(0, 2).map(([tagId]) => tagId) : [];

    console.log(`🏷️ Email tagging:`, {
      subject: emailData.subject?.substring(0, 50) + '...',
      from: sender.email,
      scores: tagScores,
      assignedTags: generatedTags,
      minThreshold: this.minTagScore
    });

    return generatedTags;
  }

  /**
   * Calculate tag score based on various factors
   * @param {string} tagId
   * @param {Object} sender
   * @param {string} subject
   * @param {string} content
   * @returns {number}
   */
  calculateTagScore(tagId, sender, subject, content) {
    const tag = this.tags[tagId];
    return this.calculateBaseScore(tag, sender, subject, content);
  }
}

module.exports = EmailTaggingService;
