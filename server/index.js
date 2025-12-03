import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
// Updated default to a currently supported model
const MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

// Health check
app.get("/", (req, res) => {
  res.send("AI Backend is running ✔️");
});

app.post("/api/generate", async (req, res) => {
  try {
    const requestBody = req.body;

    if (!requestBody || !requestBody.messages) {
      return res.status(400).json({ error: "Invalid request body from client" });
    }

    // Use the model specified by the client, or default to Groq model
    requestBody.model = requestBody.model || MODEL;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Groq API Error:", errorBody);
      return res.status(response.status).json({ error: "Failed to fetch from Groq", details: errorBody });
    }
    
    const result = await response.json();
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(result);

  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 AI backend running on http://localhost:${PORT}`);
});
