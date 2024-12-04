// OpenAI client initialization

import { authOptions } from "@/lib/authOptions";
import {
  GPT4oAPI,
  speechToTextWhisperAPI,
  textToSpeechAPI,
} from "@/services/gptOperations";
import { createNewData } from "@/services/servicesOperations";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ status: "error", message: "Method Not Allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res
        .status(401)
        .json({ status: "error", message: "Yetkilendirme başarısız" });
    }
    // gelen sesi texte dönüştür:
    const transcribedText = await speechToTextWhisperAPI(req);

    // son 5 sohbeti çek:

    const conversationHistory = await prisma["conversation"].findMany({
      take: 5,

      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const chatHistory = [];
    conversationHistory.forEach((conversation) => {
      chatHistory.push({
        role: "user",
        content: conversation.userInput,
      });
      chatHistory.push({
        role: "assistant",
        content: conversation.assistantResponse,
      });
      console.log(conversation.createdAt);
    });
    const conversationToPost4o = [
      ...chatHistory,
      { role: "user", content: transcribedText },
    ];
    // dönüştürülen sesi ve son 10 mesajı gpt4o'ya gönder ve  text yanıtı al:
    const aiResponse = await GPT4oAPI(conversationToPost4o);
    console.log(conversationToPost4o);
    // ai ın  cevap textini sese dönüştür:

    const conversation = await createNewData("conversation", {
      userId: session.user.id,
      userInput: transcribedText,
      assistantResponse: aiResponse,
    });

    console.log(conversation);
    // AI'ın cevap textini sese dönüştür
    const audioArrayBuffer = await textToSpeechAPI(aiResponse);

    // Base64 formatına çevir
    const audioBase64 = Buffer.from(audioArrayBuffer).toString("base64");

    //url'ye çevir:
    const audioUrl = `data:audio/mp3;base64,${audioBase64}`;
    // JSON formatında geri döndür (data url olarak. )

    return res.status(200).json({
      success: true,
      message: "Audio response generated successfully.",
      data: {
        aiAudioUrl: audioUrl,
        aiText: aiResponse,
        userText: transcribedText,
      },
    });
  } catch (aiError) {
    console.log("AiError", aiError);
    return res.status(500).json({
      status: "error",
      message: aiError || "Error processing audio with AI",
    });
  }
}
export const config = {
  api: {
    bodyParser: false,
  },
};
