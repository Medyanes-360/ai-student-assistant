"use client";
import { useEffect, useRef, useState } from "react";
import { SiGoogleassistant } from "react-icons/si";
import TextToSpeech from "../TextToSpeech";
import { SiGoogletranslate } from "react-icons/si";
import useConversationStore from "@/zustand/conversationStore";
import { MotionDiv } from "../motion";

const ConversationHistory = () => {
  const conversations = useConversationStore((state) => state.conversations);
  const getConversations = useConversationStore(
    (state) => state.getConversations
  );
  const [loading, setLoading] = useState(false);

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const containerRef = useRef(null);

  const loadMoreConversations = async (elementId) => {
    setLoading(true);
    await getConversations();

    scrollIntoElement(elementId);
    setLoading(false);
  };
  const scrollIntoElement = (id) => {
    const element = document.getElementById(id);
    element.scrollIntoView({ behavior: "instant" });
  };

  // START: -- BU BÖLÜM YALNIZCA İLK /CHAT-HISTORY'E GİRİLDİĞİNDE SON 10 MESAJI ÇEKMEK İÇİN VAR. YALNIZCA 1 KEZ ÇALIŞIR. (SAYFA RE-RENDERLANSA BİLE)
  const isFetched = useRef(true);
  useEffect(() => {
    if (!conversations || conversations.length == 0) {
      if (!isFetched.current) {
        return;
      }
      isFetched.current = true;
      getConversations();
    }
  }, []);
  // END

  useEffect(() => {
    if (containerRef.current && isInitialLoad) {
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight;
      setIsInitialLoad(false);
    }
  });

  return (
    <div className="flex flex-col shadow-inner h-screen pt-[80px] overflow-y-hidden w-full">
      {conversations.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-center ">
          Nothing to show yet.
        </p>
      )}
      {loading && (
        <p className="absolute w-full text-center z-[1000000] pt-1">
          Loading...
        </p>
      )}
      {conversations.length > 0 && (
        <div
          ref={containerRef}
          className="flex flex-col gap-4 pt-4 h-full w-full px-4  overflow-y-scroll md:px-24 lg:px-32"
        >
          {conversations
            .reverse()
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((conv, index) => (
              <MotionDiv
                id={`conversation-${conv.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{}}
                key={index}
                onViewportEnter={
                  index == 0 &&
                  function () {
                    loadMoreConversations(`conversation-${conv.id}`);
                  }
                }
                className="flex flex-col space-y-2 max-h-[700px]"
              >
                {/* Kullanıcı Mesajı */}
                <MotionDiv
                  id={conversations.length - index}
                  initial={{ x: 10 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.1 }}
                  key={index}
                  className="flex flex-col self-end  max-w-[70%] bg-[#662EC5]  rounded-tl-[40px] rounded-bl-[40px] rounded-br-[40px] text-black p-6 rounded-lg shadow-md"
                >
                  <p className="text-base text-white">{conv.userInput}</p>
                  <p className="text-xs text-gray-200 mt-1">
                    {new Date(conv.createdAt).toLocaleString()}
                  </p>
                  <SiGoogletranslate className="self-end  bottom-3 right-5 w-6 h-6 text-white cursor-pointer hover:text-blue-500" />
                </MotionDiv>

                <MotionDiv
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="self-start max-w-[70%] relative bg-[#74B359] text-gray-800 dark:text-gray-200 p-6 rounded-tl-[40px] rounded-bt-[40px] rounded-br-[40px] rounded-tr-[40px] shadow-md "
                >
                  <p className="text-base">{conv.assistantResponse}</p>
                  <p className="text-xs mb-2  text-white  mt-1">
                    {new Date(conv.createdAt).toLocaleString()}
                  </p>
                  <TextToSpeech text={conv.assistantResponse} />

                  <SiGoogletranslate className="absolute bottom-3 right-5 w-6 h-6 text-white cursor-pointer hover:text-blue-500" />

                  <div className="absolute -bottom-5 -left-6">
                    <SiGoogleassistant className="w-6 h-6" />
                  </div>
                </MotionDiv>
              </MotionDiv>
            ))}
        </div>
      )}
    </div>
  );
};

export default ConversationHistory;
