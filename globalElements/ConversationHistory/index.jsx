"use client";
import React, { useEffect, useRef, useState } from "react";
import { SiGoogleassistant } from "react-icons/si";
import TextToSpeech from "../TextToSpeech";
import { SiGoogletranslate } from "react-icons/si";
import useConversationStore from "@/zustand/conversationStore";
import { MotionDiv } from "../motion";

//////////////////
//Scroll davranışılarında kullanılan 10 sayısı, fetch fonksiyonunun db'den her seferinde 10 adet data getirmesinden kaynaklanır.
/////////////////

const ConversationHistory = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const conversations = useConversationStore((state) => state.conversations);
  const containerRef = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const getConversations = useConversationStore(
    (state) => state.getConversations
  );

  useEffect(() => {
    if (conversations.length === 0) {
      getConversations();
    }
  }, []);

  useEffect(() => {
    // conversation ilk fetchi tamamlandığında en aşağı scrollar.
    if (conversations.length === 10) {
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight;
      setIsInitialLoad(false);
    }
    // conversation tekrar fetch edildiğinde son kalınan mesaja instant olarak scrollar
    if (conversations.length > 10) {
      const element = document.getElementById(conversations.length - 9);
      element.scrollIntoView({ behavior: "instant" });
    }
  }, [conversations]);

  const handleScrollTop = () => {
    // en yukarıya scrollandıysa
    if (containerRef.current.scrollTop === 0) {
      getConversations();
    }
  };

  const handleTextSelection = async () => {
    const selection = window.getSelection().toString();
    if (selection) {
      setSelectedText(selection);
    }
    return null;
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-red-black">loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col shadow-inner h-screen pt-[80px] overflow-y-hidden w-full">
      {conversations.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-center ">
          Nothing to show yet.
        </p>
      )}
      {conversations.length > 0 && (
        <div
          onScroll={handleScrollTop}
          ref={containerRef}
          className="flex flex-col gap-4 pt-4 h-full w-full px-4  overflow-y-scroll md:px-24 lg:px-32"
        >
          {conversations
            ?.slice()
            .reverse()
            .map((conv, index) => (
              <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={
                  // transition delay'in sadece sayfa ilk yüklendiğinde çalışması için. kullanıcı başka sayfadan geri geldiğinde de çalışmasını engeller.
                  isInitialLoad && conversations.length <= 10
                    ? { delay: 0.09 * (conversations.length - index) }
                    : { delay: 0 }
                }
                onMouseUp={handleTextSelection}
                key={index}
                className="flex flex-col space-y-2 max-h-[700px]"
              >
                {/* Kullanıcı Mesajı */}
                <MotionDiv
                  id={conversations.length - index}
                  initial={{ x: 10 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.1 }}
                  onMouseUp={handleTextSelection}
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
                  onMouseUp={handleTextSelection}
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
