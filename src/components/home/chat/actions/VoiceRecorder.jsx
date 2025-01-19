import { useState, useRef, useEffect } from "react";

import {
  MdKeyboardVoice,
  MdDelete,
  MdPause,
  MdSend,
  MdPlayArrow,
  MdStop,
} from "react-icons/md";

import { IoSend } from "react-icons/io5";
import { uploadFile } from "@/utils/uploadFiles";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast, Slide } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "@/features/chatSlice";
import useSocketContext from "@/hooks/useSocket";

export default function VoiceRecorder({ setBeginRecording, beginRecording }) {
  const { activeConversation } = useSelector((state) => state.chatState);
  const { user } = useSelector((state) => state.userState);

  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(true);
  const timerRef = useRef(null);
  const [recordedURL, setRecordedURL] = useState("");
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const recordedBlob = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { socket, isConnected } = useSocketContext();
  const dispatch = useDispatch();

  const notifyError = () =>
    toast.error("Problem occur, Please Try again", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Slide,
    });

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const handleStartRecording = async () => {
    setIsRecording(true);
    setSeconds(0);

    try {
      setSeconds(0);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);

      mediaRecorder.current.onstop = () => {
        recordedBlob.current = new Blob(chunks.current, { type: "audio/mp3" });
        const url = URL.createObjectURL(recordedBlob.current);
        console.log("url", url);
        setRecordedURL(url);

        chunks.current = [];
        clearTimeout(timerRef);
      };
      mediaRecorder.current.start();
    } catch (error) {
      console.error("error recording", error);
    }
  };

  const handleDeleteRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setBeginRecording(false);
    setSeconds(0);
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaStream.current.getTracks().forEach((track) => track.stop());
    }
  };

  const handleUploadToCloudAndSend = async () => {
    let response;
    if (!recordedBlob.current || isRecording) return;
    console.log("recorede:", recordedBlob.current);

    setUploading(true);
    const audioFile = {
      file: recordedBlob.current,
      type: "AUDIO",
    };

    try {
      response = await uploadFile(audioFile);
    } catch (err) {
      console.log(err);
      notifyError();
      setUploading(false);
    }

    if (response.file.secure_url) {
      recordedBlob.current = null;
      // try catch send message to backend

      const values = {
        accessToken: user.accessToken,
        conversation_id: activeConversation._id,
        message: "",
        files: [response],
      };

      try {
        const newMsg = await dispatch(sendMessage(values));
        if (socket && isConnected) {
          socket.emit("user-send-message", newMsg.payload.message);
        }
      } catch (err) {
        console.error("Error sending message:", err);
        notifyError(); // Show error notification if message sending fails
      } finally {
        setUploading(false);
      }
    }
    console.log("response", response);
  };

  useEffect(() => {
    return () => {
      // Cleanup timer on component unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (beginRecording) {
      handleStartRecording(); // Start recording automatically when beginRecording is true
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setSeconds(0);
      setIsRecording(true); // Reset state when beginRecording is toggled off
    }
  }, [beginRecording]);
  return (
    <>
      {beginRecording ? (
        <div className="attachment-icon flex justify-center items-center w-full h-[59px] cursor-pointer relative">
          <div className="flex justify-center items-center  h-full pl-4 pr-4">
            <div className="flex gap-x-4">
              <button onClick={handleDeleteRecording}>
                <MdDelete className="w-7 h-7 fill-current dark:fill-dark_svg_2" />
              </button>
              <div className="flex justify-center items-center">
                {recordedURL && !isRecording ? (
                  <audio controls src={recordedURL} className="h-10 " />
                ) : (
                  <h2 className=" rounded-full p-2 w-[300px] flex justify-center items-center bg-white text-black text-lg h-10">
                    {formatTime(seconds)}
                  </h2>
                )}
              </div>
              <div className="flex justify-center items-center">
                {isRecording ? (
                  <div onClick={handleStopRecording}>
                    <MdStop className="w-7 h-7 fill-current dark:fill-dark_btn_1" />
                  </div>
                ) : (
                  <div onClick={handleStartRecording}>
                    <MdKeyboardVoice className="w-7 h-7 fill-current dark:fill-dark_svg_1" />
                  </div>
                )}
              </div>
            </div>
            <div
              className="w-8 h-8 dark:bg-dark_btn_1 rounded-full flex justify-center items-center ml-6"
              onClick={handleUploadToCloudAndSend}
            >
              <IoSend className="fill-dark_text_1 w-5 h-5 " />
            </div>
          </div>
        </div>
      ) : (
        <div className="attachment-icon flex justify-center items-center w-[60px] cursor-pointer relative">
          {" "}
          <div
            className="w-[45px] h-[45px] flex justify-center items-center"
            onClick={() => setBeginRecording(true)}
          >
            <MdKeyboardVoice className="w-7 h-7 fill-current dark:fill-dark_svg_1" />
          </div>
        </div>
      )}
    </>
  );
}

// import { MdKeyboardVoice } from "react-icons/md";

// export default function VoiceRecorder() {
//   return (
//     <div className=" attachment-icon flex justify-center items-center w-[60px] cursor-pointer">
//       <div className="w-[45px] h-[45px] flex justify-center items-center ">
//         <MdKeyboardVoice className="w-7 h-7 fill-current dark:fill-dark_svg_1" />
//       </div>
//     </div>
//   );
// }
