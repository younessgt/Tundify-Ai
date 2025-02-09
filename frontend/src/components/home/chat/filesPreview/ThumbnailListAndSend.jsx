import { removeAllFiles, removeFiles, sendMessage } from "@/features/chatSlice";
import { getFilesForActiveConversation } from "@/utils/getFilesForActiveConversation";
import { useDispatch, useSelector } from "react-redux";
import { IoSend } from "react-icons/io5";
import AddFile from "./AddFile";
import { uploadFiles } from "@/utils/uploadFiles";
import useSocketContext from "@/hooks/useSocket";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast, Slide } from "react-toastify";
// import VideoThumbnail from "react-video-thumbnail";

export default function ThumbnailListAndSend({ fileIndex, setFileIndex }) {
  const { files, activeConversation } = useSelector((state) => state.chatState);
  const { user } = useSelector((state) => state.userState);
  const { socket, isConnected } = useSocketContext();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  let newFiles = getFilesForActiveConversation(files, activeConversation);

  const handleDelete = (index) => {
    dispatch(removeFiles(index));

    if (fileIndex >= newFiles.length - 1) {
      setFileIndex(Math.max(newFiles.length - 2, 0)); // Adjust fileIndex to stay within bounds
    }
  };

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

  // send Message and file to the receiver
  // and upload the file to the cloud

  // const handleSendFilesAndMessage = async () => {
  //   setLoading(true);
  //   let uploadedFiles;
  //   try {
  //     uploadedFiles = await uploadFiles(newFiles);
  //   } catch (err) {
  //     console.log(err);
  //     setLoading(false);
  //   }

  //   if (uploadedFiles.length > 0) {
  //     const values = {
  //       accessToken: user.accessToken,
  //       conversation_id: activeConversation._id,
  //       message: "",
  //       files: uploadedFiles,
  //     };

  //     const newMsg = await dispatch(sendMessage(values));
  //     console.log("newMsg", newMsg);
  //     if (socket && isConnected) {
  //       socket.emit("user-send-message", newMsg.payload.message);
  //     }

  //     await dispatch(removeAllFiles());
  //     setLoading(false);
  //   }
  // };

  const handleSendFilesAndMessage = async () => {
    setLoading(true);
    let uploadedFiles;

    try {
      uploadedFiles = await uploadFiles(newFiles);
    } catch (err) {
      console.error("Error uploading files:", err);
      notifyError(); // Show error notification
      setLoading(false);
      return; // Stop further execution
    }

    if (uploadedFiles.length > 0) {
      const values = {
        accessToken: user.accessToken,
        conversation_id: activeConversation._id,
        message: "",
        files: uploadedFiles,
      };

      try {
        const newMsg = await dispatch(sendMessage(values));
        if (socket && isConnected) {
          socket.emit("user-send-message", newMsg.payload.message);
        }

        await dispatch(removeAllFiles());
      } catch (err) {
        console.error("Error sending message:", err);
        notifyError(); // Show error notification if message sending fails
      } finally {
        setLoading(false);
      }
    } else {
      notifyError(); // Show error notification if no files were uploaded
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-between ">
      <span></span>
      <div className="flex gap-x-2 relative ">
        <div className="flex gap-x-2 overflow-x-auto  max-w-[600px] custom-scrollbar-thumbnail pb-3">
          {newFiles.map((file, id) => (
            <div
              key={file.id}
              className={`w-14 h-14 flex-shrink-0 border  rounded-md overflow-hidden cursor-pointer relative group ${
                fileIndex === id
                  ? "dark:border-dark_btn_1 border-2"
                  : "dark:border-white border-2"
              }`}
              onClick={() => setFileIndex(id)}
            >
              <button
                className="absolute top-0 right-0  text-white text-xs px-1 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the fileIndex change
                  handleDelete(file.id);
                }}
              >
                ✕
              </button>
              {file.type === "IMAGE" ? (
                <img
                  src={file.fileBase64}
                  alt=""
                  className="w-full h-full object-cover transition duration-300 group-hover:blur-sm"
                ></img>
              ) : file.type === "VIDEO" ? (
                <video
                  src={file.fileBase64}
                  className="w-full h-full object-cover transition duration-300 group-hover:blur-sm"
                ></video>
              ) : (
                <img
                  src={`/images/${file.type}.png`}
                  alt=""
                  className="w-full object-cover h-full transition duration-300 group-hover:blur-sm"
                ></img>
              )}
            </div>
          ))}
        </div>

        <>
          <AddFile />
        </>
      </div>

      <div
        className="w-14 h-14 dark:bg-dark_btn_1 rounded-full flex justify-center items-center"
        onClick={handleSendFilesAndMessage}
      >
        {loading ? (
          <ClipLoader size={25} color="#E99DEF" />
        ) : (
          <IoSend className="fill-dark_text_1 w-7 h-7 " />
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
