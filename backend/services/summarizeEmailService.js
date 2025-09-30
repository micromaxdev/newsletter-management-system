const mongoose = require('mongoose');
const email = require('../models/emailModel');
const SummarizedEmail = require('../models/summarizedEmailModel');
const generationConfig = require('../models/generationConfigModel');
const { getGeminiModel } = require('../config/gemini');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

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
const saveSummarizedEmail = async (emailId, summarizedResult, cleanedHTML) => {
    const existingSummarizedEmail = await SummarizedEmail.findOneAndUpdate(
        { originalEmailId: emailId },
        {
            title: summarizedResult.title,
            summary: summarizedResult.summary,
            cleanedHTML: cleanedHTML,
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
      const cleanedHTML = cleanHTML(existingEmail.html || '', summarizedResult.title || existingEmail.subject || 'Newsletter', existingEmail.date);

      await markEmailAsSummarized(existingEmail);
      const summarizedEmailDoc = await saveSummarizedEmail(emailId, summarizedResult, cleanedHTML);
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
    
    // Create case-insensitive regex patterns for each tag
    const tagRegexArray = tags.map(tag => new RegExp(`^${tag}$`, 'i'));
    
    const emailsToSummarize = await email.find({
        folderId: folderId,
        tags: {$all: tagRegexArray}, // Case-insensitive matching for all tags
        isSummarized: { $ne: true },
    });
    
    console.log(`Found ${emailsToSummarize.length} emails to summarize for folder: ${folderId}, tags: ${tags}`);
    
    const results = [];
    for (const emailId of emailsToSummarize.map(email => email._id )) {
        try {
            const result = await summarizeEmailContent(emailId, {});
            results.push({ emailId, status: 'success', result });
        } catch (error) {
            console.error(`Error summarizing email ${emailId}:`, error.message);
            results.push({ emailId, status: 'error', error: error.message });
        }
    }
    return results;
};

const autoBulkSummarize = async ()=>{
    const configs = await generationConfig.find();
    for (const config of configs) {
        try {
            console.log(`Starting bulk summarization for folder: ${config.folder}, tag: ${config.tag}`);
            await bulkSummarizeEmails(config.folder, config.tag);
            console.log(`Completed bulk summarization for folder: ${config.folder}, tag: ${config.tag}`);
        } catch (error) {
            console.error(`Error during bulk summarization for folder: ${config.folder}, tag: ${config.tag}`, error);
        }
    }
}
// Load logo as base64 once when the module loads
const getLogoBase64 = () => {
    try {
        const logoPath = path.join(__dirname, '../config/micromaxLogo.png');
        const logoBuffer = fs.readFileSync(logoPath);
        return logoBuffer.toString('base64');
    } catch (error) {
        console.error('Error loading logo:', error);
        return ''; // Return empty string if logo can't be loaded
    }
};

// Load template once when the module loads
const getEmailTemplate = () => {
    try {
        const templatePath = path.join(__dirname, '../config/emailTemplate.html');
        return fs.readFileSync(templatePath, 'utf-8');
    } catch (error) {
        console.error('Error loading email template:', error);
        // Return a basic template if file can't be loaded
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}}</title>
</head>
<body>
    <h1>{{TITLE}}</h1>
    <div>{{CONTENT}}</div>
</body>
</html>`;
    }
};

// Cache the logo and template
const LOGO_BASE64 = getLogoBase64();
const EMAIL_TEMPLATE = getEmailTemplate();

// Function to inject content into the template
const injectContentIntoTemplate = (content, title = 'Newsletter', customDate = null) => {
    const currentDate = customDate || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return EMAIL_TEMPLATE
        .replace(/{{LOGO_BASE64}}/g, LOGO_BASE64)
        .replace(/{{TITLE}}/g, title)
        .replace(/{{DATE}}/g, currentDate)
        .replace(/{{CONTENT}}/g, content);
};

// const cleanHTML = (html, title = 'Newsletter', customDate = null) => {
//     const $ = cheerio.load(html);

//     // 1. Extract the specific main content that you want to keep
//     // In your provided HTML, this is within <div class="content-body">
//     let extractedContent = $('.content-body').html();

//     if (!extractedContent) {
//         // Fallback or error handling if .content-body is not found
//         console.warn("'.content-body' not found, attempting to get entire body HTML.");
//         extractedContent = $('body').html();
//     }

//     // Now, load the extracted content into cheerio for further cleaning
//     const $cleaned = cheerio.load(extractedContent);

//     // Remove greeting line(s) from the extracted content
//     $cleaned('p').each((i, el) => {
//         const text = $cleaned(el).text().toLowerCase();
//         if (text.startsWith('hi&nbsp;') || text.startsWith('dear ')) { // Added &nbsp; as seen in your HTML
//             $cleaned(el).remove();
//         }
//     });

//     // Remove contact info from the extracted content
//     $cleaned('p').each((i, el) => {
//         const text = $cleaned(el).text().toLowerCase();
//         if (text.includes('contact:') || text.includes('email:') || text.includes('@micromax.com.au')) {
//             $cleaned(el).remove();
//         }
//     });
    
//     // Remove tables with display: none and their contents
//     $cleaned('table[style*="display: none"]').remove();

//     // Remove images with display: none
//     $cleaned('img[style*="display: none"]').remove();

//     // Remove empty <p> tags that might have resulted from removals
//     $cleaned('p').each((i, el) => {
//         if ($cleaned(el).html().trim() === '' || $cleaned(el).html().trim() === '&nbsp;') {
//             $cleaned(el).remove();
//         }
//     });

//     // Get the final cleaned HTML string of the body content
//     const finalCleanedContent = $cleaned.html();

//     // Inject into the new template
//     return injectContentIntoTemplate(finalCleanedContent, title, customDate);
// };
const cleanHTML = (html, title = 'Newsletter', customDate = null, removeLastBlocks = 3) => {
    const $ = cheerio.load(html);

    // 1. Extract the specific main content
    let extractedContent = $('.content-body').html();

    if (!extractedContent) {
        console.warn("'.content-body' not found, attempting to get entire body HTML.");
        extractedContent = $('body').html();
    }

    // Load the extracted content for cleaning
    const $cleaned = cheerio.load(extractedContent);

    // 2. Remove greeting line(s)
    $cleaned('p').each((i, el) => {
        const text = $cleaned(el).text().toLowerCase();
        if (text.startsWith('hi ') || text.startsWith('dear ')) {
            $cleaned(el).remove();
        }
    });

    // 3. Remove contact info
    $cleaned('p').each((i, el) => {
        const text = $cleaned(el).text().toLowerCase();
        if (text.includes('contact:') || text.includes('email:') || text.includes('@micromax.com.au')) {
            $cleaned(el).remove();
        }
    });

    // 4. Remove hidden tables
    $cleaned('table[style*="display: none"]').remove();

    // 5. Remove hidden images
    $cleaned('img[style*="display: none"]').remove();

    // 6. Remove empty <p> tags
    $cleaned('p').each((i, el) => {
        if ($cleaned(el).html().trim() === '' || $cleaned(el).html().trim() === '&nbsp;') {
            $cleaned(el).remove();
        }
    });

    // 7. Remove the last N block containers (<div> or <table>)
    const blocks = $cleaned('div, table'); 
    const removeCount = Math.min(removeLastBlocks, blocks.length);
    for (let i = 0; i < removeCount; i++) {
        $cleaned(blocks[blocks.length - 1 - i]).remove();
    }

    // 8. Final cleaned HTML string
    const finalCleanedContent = $cleaned.html();

    // 9. Inject into your template
    return injectContentIntoTemplate(finalCleanedContent, title, customDate);
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
    bulkSummarizeEmails,
    cleanHTML,
    injectContentIntoTemplate,
    autoBulkSummarize
};
