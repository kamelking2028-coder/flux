import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({ origin: "https://kamelking2028-coder.github.io" }));

const HF_KEY = process.env.HF_KEY;

app.post("/generate", async (req, res) => {
  const { prompt, model } = req.body;
  if (!prompt) return res.json({ error: "no prompt" });

  const modelName = model || "prompthero/openjourney-v4";
  const apiUrl = `https://api-inference.huggingface.co/models/${modelName}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt, options: { use_cache: false } }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.json({ error: "HuggingFace API error", code: response.status, details: errorText });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const base64 = buffer.toString("base64");
    res.json({ model: modelName, image_base64: base64 });
  } catch (err) {
    res.json({ error: "fetch failed", details: err.message });
  }
});

app.get("/", (req, res) => res.send("Proxy HuggingFace OK ✅"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

