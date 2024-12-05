"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import TextToSpeech from "@/globalElements/TextToSpeech";
import useChatStore from "@/zustand/chatStore";
import useConversationStore from "@/zustand/conversationStore";
import PushToTalk from "@/globalElements/recorder";
import Button from "@/globalElements/Button";
import { FaCheck } from "react-icons/fa6";

const LanguageDevelopment = () => {
  const { aiText, userText, aiAudioUrl, setAiText, setUserText } = useChatStore(
    (state) => state
  );
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

  const renderTextWithTooltips = (text) => {
    const data = {
      word: "You",
      pronunciation: "youː",
      translations: ["Sen", "Siz"],
      examples: ["How are you?", "I see you."],
    };

    return text.split(" ").map((word, index) => (
      <span
        id="clickable"
        key={index}
        // Content olarak sadece string kabul ediyor.
        data-tooltip-content={JSON.stringify(data)}
        data-tooltip-id="tooltip"
        className="cursor-pointer transition-all hover:scale-105 hover:-translate-y-[2px] duration-200 mx-1"
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
                You:
              </h2>
              <p className="flex flex-wrap  text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {renderTextWithTooltips(userText)}
              </p>
              <TextToSpeech text={userText} />
            </div>
          )}

          {aiText && (
            <div className="mt-8 flex flex-col gap-y-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                SpeakBuddy:
              </h2>
              <p className=" flex flex-wrap text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {renderTextWithTooltips(aiText)}
              </p>
              <TextToSpeech text={aiText} />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center flex-col gap-4">
            <Image
              src="/images/person.png"
              alt="person"
              width={1920}
              height={1080}
            />
            <PushToTalk onRecordingComplete={handleRecordingComplete} />
          </div>
        </div>
        <Tooltip
          id="tooltip"
          place="top"
          effect="solid"
          anchorSelect="#clickable"
          clickable
          openOnClick
          className="text-lg bg-white text-gray-800 p-4 rounded-lg shadow-lg z-10 absolute"
          style={{
            backgroundColor: "#ffffff",
            color: "#000000",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            zIndex: 9999999,
            padding: "0px",
          }}
          render={({ content, activeAnchor }) => {
            // String contenti dönüştürüyoruz
            const data = JSON.parse(content);
            return (
              <div className="p-4 max-w-md flex flex-col gap-1">
                <h3 className="text-2xl font-bold py-2 border-b border-black/50">
                  {data?.word}
                </h3>
                <div className="flex flex-col ">
                  <p className="m-0">
                    <strong>Pronunciation:</strong> {data?.pronunciation}
                  </p>
                  <p className="m-0">
                    <strong>Translations:</strong>{" "}
                    {data?.translations.join(", ")}
                  </p>
                  <p>
                    <strong>Examples:</strong>
                  </p>
                  <ul className="pl-5 m-0 list-disc">
                    {data?.examples.map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>
                  <div className="flex justify-between mt-4">
                    <Button className="flex w-full justify-center gap-2 items-center !opacity-100 bg-green-500 text-white border-none py-1 px-2 rounded-lg">
                      Learned <FaCheck />
                    </Button>
                  </div>
                </div>
              </div>
            );
          }}
        />
      </div>
    </>
  );
};

export default LanguageDevelopment;
