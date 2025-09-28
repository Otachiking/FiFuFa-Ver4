import { validateTopic, validateLanguage } from '../utils/validation.js';
import { getFactsPrompt } from '../utils/prompts.js';
import { logger } from '../utils/logger.js';
import { replicate, model } from '../config/replicate.js';

export const generateFacts = async (req, res) => {
  try {
    const { topic, language = 'en', more = false } = req.body;

    // Validation
    const topicValidation = validateTopic(topic);
    if (!topicValidation.isValid) {
      const errorMap = {
        TOPIC_REQUIRED: "Topic is required",
        TOPIC_TOO_SHORT: "Topic too short (minimum 2 characters)",
        TOPIC_TOO_LONG: "Topic too long (maximum 50 characters)"
      };
      
      logger.warn(`API request failed: ${errorMap[topicValidation.error]}`);
      return res.status(400).json({ error: errorMap[topicValidation.error] });
    }

    const validLanguage = validateLanguage(language);
    const sanitizedTopic = topicValidation.sanitizedTopic;
    
    const promptText = getFactsPrompt(sanitizedTopic, validLanguage, more);

    const input = {
      top_k: 50,
      top_p: 0.7,
      prompt: promptText,
      max_tokens: 250,
      temperature: 0.3,
      presence_penalty: 0.4,
      frequency_penalty: 0.3,
    };

    logger.info(`Facts requested [${validLanguage}] for topic: "${sanitizedTopic}" ${more ? "(unpopular)" : "(popular)"}`);

    const output = await replicate.run(model, { input });
    const factsRaw = output.join("");

    // Clean and format facts
    const facts = factsRaw
      .split(/\s*(?:\d+\.\s+|[-*]\s+)/)
      .filter(Boolean)
      .map((f) => f.trim().replace(/^\d+\.\s*/, ""))
      .filter((f) => f.length > 0);

    logger.success(`Result [${validLanguage}] (${facts.length} facts): Generated successfully`);

    res.json({ facts, language: validLanguage });
  } catch (error) {
    logger.error(`Facts API Error: ${error.message}`);
    if (error.status === 429) {
      res.status(429).json({ error: "Too many requests. Please wait a moment." });
    } else {
      res.status(500).json({ error: "Something went wrong." });
    }
  }
};