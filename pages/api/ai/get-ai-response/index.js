// OpenAI client initialization

import { authOptions } from "@/lib/authOptions";
import {
  GPT4oAPI,
  speechToTextWhisperAPI,
  textToSpeechAPI,
} from "@/services/gptOperations";
import { getFormDataWithFormidable } from "@/utils/formidable";
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
    // formidable ile multipart formdata olarak gelen ses ve fieldları alıyoruz:
    const [fields, files] = await getFormDataWithFormidable(req);

    // son  sohbet geçmişini fields içinden alıyoruz:
    let conversationHistory = JSON.parse(fields.conversations);

    // eğer sohbet geçmişi formda yoksa, db'den çek:
    if (!conversationHistory || conversationHistory.length == 0) {
      conversationHistory = await prisma["conversation"].findMany({
        take: 5,

        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    const audioFile = files.audio?.[0] || files.audio; // Handle both formidable v3 and v4

    if (!audioFile) {
      throw new Error(
        "Ses Yüklenirken bir hata oluştu. Lütfen Tekrar Deneyin."
      );
    }
    // gelen sesi texte dönüştür:
    const transcribedText = await speechToTextWhisperAPI(audioFile);

    // dönüştürülen sesi ve son 10 mesajı gpt4o'ya gönder ve  text yanıtı al:
    const aiResponse = await GPT4oAPI(conversationHistory, transcribedText);

    // ai ın  cevap textini sese dönüştür:

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
