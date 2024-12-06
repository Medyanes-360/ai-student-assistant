"use client";
import { FaPlay, FaStarHalfStroke, FaStop } from "react-icons/fa6";
import { useSpeech } from "react-text-to-speech";
const TextToSpeech = ({ text }) => {
  const {
    Text, // Component that returns the modified text property
    speechStatus, // String that stores current speech status
    isInQueue, // Boolean that stores whether a speech utterance is either being spoken or present in queue
    start, // Function to start the speech or put it in queue
    pause, // Function to pause the speech
    stop, // Function to stop the speech or remove it from queue
  } = useSpeech({ text });
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}>
        <div style={{ display: "flex", columnGap: "0.5rem" }}>
          {speechStatus !== "started" ? (
            <button
              className="p-1 transition-all duration-200 hover:text-indigo-500 hover:scale-110"
              onClick={start}
            >
              <FaPlay fontSize={22} />
            </button>
          ) : (
            <button
              className="p-1 transition-all duration-200 hover:text-indigo-500 hover:scale-110"
              onClick={stop}
            >
              <FaStop fontSize={22} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};
export default TextToSpeech;
