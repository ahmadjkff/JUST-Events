import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /ai/generate-description
router.post("/generate-description", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const prompt = `Generate a professional, engaging, and concise event description for an event titled "${title}". The tone should be inviting and suitable for a university event platform. Keep it short and under 200 characters.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that writes event descriptions.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 100, // Adjust max_tokens if needed
    });

    // Extract description
    let description = completion.choices?.[0]?.message?.content?.trim() ?? "";

    // Force truncate to 200 characters if necessary
    if (description.length > 200) {
      description = description.slice(0, 200) + "...";
    }

    res.json({ description });
  } catch (error: any) {
    console.error("AI generation error:", error.message);
    res.status(500).json({ message: "Error generating description" });
  }
});

export default router;
