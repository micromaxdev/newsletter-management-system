const mongoose = require('mongoose');
const email = require('../models/emailModel');
const SummarizedEmail = require('../models/summarizedEmailModel');
const { getGeminiModel } = require('../config/gemini');
const fs = require('fs');
const path = require('path');

const promptTemplate = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/systemPrompt.json'), 'utf-8'));

const validateEmailId = (emailId) => {
    if (!emailId || !mongoose.Types.ObjectId.isValid(emailId)) {
        throw new Error('Invalid email ID format');
    }
};

const getAndValidateEmail = async (emailId) => {
    const existingEmail = await email.findById(emailId);
    if (!existingEmail) {
        throw new Error('Email not found');
    }
    
    const content = existingEmail.text || existingEmail.html || '';
    if (!content) {
        throw new Error('Email content is empty');
    }

    return { existingEmail, content };
};

const generateSummaryWithGemini = async (content, options = {}) => {
    // Remove all defaults from here - just use what's passed in
    const {
        temperature,
        topP,
        topK,
        maxOutputTokens,
        modelName
    } = options;

    // Create generation config only with provided values
    const generationConfig = {};
    if (temperature !== undefined) generationConfig.temperature = temperature;
    if (topP !== undefined) generationConfig.topP = topP;
    if (topK !== undefined) generationConfig.topK = topK;
    if (maxOutputTokens !== undefined) generationConfig.maxOutputTokens = maxOutputTokens;

    const geminiModel = getGeminiModel(modelName || "gemini-2.0-flash", generationConfig);
    if (!geminiModel) {
        throw new Error('Gemini model not initialized');
    }

    const escapedContent = JSON.stringify(content).slice(1, -1);
    
    const enhancedPrompt = JSON.stringify(promptTemplate).replace('{emailContent}', escapedContent) + 
        '\n\nPlease respond with ONLY valid JSON in the exact format specified above, without markdown code blocks or additional text.';
    
    const result = await geminiModel.generateContent(enhancedPrompt);
    
    const response = result.response;
    return await response.text();
};

const parseAndValidateSummary = (text) => {
    let summarizedResult;
    try {
        // Remove markdown code blocks and extra whitespace
        let cleanedText = text.trim();
        
        // Remove ```json at the beginning
        if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.substring(7);
        }
        
        // Remove ``` at the end
        if (cleanedText.endsWith('```')) {
            cleanedText = cleanedText.substring(0, cleanedText.length - 3);
        }
        
        // Clean up any remaining whitespace
        cleanedText = cleanedText.trim();
        
        summarizedResult = JSON.parse(cleanedText);
    } catch (parseError) {
        console.error('Failed to parse Gemini response as JSON:', text);
        console.error('Parse error:', parseError.message);
        throw new Error('Invalid response format from AI service');
    }

    if (!summarizedResult.title || !summarizedResult.summary) {
        throw new Error('Incomplete response from AI service');
    }

    return summarizedResult;
};

const markEmailAsSummarized = async (existingEmail) => {
    existingEmail.isSummarized = true;
    await existingEmail.save();
};
const setApprovalStatus = async (emailId, isApproved) => {
    const summarizedEmailDoc = await SummarizedEmail.findById(emailId);
    if (!summarizedEmailDoc) {
        throw new Error('Summarized email not found');
    }
    summarizedEmailDoc.isApproved = isApproved;
    await summarizedEmailDoc.save();
    return summarizedEmailDoc;
};
const saveSummarizedEmail = async (emailId, summarizedResult) => {
    const existingSummarizedEmail = await SummarizedEmail.findOneAndUpdate(
        { originalEmailId: emailId },
        {
            title: summarizedResult.title,
            summary: summarizedResult.summary,
            seo: summarizedResult.seo,
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return existingSummarizedEmail;
};

// Function to summarize email content using Google Gemini
const summarizeEmailContent = async (emailId, options = {}) => {
    try {
      
      validateEmailId(emailId);

      const { existingEmail, content } = await getAndValidateEmail(emailId);

      const text = await generateSummaryWithGemini(content, options);

      const summarizedResult = parseAndValidateSummary(text);

      await markEmailAsSummarized(existingEmail);
      const summarizedEmailDoc = await saveSummarizedEmail(emailId, summarizedResult);
      await setApprovalStatus(summarizedEmailDoc._id, false); // re-mark as not approved upon re-summarization
      
      // Return the summarized contents
      return summarizedEmailDoc;
    } catch (error) {
      console.error('Error summarizing email content:', error);
      throw new Error(`Failed to summarize email content: ${error.message}`);
    }
};

const bulkSummarizeEmails = async (folderId, tagInput) => {
    if (!folderId || !tagInput) {
        throw new Error('Folder and tag must be provided for bulk summarization');
    }
    const tags = Array.isArray(tagInput) ? tagInput : [tagInput];
    const emailsToSummarize = await email.find({
        folderId: folderId,
        tags: {$all: tags}, //handling matches of 2 tags
        isSummarized: { $ne: true },
    });
    const results = [];
    for (const emailId of emailsToSummarize.map(email => email._id )) {
        try {
            const result = await summarizeEmailContent(emailId, {});
            results.push({ emailId, status: 'success', result });
        } catch (error) {
            results.push({ emailId, status: 'error', error: error.message });
        }
    }
    return results;
};

module.exports = {
    validateEmailId,
    getAndValidateEmail,
    generateSummaryWithGemini,
    parseAndValidateSummary,
    markEmailAsSummarized,
    saveSummarizedEmail,
    summarizeEmailContent,
    setApprovalStatus,
    bulkSummarizeEmails
};