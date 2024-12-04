import { create } from "zustand";

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
    const take = 10; // çekilecek miktar, 10 conversation = toplam 20 mesaj (10 speakbuddy 10 kullanıcı)
    console.log("inside getconversations");
    const res = await fetch(
      `/api/conversation/get-conversations?skip=${skip}&take=${take}`
    );

    const json = await res.json();
    console.log(json);
    if (!json.success) {
      // hata gönder.
    }
    console.log("after jsonsuccess");
    const newConversations = json.conversations;
    console.log("after destructure");

    set((state) => ({
      ...state,
      loading: false,
      conversations: [...state.conversations, ...newConversations],
    }));
  },
  createConversation: async (userText, aiText) => {
    set((state) => ({
      ...state,
      loading: true,
    }));
    const req = fetch(`/api/conversation/create-conversation`, {
      body: { userText: userText, aiText: aiText },
    });
    req
      .then((res) => {
        if (res.success) {
          set((state) => ({
            ...state,
            conversations: [...state.conversations, res.conversation],
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
