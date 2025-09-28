// FiFuFa (Five Fun Facts) 🖐🏻💡 by Muhammad Iqbal Rasyid - Telkom University
// Backend API: generates 5 interesting facts about a user-provided topic
// NOTE: Currently mocked with static Bakso facts for testing.
// Powered by IBM Granite Instruct v3.3-8B via Replicate API (commented out).

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import Replicate from "replicate"; // commented out for static test

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// const replicate = new Replicate({
//   auth: process.env.REPLICATE_API_TOKEN,
//   userAgent: "https://www.npmjs.com/package/create-replicate",
// });
// const model =
//   "ibm-granite/granite-3.3-8b-instruct:618ecbe80773609e96ea19d8c96e708f6f2b368bb89be8fad509983194466bf8";

// -------- Static Test Endpoint --------
app.post("/api/facts", (req, res) => {
  // Mock raw result in a single paragraph
  const factsRaw = `
1. 🍖 Bakso, a popular Indonesian meatball dish  
2. 🌮 Unlike its Western counterpart, Bakso doesn't use bread as a dipping companion; instead, it's enjoyed directly from the bowl or with a side of sambal (chili sauce). 😋  
3. 🕒 The origin of Bakso can be traced back to the Dutch colonial era when Chinese indentured laborers introduced meatballs to Indonesians, who adapted the recipe using local ingredients. 🤝  
4. 🎭 In Indonesia, Bakso is not only a delicious street food but also appears in various street.  
5. 🌑 Bakso is typically made from a mixture of ground beef, tapioca starch, and various spices. It's often served in a flavorful broth with noodles and vegetables.
  `;

  // Regex split:
  const factsArray = factsRaw
    .split(/^\s*\d[\.\)]\s+/m) // match "1. ", "2. ", also with newlines
    .filter(s => s.trim().length > 0) // drop blanks
    .map(f => f.trim());

  // Store into variables
  const [fact1, fact2, fact3, fact4, fact5] = factsArray;

  console.log("Parsed Facts:");
  console.log(fact1);
  console.log(fact2);
  console.log(fact3);
  console.log(fact4);
  console.log(fact5);

  // Return as array (frontend expects `facts: [...]`)
  res.json({ facts: factsArray });
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Backend running at http://localhost:${PORT}`)
);
