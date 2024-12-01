"use client";

import dynamic from "next/dynamic";
import { useDashboardStore } from "@/utils/dasboardStore";
import React, { useEffect } from "react";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import TextToSpeech from "@/globalElements/TextToSpeech";

const AudioRecorder = dynamic(() => import("@/globalElements/AudioRecorder"), {
  ssr: false,
});

const LanguageDevelopment = () => {
  const {
    feedback,
    setFeedback,
    toggleRefresh,
    asistantAudioUrl,
    setAsistantAudioUrl,
    transcribedText,
    setTranscribedText,
  } = useDashboardStore((state) => state);

  const handleRecordingComplete = async (blob) => {
    try {
      if (!blob) {
        throw new Error("Ses kaydı alınamadı");
      }

      const formData = new FormData();
      formData.append("audio", blob, "audio.wav");
      const audioResponse = await fetch("/api/process-audio/create", {
        method: "POST",
        body: formData,
      });

      if (!audioResponse.ok)
        throw new Error(
          (await audioResponse.json()).error || "Ses işleme hatası"
        );

      const { transcribedText } = await audioResponse.json();
      setTranscribedText(transcribedText);

      const textRes = await fetch("/api/process-text/create", {
        method: "POST",
        body: JSON.stringify({ text: transcribedText }),
      });

      if (!textRes.ok)
        throw new Error(
          (await textRes.json()).message || "Metin işleme hatası"
        );

      const { assistantMessage } = await textRes.json();
      setFeedback(assistantMessage);

      const ttsRes = await fetch("/api/text-to-speech/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: assistantMessage }),
      });

      if (!ttsRes.ok)
        throw new Error(
          (await ttsRes.json()).message || "Ses dönüştürme hatası"
        );

      setAsistantAudioUrl(URL.createObjectURL(await ttsRes.blob()));
      toggleRefresh();
    } catch (error) {
      console.error("İşlem hatası:", error);
      setFeedback(error.message || "Beklenmeyen bir hata oluştu");
      setAsistantAudioUrl(null);
      setTranscribedText("");
    }
  };

  useEffect(() => {
    if (asistantAudioUrl) {
      const audio = new Audio(asistantAudioUrl);
      audio.play();
      return () => audio.pause();
    }
  }, [asistantAudioUrl]);

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
      <div className="flex  flex-col-reverse gap-3 lg:flex-row  w-full">
        <div className="bg-[#F4F4F4] h-full dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full flex-grow-0 flex-shrink-0 basis-[70%] transition duration-200">
          {transcribedText && (
            <div className="mt-8 flex flex-col gap-y-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Senin Metnin:
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {renderTextWithTooltips(transcribedText)}
              </p>
              <TextToSpeech text={transcribedText} />
            </div>
          )}

          {feedback && (
            <div className="mt-8 flex flex-col gap-y-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Geri Bildirim:
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {renderTextWithTooltips(feedback)}
              </p>
              <TextToSpeech text={feedback} />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center flex-col gap-4">
            <Image
              src="/images/person.jpeg"
              alt="person"
              width={200}
              height={200}
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
