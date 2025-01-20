import { useState, useEffect, useRef } from "react";
import TranslateIcon from "@mui/icons-material/Translate";
import {
  MdKeyboardVoice,
  MdDelete,
  MdPause,
  MdSend,
  MdPlayArrow,
  MdStop,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { IoSend } from "react-icons/io5";
import { geminiTranslate } from "@/utils/geminiTranslate";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "@/features/chatSlice";
import useSocketContext from "@/hooks/useSocket";

export default function AudioTranslator({ setIsPopupVisible }) {
  const { files, activeConversation } = useSelector((state) => state.chatState);
  const { user } = useSelector((state) => state.userState);
  const { socket, isConnected } = useSocketContext();

  // const [loading, setLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [translation, setTranslation] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [transcriptShunk, setTranscriptShunk] = useState("");
  const currentTranscript = useRef("");
  const dispatch = useDispatch();

  const togglePopup = () => {
    setIsPopupVisible((prev) => !prev);
  };
  console.log("test");

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "ary", name: "Darija" },
  ];

  const getLanguage = (code) => {
    switch (code) {
      case "en":
        return "en-EN";
      case "ary":
        return "ar-MA";
      case "fr":
        return "fr-FR";
      case "es":
        return "es-ES";
    }
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition ||
      window.oSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = getLanguage(sourceLanguage);
    recognitionInstance.interimResults = true; // Show partial results
    recognitionInstance.continuous = true; // Enable continuous recognition
    setRecognition(recognitionInstance);
  }, [sourceLanguage]);

  const startRecording = async () => {
    // try {
    //   setIsRecording(true);
    // } catch (error) {
    //   console.error("Error accessing microphone:", error);
    // }

    if (!recognition) {
      alert("Speech Recognition is not initialized.");
      return;
    }

    // Clear transcript when starting fresh
    // setTranscriptShunk("");
    currentTranscript.current = "";
    setTranscript("");
    setTranslation("");
    setIsConfirmed(false);

    recognition.onstart = () => {
      setIsListening(true);
      console.log("Speech recognition started");
    };

    recognition.onresult = (event) => {
      //   const currentTranscript = Array.from(event.results)
      //     .map((result) => result[0].transcript)
      //     .join("");
      //   setTranscriptShunk(currentTranscript);
      currentTranscript.current = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      //   setTranscriptShunk(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Error occurred in speech recognition:", event.error);
    };

    recognition.start();
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }

    // setIsRecording(false);
    setIsProcessing(true);
    setTimeout(() => {
      //   setTranscript(transcriptShunk);
      setTranscript(currentTranscript.current);

      setIsProcessing(false);
    }, 1500);
  };

  const confirmTranscript = async () => {
    setIsConfirmed(true);
    // Simulate translation API call

    if (targetLanguage === sourceLanguage) {
      setTranslation(currentTranscript.current);
      return;
    }
    try {
      const accessToken = user.accessToken;
      const translatedText = await geminiTranslate(
        targetLanguage,
        currentTranscript.current,
        accessToken
      );
      console.log("translatedText", translatedText);
      setTimeout(() => {
        setTranslation(translatedText);
      }, 1000);
    } catch (error) {
      console.log("error notification", error);
      // toast notification
    }
  };

  const resetAll = () => {
    setTranscript("");
    // setTranscriptShunk("");
    currentTranscript.current = "";
    setTranslation("");
    setIsConfirmed(false);
  };

  const handleSendMessage = async () => {
    setLoading(true);

    console.log(translation);

    const values = {
      accessToken: user.accessToken,
      conversation_id: activeConversation._id,
      message: translation,
      files: [],
    };

    try {
      const newMsg = await dispatch(sendMessage(values));
      if (socket && isConnected) {
        socket.emit("user-send-message", newMsg.payload.message);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      //   notifyError(); // Show error notification if message sending fails
    } finally {
      setLoading(false);
      setIsPopupVisible(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
      <div className="relative bg-white dark:bg-dark_bg_2 p-6 rounded-md shadow-lg max-w-2xl w-full">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black dark:text-white"
          onClick={togglePopup}
        >
          ✕
        </button>
        <div className=" flex flex-col">
          {/*Header */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-2">
              <TranslateIcon className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-dark_text_1">
                AI Audio Translator
              </h2>
            </div>
            <p className="text-dark_text_2 text-sm">
              Record your voice and get instant translations in your desired
              language
            </p>
          </div>

          {/* Language Selection */}
          <div className="flex flex-wrap justify-between  mt-7 ">
            <span></span>
            <div className="space-y-2 flex flex-col ">
              <label className="text-sm font-medium text-dark_text_2">
                Speak in:
              </label>
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="w-full p-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                // disabled={isRecording}
              >
                {languages.map((lang) => (
                  <option key={`source-${lang.code}`} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 flex flex-col ">
              <label className="text-sm font-medium text-dark_text_2">
                Translate to:
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full p-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                // disabled={isRecording}
              >
                {languages.map((lang) => (
                  <option key={`target-${lang.code}`} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <span></span>
          </div>

          {/* Recording Button */}
          <div className="flex justify-center mt-5">
            {!isListening ? (
              <button
                onClick={startRecording}
                className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 transition-all transform hover:scale-105 shadow-lg"
                disabled={isProcessing}
              >
                <MdKeyboardVoice className="w-6 h-6" />
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-red-500 text-white p-4 rounded-full hover:bg-red-600 transition-all transform hover:scale-105 shadow-lg animate-pulse"
              >
                <MdStop className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Transcription Section */}
          {(transcript || isProcessing) && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-dark_text_1 ml-3">
                Transcription:
              </h3>
              <div className="p-3 dark:bg-dark_bg_7 rounded-lg min-h-[80px] relative m-3 ">
                {isProcessing ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse text-dark_text_1">
                      Processing...
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-dark_text_1 whitespace-normal break-words">
                      {transcript}
                    </p>
                    {!isConfirmed && (
                      <div className="flex justify-center gap-2 mt-4">
                        <button
                          onClick={confirmTranscript}
                          className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          <MdCheckCircle className="w-4 h-4" /> Confirm
                        </button>
                        <button
                          onClick={resetAll}
                          className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                          <MdCancel className="w-4 h-4" /> Reset
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
          {/* Translation Section */}
          {translation && (
            <div className="space-y-2 mt-3">
              <h3 className="text-sm font-medium text-dark_text_1 ml-3">
                Translation:
              </h3>
              <div className="p-3 dark:bg-dark_bg_7 rounded-lg min-h-[80px] m-3">
                <p className="text-dark_text_1 whitespace-normal break-words">
                  {translation}
                </p>
              </div>
              <div className="w-full flex justify-center items-center mt-10">
                <div
                  className="w-14 h-14 dark:bg-dark_btn_1 rounded-full flex justify-center items-center mt-3"
                  onClick={handleSendMessage}
                >
                  {loading ? (
                    <ClipLoader size={24} color="#E99DEF" />
                  ) : (
                    <IoSend className="fill-dark_text_1 w-6 h-6 " />
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6 py-4"></div>
        </div>
      </div>
    </div>
  );
}
