import { postAPI } from "@/services/fetchApi";
import { create } from "zustand";
import useChatStore from "./chatStore";

const useConversationStore = create((set, get) => ({
  loading: false,
  error: null,
  conversations: [],

  getConversations: async () => {
    set((state) => ({
      ...state,
      loading: true,
    }));

    const skip = get().conversations.length; // kaç tane conversationu geçecek?
    const take = 5; // çekilecek miktar, 10 conversation = toplam 20 mesaj (10 speakbuddy 10 kullanıcı)

    const res = await fetch(
      `/api/conversation/get-conversations?skip=${skip}&take=${take}`
    );

    const json = await res.json();

    if (!json.success) {
      // hata gönder.
    }

    const newConversations = json.conversations;

    set((state) => ({
      ...state,
      loading: false,
      conversations: [...state.conversations, ...newConversations],
    }));

    const isLastMessagesAvailable =
      useChatStore.getState().userText != "" &&
      useChatStore.getState().aiText != "";

    if (!isLastMessagesAvailable) {
      useChatStore.getState().setUserText(get().conversations[0].userInput);
      useChatStore
        .getState()
        .setAiText(get().conversations[0].assistantResponse);
    }
  },
  createConversation: async (userText, aiText) => {
    set((state) => ({
      ...state,
      loading: true,
    }));
    const req = postAPI(`/conversation/create-conversation`, {
      userText: userText,
      aiText: aiText,
    });
    req
      .then((res) => {
        if (res.success) {
          set((state) => ({
            ...state,
            conversations: [res.conversation, ...state.conversations],
          }));
        } else {
        }
      })
      .catch((er) =>
        set((state) => ({
          ...state,
          loading: false,
          error: er,
        }))
      )
      .finally(() => {
        set((state) => ({
          ...state,
          loading: false,
        }));
      });
  },
}));

export default useConversationStore;
