import { create } from "zustand";

const useChatStore = create((set, get) => ({
  loading: false,
  error: null,
  aiAudioUrl: null, // base64 formatında audio dosyası. mp3'e tekrar dönüştürmek için: const audio = new Audio(`data:audio/mp3;base64,${response.audio}`);
  aiText: "",
  userText: "",

  getAiResponse: async (formData) => {
    set((state) => ({
      ...state,
      loading: true,
    }));

    const aiResponse = await fetch("/api/ai/get-ai-response", {
      method: "POST",

      body: formData,
    });
    const json = await aiResponse.json();
    if (!json.success) {
      // hata gönder.
    }
    const { aiAudioUrl, aiText, userText } = json.data;
    set((state) => ({
      ...state,
      loading: false,
      aiAudioUrl,
      aiText,
      userText,
    }));
  },
  setAiAudioBase64: (audioBase64) =>
    set((state) => ({
      ...state,
      transcribedText: audioBase64,
    })),

  setAiText: (text) =>
    set((state) => ({
      ...state,
      aiText: text,
    })),

  setUserText: (text) =>
    set((state) => ({
      ...state,
      userText: text,
    })),
  setLoading: (loadingState) =>
    set((state) => ({ ...state, loading: loadingState })),
}));

export default useChatStore;
