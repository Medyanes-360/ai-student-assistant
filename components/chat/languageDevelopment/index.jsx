"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import TextToSpeech from "@/globalElements/TextToSpeech";
import useChatStore from "@/zustand/chatStore";

const AudioRecorder = dynamic(() => import("@/globalElements/AudioRecorder"), {
  ssr: false,
});

const LanguageDevelopment = () => {
  const { aiText, userText, aiAudioUrl } = useChatStore((state) => state);
  const getAiResponse = useChatStore((state) => state.getAiResponse);

  const handleRecordingComplete = async (blob) => {
    try {
      if (!blob) {
        throw new Error("Ses kaydı alınamadı");
      }
      const formData = new FormData();
      formData.append("audio", blob, "audio.wav");
      await getAiResponse(formData);
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

  // Metni kelimelere bölüp tooltip ekleyen fonksiyon
  const renderTextWithTooltips = (text) => {
    return text.split(" ").map((word, index) => (
      <span
        key={index}
        data-tooltip-id="tooltip"
        data-tooltip-delay-hide={1000}
        data-tooltip-content={word} // Tooltip içeriği
        className="cursor-pointer mx-1 relative"
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
          className="text-lg bg-white text-gray-800 p-4 rounded-lg shadow-lg z-10 absolute"
          style={{
            width: "500px",
            height: "500px", // Adjust the width of the tooltip card
            position: "absolute",
            border: "1px solid #e2e2e2", // Optional: Add a subtle border
          }}
        />
      </div>
    </>
  );
};

export default LanguageDevelopment;
