// OpenAI client initialization

import { speechToTextWhisperAPI } from "@/services/gptOperations";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ status: "error", message: "Method Not Allowed" });
  }

  try {
    const transcribedText = await speechToTextWhisperAPI(req);

    return res.status(200).json({
      transcribedText: transcribedText,
    });
  } catch (aiError) {
    return res.status(500).json({
      status: "error",
      message: aiError || "Error processing audio with AI",
    });
  }
}
