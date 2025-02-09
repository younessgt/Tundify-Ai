"use client";
import { useDispatch, useSelector } from "react-redux";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import { useEffect, useState } from "react";
import { getConversationMessages } from "@/features/chatSlice";
import { CircularProgress } from "@mui/material";
import ChatActions from "./ChatActions";
import { getFilesForActiveConversation } from "@/utils/getFilesForActiveConversation";
import FilesPreview from "./filesPreview/FilesPreview";
import { motion } from "framer-motion";
import ThumbnailListAndSend from "./filesPreview/ThumbnailListAndSend";

export default function Chat() {
  const [beginRecording, setBeginRecording] = useState(false);
  const dispatch = useDispatch();
  const { activeConversation, files } = useSelector((state) => state.chatState);
  let newFiles;

  // console.log("files", files);

  if (files) {
    newFiles = getFilesForActiveConversation(files, activeConversation);
  }

  const { user } = useSelector((state) => state.userState);
  const values = {
    accessToken: user.accessToken,
    conversation_id: activeConversation._id,
  };

  useEffect(() => {
    if (user?.accessToken && activeConversation?._id) {
      dispatch(getConversationMessages(values));
    }

    setBeginRecording(false);
  }, [activeConversation]);

  return (
    <div className="dark:bg-dark_bg_2 h-full flex flex-col w-full border-l dark:border-l-dark_border_2">
      {/* chat header */}
      <div className="w-full h-[60px] flex  items-center  dark:bg-dark_bg_3 border-b dark:border-b-dark_border_2">
        <ChatHeader />
      </div>
      {newFiles.length > 0 ? (
        <motion.div
          className="w-full h-full"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.1, ease: "easeInOut" }}
        >
          <FilesPreview />
        </motion.div>
      ) : (
        <>
          <div className="flex-grow flex flex-col min-h-0">
            <ChatMessages />
          </div>
          <div className="h-[60px] w-full flex items-center dark:bg-dark_bg_3 border-t dark:border-t-dark_border_2">
            <ChatActions
              setBeginRecording={setBeginRecording}
              beginRecording={beginRecording}
            />
          </div>
        </>
      )}
    </div>
  );
}
