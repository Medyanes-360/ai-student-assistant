import openai from "@/lib/openai";
import fs from "fs";
import formidable from "formidable";

import path from "path";

export const speechToTextWhisperAPI = async (req) => {
  // upload edilen sesi geçici olarak depoluyoruz:
  const uploadDir = path.join("/tmp", "uploads");
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  } catch (err) {
    throw new Error("Server configuration error :" + (err.message || ""));
  }

  // Configure formidable
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB limit
  });

  //formidable ile gönderilen veriyi alıyoruz
  const [fields, files] = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve([fields, files]);
    });
  });

  // Ses dosyasının var olup olmadığını kontrol ediyoruz
  const audioFile = files.audio?.[0] || files.audio; // Handle both formidable v3 and v4

  if (!audioFile) {
    throw new Error("Ses Yüklenirken bir hata oluştu. Lütfen Tekrar Deneyin.");
  }
  // Ses dosyasını gpt'ye gönderilebilir hale getiriyoruz
  const audioData = fs.createReadStream(audioFile.filepath);

  if (!audioData) {
    throw new Error("Ses Yüklenirken bir hata oluştu. Lütfen Tekrar Deneyin.");
  }

  // gpt'ye ses dosyasını gönderiyoruz.
  const transcription = await openai.audio.transcriptions.create({
    file: audioData,
    model: "whisper-1",
    language: "en",
  });

  if (!transcription) {
    throw new Error("Yapay Zeka Sesi işlerken bir sorunla karşılaştı.");
  }

  // Clean up: geçici olarak upload ettiğimiz ses dosyasını siliyoruz.
  fs.unlink(audioFile.filepath, (err) => {
    if (err) {
      throw new Error(err.message);
    }
  });
  // bütün işlemler başarılı, error fırlatılmadı.  sesten oluşturduğumuz texti dönüyoruz:
  return transcription.text;
};

export const GPT4oAPI = async (chatHistory) => {
  if (!chatHistory || chatHistory.length == 0) {
    throw new Error("Metin Algılanamadı.");
  }

  const messages = [
    // ilk mesajımız sistem mesajı, bu mesajda kuralları belirtiyoruz:
    {
      role: "system",
      content: `If they ask you to do something else, give this answer: ‘I am an artificial intelligence trained only to teach English.’ Your main goal is to speak English with the student. If I ask you to write a code, say that you can't do that and that you are trained to teach English. You are a kind, supportive, and encouraging language assistant designed to help preschool children develop their English language skills. You understand input in both Turkish and English and always reply in English. Your goal is to understand their speech and provide appropriate feedback in terms of grammar and pronunciation, making the learning process enjoyable and effective. The user who spoke to you has a low level of English.
**Communication Guidelines:**
- **Input Languages:** Turkish and English
- **Response Language:** English
- **Tone:** Kind, patient, cheerful, and supportive
- **Language Level:** Use simple and understandable words appropriate for preschool children
- **Sentence Structure:** Short and clear sentences; avoid complex structures and advanced vocabulary
- **Pacing:** Provide information in small, easy-to-follow segments to simulate slower communication
- **Communication:** Try to continue the conversation by looking older chat messages **
**Remember to start with praise, gently correct mistakes by modeling the correct expression, and end with encouraging words. speak more slowly and use slower sentences.**
**You are a conversational assistant. Maintain context and respond naturally to the user.**
`,
    },
    // son 10 mesaj + gönderilen son cevabı ekliyoruz:
    ...chatHistory,
  ];

  const completion = await openai.chat.completions.create({
    model: "ft:gpt-4o-2024-08-06:personal::AaXK73ve",
    audio: { voice: "alloy", format: "wav" },
    messages: messages,

    temperature: 0.7,
  });

  if (!completion) {
    throw new Error("Yapay zeka metni işlerken bir sorunla karşılaştı.");
  }
  const response = completion.choices[0].message.content;

  return response;
};

export const textToSpeechAPI = async (text) => {
  if (!text || text.trim() == "") {
    throw new Error("Metin Algılanamadı.");
  }

  const voiceFile = openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text,
    speed: 0.9,
  });

  if (!voiceFile) {
    throw new Error("Metin sese dönüştürülürken hatayla karşılaşıldı.");
  }

  const audioArrayBuffer = await (await voiceFile).arrayBuffer();

  if (!audioArrayBuffer) {
    throw new Error("Metin sese dönüştürülürken hatayla karşılaşıldı");
  }
  return audioArrayBuffer;
};
