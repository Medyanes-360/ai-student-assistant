import { useState, useRef } from "react";
import { FaRegPauseCircle } from "react-icons/fa";
import { FaMicrophoneLines } from "react-icons/fa6";

const PushToTalk = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const mediaRecorderRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleMouseDown = async () => {
    setErrorMessage("");
    setTimer(0);
    setIsRecording(true);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage("Tarayıcınız mikrofon erişimini desteklemiyor.");
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
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        if (timer >= 1) {
          onRecordingComplete(blob);
        } else {
          setErrorMessage("Ses 1 saniyeden daha uzun olmalıdır.");
        }
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      startTimer();
    } catch (error) {
      setErrorMessage("Mikrofon erişimi reddedildi.");
    }
  };

  const handleMouseUp = () => {
    setIsRecording(false);
    stopTimer();
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const startTimer = () => {
    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev >= 60) {
          handleMouseUp();
          return 60;
        }
        return parseFloat(prev + 0.01);
      });
    }, 10);
  };

  const stopTimer = () => {
    clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = null;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
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
        {isRecording ? `Süre: ${timer.toFixed(2)}s` : "Mikrofon hazır"}
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
