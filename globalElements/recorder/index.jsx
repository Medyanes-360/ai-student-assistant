import { useState, useRef } from "react";
import { FaRegPauseCircle } from "react-icons/fa";
import { FaMicrophoneLines } from "react-icons/fa6";

const PushToTalk = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState("00:00");
  const [errorMessage, setErrorMessage] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingStartTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const handleMouseDown = async () => {
    setErrorMessage("");
    setIsRecording(true);
    recordingStartTimeRef.current = Date.now();

    timerIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - recordingStartTimeRef.current;
      const seconds = Math.floor(elapsed / 1000)
        .toString()
        .padStart(2, "0");
      const milliseconds = Math.floor((elapsed % 1000) / 10)
        .toString()
        .padStart(2, "0");
      setElapsedTime(`${seconds}:${milliseconds}`);
    }, 10);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage("Tarayıcınız mikrofon erişimini desteklemiyor.");
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        clearInterval(timerIntervalRef.current);
        setElapsedTime("00:00");

        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const elapsedTimeInSeconds =
          (Date.now() - recordingStartTimeRef.current) / 1000;

        if (elapsedTimeInSeconds >= 1) {
          onRecordingComplete(blob);
        } else {
          setErrorMessage("Ses 1 saniyeden daha uzun olmalıdır.");
        }
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      setErrorMessage("Mikrofon erişimi reddedildi.");
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  const handleMouseUp = () => {
    setIsRecording(false);
    clearInterval(timerIntervalRef.current);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchCancel={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
        onMouseLeave={isRecording ? handleMouseUp : undefined}
        className={`px-6 py-4 sm:py-6 aspect-square rounded-full font-semibold shadow-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 no-context ${
          isRecording
            ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
            : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
        } text-white`}
      >
        {isRecording ? (
          <FaRegPauseCircle className="w-14 h-14" />
        ) : (
          <FaMicrophoneLines className="w-14 h-14" />
        )}
      </button>
      <div style={{ marginTop: "10px", fontSize: "18px" }}>
        {isRecording ? `Süre: ${elapsedTime}` : "Mikrofon hazır"}
      </div>
      {errorMessage && (
        <div style={{ color: "red", marginTop: "10px", fontSize: "14px" }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default PushToTalk;
