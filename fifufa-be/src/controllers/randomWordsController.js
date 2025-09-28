import { validateLanguage } from '../utils/validation.js';
import { getRandomWordsPrompt } from '../utils/prompts.js';
import { logger } from '../utils/logger.js';
import { replicate, model } from '../config/replicate.js';

// Language-specific word caches
const wordCaches = {
  en: { words: [], index: 0 },
  id: { words: [], index: 0 }
};

export const getRandomWord = async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    const validLanguage = validateLanguage(language);
    const cache = wordCaches[validLanguage];

    // Check if we need to refill cache
    if (cache.words.length === 0 || cache.index >= cache.words.length) {
      logger.info(`Generating new batch of random words [${validLanguage}]...`);

      const promptText = getRandomWordsPrompt(validLanguage);
      
      const input = {
        top_k: 50,
        top_p: 0.9,
        prompt: promptText,
        max_tokens: 150,
        temperature: 0.8,
        presence_penalty: 0.7,
        frequency_penalty: 0.7,
      };

      const output = await replicate.run(model, { input });
      const wordsRaw = output.join("");

      // Parse words from response
      cache.words = wordsRaw
        .replace(/\d+\.\s*/g, "") // Remove numbering
        .split(/[,\n]/) // Split by comma or newline
        .map((w) => w.trim().toLowerCase())
        .filter((w) => w.length > 0 && w.length < 25)
        .slice(0, 10);

      cache.index = 0;
      logger.info(`Generated word cache [${validLanguage}]: [${cache.words.join(", ")}]`);
    }

    // Return next word from cache
    if (cache.index < cache.words.length) {
      const randomWord = cache.words[cache.index];
      cache.index++;

      logger.info(`Served random word [${validLanguage}] ${cache.index}/10: "${randomWord}" (${cache.words.length - cache.index} remaining)`);
      
      res.json({
        word: randomWord,
        language: validLanguage,
        remaining: cache.words.length - cache.index,
      });
    } else {
      logger.error(`No words available in cache [${validLanguage}]`);
      res.status(500).json({ error: "No words available" });
    }
  } catch (error) {
    logger.error(`Random words API Error: ${error.message}`);
    res.status(500).json({ error: "Failed to generate random word" });
  }
};