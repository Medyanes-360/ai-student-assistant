"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import TextToSpeech from "@/globalElements/TextToSpeech";
import useChatStore from "@/zustand/chatStore";
import AudioRecorder from "@/globalElements/AudioRecorder";
import useConversationStore from "@/zustand/conversationStore";

const LanguageDevelopment = () => {
  const { aiText, userText, aiAudioUrl } = useChatStore((state) => state);
  const getAiResponse = useChatStore((state) => state.getAiResponse);
  const conversations = useConversationStore((state) => state.conversations);
  const getConversations = useConversationStore(
    (state) => state.getConversations
  );
  const handleRecordingComplete = async (blob) => {
    try {
      if (!blob) {
        throw new Error("Ses kaydı alınamadı");
      }

      await getAiResponse(blob);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (aiAudioUrl) {
      const audio = new Audio(aiAudioUrl);
      audio.play();
      return () => audio.pause();
    }
  }, [aiAudioUrl]);
  //
  //word data : you kelimesine tıklayınca örneği görebilirsiniz.
  const wordData = {
    you: {
      pronunciation: "youː",
      translations: ["Sen", "Siz"],
      examples: ["How are you?", "I see you."],
    },
    Hello: {
      pronunciation: "həˈləʊ",
      translations: ["Merhaba"],
      examples: ["Hello, how are you?", "Hello everyone!"],
    },
    today: {
      pronunciation: "təˈdeɪ",
      translations: ["Bugün"],
      examples: ["What are you doing today?", "Today is a great day!"],
    },
  };

  // START: -- BU BÖLÜM YALNIZCA İLK /CHAT'E GİRİLDİĞİNDE SON 10 MESAJI ÇEKMEK İÇİN VAR.
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
  console.log(conversations);
  // Tooltip içeriğini dinamik olarak oluşturma fonksiyonu
  const getTooltipContent = (word) => {
    const content = wordData[word.toLowerCase()];
    if (!content) return "Bu kelime için bilgi yok.";
    return `
        <div style="padding: 16px; max-width: 300px;">
          <h3 style="font-size: 18px; margin-bottom: 8px; font-weight: bold;">${word}</h3>
          <p style="margin: 0;"><strong>Pronunciation:</strong> ${
            content.pronunciation
          }</p>
          <p style="margin: 0;"><strong>Translations:</strong> ${content.translations.join(
            ", "
          )}</p>
          <p><strong>Examples:</strong></p>
          <ul style="padding-left: 20px; margin: 0;">
            ${content.examples.map((example) => `<li>${example}</li>`).join("")}
          </ul>
          <div style="display: flex; justify-content: space-between; margin-top: 16px;">
            <button style="
              flex: 1;
              background-color: #3B82F6;
              color: white;
              border: none;
              padding: 8px 12px;
              margin-right: 4px;
              border-radius: 8px;
              cursor: pointer;">
              Learned
            </button>
            <button style="
              flex: 1;
              background-color: #10B981;
              color: white;
              border: none;
              padding: 8px 12px;
              border-radius: 8px;
              cursor: pointer;">
              Learn
            </button>
          </div>
        </div>
      `;
  };

  // Metni kelimelere bölüp tooltip ekleyen fonksiyon
  const renderTextWithTooltips = (text) => {
    return text.split(" ").map((word, index) => (
      <span
        key={index}
        data-tooltip-id="tooltip"
        data-tooltip-html={getTooltipContent(word)} // Dinamik içerik
        // Tooltip'i tıklama ile aç
        className="cursor-pointer text-blue-500 underline mx-1"
      >
        {word}
      </span>
    ));
  };

  return (
    <>
      <div className="flex  flex-col-reverse gap-3 lg:flex-row pt-[80px] w-full">
        <div className="bg-[#F4F4F4] h-full dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full flex-grow-0 flex-shrink-0 basis-[70%] transition duration-200">
          {userText && (
            <div className="mt-8 flex flex-col gap-y-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Senin Metnin:
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {renderTextWithTooltips(userText)}
              </p>
              <TextToSpeech text={userText} />
            </div>
          )}

          {aiText && (
            <div className="mt-8 flex flex-col gap-y-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Geri Bildirim:
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {renderTextWithTooltips(aiText)}
              </p>
              <TextToSpeech text={aiText} />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center flex-col gap-4">
            <Image
              src="/images/person.jpg"
              alt="person"
              width={1920}
              height={1080}
            />
            <AudioRecorder onRecordingComplete={handleRecordingComplete} />
          </div>
        </div>
        <Tooltip
          id="tooltip"
          place="top"
          effect="solid"
          openOnClick
          className="text-lg bg-white text-gray-800 p-4 rounded-lg shadow-lg z-10 absolute"
          style={{
            backgroundColor: "#1E293B",
            color: "#F8FAFC",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            zIndex: 10,
          }}
        />
      </div>
    </>
  );
};

export default LanguageDevelopment;
