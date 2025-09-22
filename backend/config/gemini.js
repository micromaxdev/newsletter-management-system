const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;

/**
 * Initializes the Google Gemini client.
 * This should be called once when the application starts.
 */
const initializeGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. AI features will be disabled.");
    return;
  }

  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log("[SYSTEM] Google Gemini client initialized.");
  } catch (error) {
    console.error("Error initializing Google Gemini client:", error);
  }
};

/**
 * Returns a Gemini model instance with the specified model name and generation config.
 * @param {string} modelName - The model to use (default from env or "gemini-2.0-flash")
 * @param {Object} generationConfig - Configuration for generation (temperature, etc.)
 * @returns {GenerativeModel | null}
 */
const getGeminiModel = (modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash", generationConfig = {}) => {
  if (!genAI) {
    console.error("[Google Gemini] client is not initialized.");
    return null;
  }
  
  try {
    const defaultConfig = {
      temperature: 0.3,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 1000,
    };
    
    const config = { ...defaultConfig, ...generationConfig };
    
    return genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: config
    });
  } catch (error) {
    console.error(`Error getting model ${modelName}:`, error);
    return null;
  }
};

module.exports = {
  initializeGemini,
  getGeminiModel,
};
