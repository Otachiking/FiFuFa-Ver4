// FiFuFa (Five Fun Facts) 🖐🏻💡 by Muhammad Iqbal Rasyid - Telkom University
// Backend API: generates 5 interesting facts about a user-provided topic
// Powered by IBM Granite Instruct v3.3-8B via Replicate API

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Replicate from "replicate";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: "https://www.npmjs.com/package/create-replicate",
});
const model =
  "ibm-granite/granite-3.3-8b-instruct:618ecbe80773609e96ea19d8c96e708f6f2b368bb89be8fad509983194466bf8";

// Endpoint API
app.post("/api/facts", async (req, res) => {
  try {
    const { topic, more = false } = req.body;

    // Ubah prompt berdasarkan apakah ini request "more" atau tidak
    const promptText = more 
      ? `(facts 6-10) List 5 unpopular facts about ${topic}. Each <35 word & give relevant emojis. Be Unique`
      : `List 5 popular about ${topic}. Each <35 word & give relevant emojis`;

    const input = {
      top_k: 50,
      top_p: 0.9,
      prompt: promptText,
      max_tokens: 250,
      temperature: 0.6,
      presence_penalty: 0.6,
      frequency_penalty: 0.6,
    };

    console.log("Requesting facts about:", topic, more ? "(more facts)" : "");

    const output = await replicate.run(model, { input });
    const factsRaw = output.join("");

    // REGEX REMOVE NUMBERING
    const facts = factsRaw
      .split(/\s*(?:\d+\.\s+|[-*]\s+)/) // Split by numbers/bullets
      .filter(Boolean) // Remove empty
      .map((f) => f.trim().replace(/^\d+\.\s*/, '')) // Remove any remaining "1. " pattern
      .filter((f) => f.length > 0); // Remove empty after cleaning

    console.log("Clean facts:", facts);

    res.json({ facts }); // Send clean facts without numbers
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Backend running at http://localhost:${PORT}`)
);