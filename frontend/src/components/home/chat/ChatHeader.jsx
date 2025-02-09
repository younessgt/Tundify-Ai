// "use client";

import { capitalise } from "@/utils/capitalise";
import { useSelector } from "react-redux";
import DotsIcon from "@/components/svg/Dots";
import { SearchIcon } from "@/components/svg";
import { VideoCall } from "@mui/icons-material";
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

import {
  getRecieverId,
  getRecieverName,
  getRecieverPicture,
} from "@/utils/getReciever";

import useSocketContext from "@/hooks/useSocket";
import { useState, useEffect } from "react";
import useRecipientStatus from "@/hooks/useRecipientStatus";
import AudioTranslator from "./AudioTranslator";
// import { motion } from "framer-motion";

export default function ChatHeader() {
  const { activeConversation } = useSelector((state) => state.chatState);
  // const { picture, name } = activeConversation;
  const { user } = useSelector((state) => state.userState);
  const name = getRecieverName(activeConversation.users, user._id);
  const picture = getRecieverPicture(activeConversation.users, user._id);
  const recipientId = getRecieverId(activeConversation.users, user._id);
  const { socket, isConnected } = useSocketContext();
  const isRecipientOnline = useRecipientStatus(recipientId, socket);

  // State for popup visibility
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  // const [sourceLanguage, setSourceLanguage] = useState("en");
  // const [targetLanguage, setTargetLanguage] = useState("es");
  // const [isRecording, setIsRecording] = useState(false);
  // const [isProcessing, setIsProcessing] = useState(false);
  // const [transcript, setTranscript] = useState("");
  // const [isConfirmed, setIsConfirmed] = useState(false);
  // const [translation, setTranslation] = useState("");

  // Function to toggle popup visibility
  // const togglePopup = () => {
  //   setIsPopupVisible((prev) => !prev);
  // };

  // const languages = [
  //   { code: "en", name: "English" },
  //   { code: "es", name: "Spanish" },
  //   { code: "fr", name: "French" },
  //   { code: "ary", name: "Darija" },
  // ];

  // const startRecording = async () => {
  //   try {
  //     // const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  //     // mediaRecorderRef.current = new MediaRecorder(stream);
  //     // chunksRef.current = [];

  //     // mediaRecorderRef.current.ondataavailable = (e) => {
  //     //   chunksRef.current.push(e.data);
  //     // };

  //     // mediaRecorderRef.current.onstop = async () => {
  //     //   const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
  //     //   setIsProcessing(true);
  //     //   // Simulate API call
  //     //   setTimeout(() => {
  //     //     setTranscript(
  //     //       "This is a sample transcription of what you just said."
  //     //     );
  //     //     setIsProcessing(false);
  //     //   }, 1500);
  //     // };

  //     // mediaRecorderRef.current.start();
  //     setIsRecording(true);
  //   } catch (error) {
  //     console.error("Error accessing microphone:", error);
  //   }
  // };

  // const stopRecording = () => {
  //   // if (mediaRecorderRef.current && isRecording) {
  //   //   mediaRecorderRef.current.stop();
  //   //   setIsRecording(false);
  //   //   mediaRecorderRef.current.stream
  //   //     .getTracks()
  //   //     .forEach((track) => track.stop());
  //   // }
  //   setIsRecording(false);
  //   setIsProcessing(true);
  //   setTimeout(() => {
  //     setTranscript(
  //       "This is a sample transcription of what you just said.hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"
  //     );
  //     setIsProcessing(false);
  //   }, 1500);
  // };

  // const confirmTranscript = () => {
  //   setIsConfirmed(true);
  //   // Simulate translation API call
  //   setTimeout(() => {
  //     setTranslation(
  //       "Esta es una traducción de ejemplo de lo que acabas de decir."
  //     );
  //   }, 1000);
  // };

  // const resetAll = () => {
  //   setTranscript("");
  //   setTranslation("");
  //   setIsConfirmed(false);
  // };

  const togglePopup = () => {
    setIsPopupVisible((prev) => !prev);
  };

  return (
    <div className="w-full h-full flex justify-between items-center ">
      {/* picture and name */}
      <div className="flex items-center gap-x-4 p-[16px]">
        {/* picture */}
        <div className="flex justify-center items-center max-w-[40px] min-w-[40px] h-[40px] rounded-full   bg-black overflow-hidden">
          <img
            src={picture}
            alt={`${name} picture`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* name and status*/}
        <div className="flex flex-col justify-center ">
          <h1 className="dark:text-white  font-bold text-sm">
            {capitalise(name)}
          </h1>
          <span
            className={`dark:text-dark_svg_2 text-xs status-text ${
              isRecipientOnline ? "online" : ""
            }`}
          >
            {isRecipientOnline ? "Online" : ""}
          </span>
        </div>
      </div>

      {/* icons right*/}
      <div className="flex">
        <ul className="flex p-[16px]">
          <li>
            <button
              className="p-2 bg-dark_bg_3 rounded-full btn"
              onClick={togglePopup}
            >
              {/* <VideoCall className="dark:fill-dark_svg_1" /> */}
              <TranslateIcon className="dark:fill-dark_svg_1" />
            </button>
          </li>
          <li>
            <button className="p-2 bg-dark_bg_3 rounded-full btn">
              <SearchIcon className="dark:fill-dark_svg_1" />
            </button>
          </li>
          <li>
            <button className="p-2 bg-dark_bg_3 rounded-full btn">
              <DotsIcon className="dark:fill-dark_svg_1" />
            </button>
          </li>
        </ul>
      </div>

      {/* Popup Component */}
      {isPopupVisible && (
        <AudioTranslator setIsPopupVisible={setIsPopupVisible} />
      )}
    </div>
  );
}
