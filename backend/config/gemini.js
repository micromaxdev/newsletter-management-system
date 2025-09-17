const { GoogleGenerativeAI } = require("@google/generative-ai");

let model = null;

/**
 * Initializes the Google Gemini model.
 * This should be called once when the application starts.
 */
const initializeGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. AI features will be disabled.");
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log("[SYSTEM] Google Gemini client initialized.");
  } catch (error) {
    console.error("Error initializing Google Gemini client:", error);
  }
};

/**
 * Returns the initialized Gemini model instance.
 * @returns {GenerativeModel | null}
 */
const getGeminiModel = () => {
  if (!model) {
    console.error("[Google Gemini] model is not initialized.");
  }
  return model;
};

module.exports = {
  initializeGemini,
  getGeminiModel,
};
