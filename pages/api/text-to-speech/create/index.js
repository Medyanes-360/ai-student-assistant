import { textToSpeechAPI } from "@/services/gptOperations";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      status: "error",
      message: "Method not allowed",
    });
  }
  try {
    const { text } = req.body;
    const audioArrayBuffer = await textToSpeechAPI(text);

    res.setHeader("Content-Type", "audio/mp3");
    return res.send(Buffer.from(audioArrayBuffer));
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Sunucu Hatası",
    });
  }
}
