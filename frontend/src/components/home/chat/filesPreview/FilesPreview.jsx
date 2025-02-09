import { useState } from "react";
import FileView from "./FileView";
import Header from "./Header";
import InputMessage from "./InputMessage";
import ThumbnailListAndSend from "./ThumbnailListAndSend";
import { useDispatch, useSelector } from "react-redux";
import { updateFileMessage } from "@/features/chatSlice";

export default function FilesPreview() {
  // const [message, setMessage] = useState("");
  const { files } = useSelector((state) => state.chatState);
  const [fileIndex, setFileIndex] = useState(0);
  const dispatch = useDispatch();

  const handleUpdateFileMessage = (newMessage) => {
    const fileId = files[fileIndex]?.id;
    dispatch(updateFileMessage({ fileId, newMessage }));
  };

  return (
    <div className="w-full h-full flex justify-center items-center relative bg-dark_bg_2">
      <div className="w-full h-full flex flex-col items-center px-4">
        {/* Header */}
        <div className="w-full h-[10%] flex justify-between items-center border-b border-dark_bg_9">
          <Header />
        </div>

        {/* File Preview */}
        <div className="flex-1 flex justify-center items-center overflow-hidden border-b border-dark_bg_9">
          <FileView fileIndex={fileIndex} />
        </div>

        {/* Input Message */}
        <div className="w-full h-[10%] flex justify-center items-center">
          {/* <InputMessage message={message} setMessage={setMessage} /> */}
          <InputMessage
            message={files[fileIndex]?.message || ""}
            setMessage={handleUpdateFileMessage}
          />
        </div>

        {/* Thumbnail List with Send Button */}
        <div className="w-full h-[15%] flex justify-center items-center overflow-hidden">
          <ThumbnailListAndSend
            fileIndex={fileIndex}
            setFileIndex={setFileIndex}
            // message={message}
          />
        </div>
      </div>
    </div>
  );
}
