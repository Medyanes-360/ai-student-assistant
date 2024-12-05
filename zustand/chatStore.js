import { create } from "zustand";
import useConversationStore from "./conversationStore";
import { formDataPostAPI } from "@/services/fetchApi";

const useChatStore = create((set, get) => ({
  loading: false,
  error: null,
  aiAudioUrl: null, // base64 formatında audio dosyası. mp3'e tekrar dönüştürmek için: const audio = new Audio(`data:audio/mp3;base64,${response.audio}`);
  aiText: "",
  userText: "",

  getAiResponse: async (blob) => {
    set((state) => ({
      ...state,
      loading: true,
    }));

    const formData = new FormData();
    // formData'ya audio blob'unu yükle:
    formData.append("audio", blob, "audio.wav");

    //son 10 conversation'u yükle:
    const lastTenConversation = useConversationStore
      .getState()
      .conversations.slice(0, 10);

    formData.append("conversations", JSON.stringify(lastTenConversation));

    const aiResponse = await formDataPostAPI("/ai/get-ai-response", formData);

    const { aiAudioUrl, aiText, userText } = aiResponse.data;
    set((state) => ({
      ...state,
      loading: false,
      aiAudioUrl,
      aiText,
      userText,
    }));
    await useConversationStore.getState().createConversation(userText, aiText);
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
