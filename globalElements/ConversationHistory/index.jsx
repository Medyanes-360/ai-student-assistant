"use client";
import React, { useEffect, useState } from "react";
import { SiGoogleassistant } from "react-icons/si";
import { RiChatHistoryLine } from "react-icons/ri";
import { useDashboardStore } from "@/utils/dasboardStore";
import TextToSpeech from "../TextToSpeech";
import { SiGoogletranslate } from "react-icons/si";

const ConversationHistory = () => {
  const { refresh, feedback, transcribedText } = useDashboardStore();
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  useEffect(() => {
    if (!refresh) return;
    setConversations((prevConversations) => [
      ...prevConversations,
      {
        userInput: transcribedText,
        assistantResponse: feedback,
        createdAt: new Date().toUTCString(),
      },
    ]);
  }, [refresh, feedback, transcribedText]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/conversations/read", {
          method: "GET",
          cache: "no-store",
        });
        if (!response.ok) {
          const { message } = await response.json();
          setError(message || "Konuşmalar alınırken bir hata oluştu.");
          return;
        }

        const data = await response.json();
        if (data) {
          setConversations(data);
        }
      } catch (err) {
        setError("Sunucuya bağlanırken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

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
  const handleTextSelection = async () => {
    const selection = window.getSelection().toString();
    if (selection) {
      setSelectedText(selection);
    }
    return null;
  };

  console.log("selectedText", selectedText);
  return (
    <div className="flex flex-col  bg-black/10 shadow-inner h-screen mt-[80px] overflow-y-hidden">
      <h2 className="text-2xl py-2 bg-black  px-6 flex items-center justify-center gap-2 font-semibold text-gray-200 dark:text-gray-100">
        <RiChatHistoryLine />
        Conversation History
      </h2>
      {conversations.length === 0 && (
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-center ">
          Henüz bir konuşma yok.
        </p>
      )}
      {conversations.length > 0 && (
        <div className="space-y-4 pt-4 h-full px-4 md:px-24 lg:px-32 overflow-y-scroll">
          {conversations?.map((conv) => (
            <div
              onMouseUp={handleTextSelection}
              key={conv.createdAt}
              className="flex flex-col space-y-2 max-h-[700px]"
            >
              {/* Kullanıcı Mesajı */}
              <div className="self-end  max-w-[70%] bg-blue-500  rounded-tl-[40px] rounded-bl-[40px] rounded-br-[40px] text-black p-4 rounded-lg shadow-md">
                <p className="text-base text-white">{conv.userInput}</p>
                <p className="text-xs text-gray-200 mt-1">
                  {new Date(conv.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="self-start max-w-[70%] relative bg-[#EEEEEE] dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-4 rounded-tl-[40px] rounded-bt-[40px] rounded-br-[40px] rounded-tr-[40px] shadow-md">
                <p className="text-base">{conv.assistantResponse}</p>
                <p className="text-xs mb-2 text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(conv.createdAt).toLocaleString()}
                </p>
                <TextToSpeech text={conv.assistantResponse} />

                <SiGoogletranslate className="absolute bottom-3 right-5 w-6 h-6 text-white cursor-pointer hover:text-blue-500" />

                <div className="absolute -bottom-5 -left-6">
                  <SiGoogleassistant className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationHistory;
