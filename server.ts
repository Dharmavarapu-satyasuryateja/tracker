import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client setup
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. AI features will operate in demo/fallback mode.");
      return null;
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// AI Coach API Endpoint
app.post("/api/coach", async (req, res) => {
  try {
    const { prompt, history, systemInstruction } = req.body;
    
    const client = getGeminiClient();
    if (!client) {
      return res.status(503).json({
        error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your Secrets.",
        isDemo: true
      });
    }

    // Default system instruction to configure elite cricket coaching and student-athlete guidance
    const defaultInstruction = 
      "You are 'Coach Willow', an elite Cricket Fitness Coach, Sports Scientist, and Academic Balance Mentor. " +
      "You specialize in helping young student cricketers (ages 12-22) balance intensive athletic routines with studies. " +
      "Provide specific, encouraging, highly structured, and actionable guidance regarding:\n" +
      "1. Mobility and stability drills (e.g. shoulder care, hip mobility, core work).\n" +
      "2. Cricket-specific strength training (squats, deadlifts, pull-ups) and agility (ladder drills).\n" +
      "3. Nutritional timings (early morning meals, post-workout snacks, hydration).\n" +
      "4. Study-sport scheduling and fatigue management.\n\n" +
      "Always output beautiful Markdown format with clear bullet points and highlight physical recovery tips. Keep responses highly focused, positive, and strictly professional.";

    // Prepare contents array for conversational history
    let contents: any[] = [];
    
    if (history && Array.isArray(history)) {
      contents = history.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));
    }
    
    // Add current user prompt
    if (prompt) {
      contents.push({
        role: "user",
        parts: [{ text: prompt }]
      });
    }

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction || defaultInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      text: response.text || "Sorry, I couldn't formulate a recommendation. Please try again."
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Failed to communicate with the AI Coach. Details: " + (error.message || error)
    });
  }
});

// Setup Vite or Static assets serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started and listening on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start server:", err);
});
