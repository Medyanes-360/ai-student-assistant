"use client";
import React, { useEffect, useRef, useState } from "react";
import { SiGoogleassistant } from "react-icons/si";
import TextToSpeech from "../TextToSpeech";
import { SiGoogletranslate } from "react-icons/si";
import useConversationStore from "@/zustand/conversationStore";
import { MotionDiv } from "../motion";

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
      setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    if (conversations.length === 20) {
      const element = containerRef.current;
      console.log("conversations.length:", conversations.length);

      element.scrollTop = element.scrollHeight;
    }
    console.log(conversations);
  }, [conversations]);

  const handleScrollTop = () => {
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
  // initial={isInitialLoad ? { opacity: 1 } : { opacity: 0 }}
  // animate={{ opacity: 1 }}
  // transition={
  //   isInitialLoad
  //     ? false
  //     : { delay: 0.09 * (conversations.length - index) }
  // }
  return (
    <div className="flex flex-col  bg-black/10 shadow-inner h-screen mt-[80px] overflow-y-hidden">
      {conversations.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-center ">
          Henüz bir konuşma yok.
        </p>
      )}
      {conversations.length > 0 && (
        <div
          onScroll={handleScrollTop}
          ref={containerRef}
          className="space-y-4 pt-4 h-full px-4 md:px-24 lg:px-32 overflow-y-scroll"
        >
          {conversations
            ?.slice()
            .reverse()
            .map((conv, index) => (
              <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.09 * (conversations.length - index) }}
                onMouseUp={handleTextSelection}
                key={conv.createdAt}
                className="flex flex-col space-y-2 max-h-[700px]"
              >
                {/* Kullanıcı Mesajı */}
                <MotionDiv
                  initial={{ x: 10 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.1 }}
                  onMouseUp={handleTextSelection}
                  key={conv.createdAt}
                  className="self-end  max-w-[70%] bg-blue-500  rounded-tl-[40px] rounded-bl-[40px] rounded-br-[40px] text-black p-4 rounded-lg shadow-md"
                >
                  <p className="text-base text-white">{conv.userInput}</p>
                  <p className="text-xs text-gray-200 mt-1">
                    {new Date(conv.createdAt).toLocaleString()}
                  </p>
                </MotionDiv>

                <MotionDiv
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.1 }}
                  onMouseUp={handleTextSelection}
                  className="self-start max-w-[70%] relative bg-[#EEEEEE] dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-4 rounded-tl-[40px] rounded-bt-[40px] rounded-br-[40px] rounded-tr-[40px] shadow-md"
                >
                  <p className="text-base">{conv.assistantResponse}</p>
                  <p className="text-xs mb-2 text-gray-500 dark:text-gray-400 mt-1">
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
