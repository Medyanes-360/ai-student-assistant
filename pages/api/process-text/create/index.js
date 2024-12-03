import { authOptions } from "@/lib/authOptions";
import { GPT4oAPI } from "@/services/gptOperations";
import { createNewData } from "@/services/servicesOperations";
import { getServerSession } from "next-auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({
      status: "error",
      message: "Method not allowed",
    });
  }
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res
        .status(401)
        .json({ status: "error", message: "Yetkilendirme başarısız" });
    }

    // Get AI feedback on the transcribed text

    const text = JSON.parse(req.body).text;

    const assistantMessage = await GPT4oAPI(text);

    await createNewData("conversation", {
      userId: session.user.id,
      userInput: text,
      assistantResponse: assistantMessage,
    });
    return res
      .status(201)
      .json({ status: "success", assistantMessage: assistantMessage });
  } catch (error) {
    const errorMessage = error.message || "Sunucu Hatası";
    return res.status(500).json({ status: "error", message: errorMessage });
  }
}
