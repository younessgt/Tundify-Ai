import { useState } from "react";
import FileView from "./FileView";
import Header from "./Header";
import InputMessage from "./InputMessage";
import ThumbnailListAndSend from "./ThumbnailListAndSend";

export default function FilesPreview() {
  const [message, setMessage] = useState("");
  const [fileIndex, setFileIndex] = useState(0);

  return (
    <div className=" w-full h-full flex justify-center items-center relative">
      <div className=" w-full h-full flex flex-col p-2 gap-y-4 items-center">
        {/*Header */}
        <div className="w-full  flex justify-between items-center">
          <Header />
        </div>
        {/*File Preview */}

        <div className="w-full flex justify-center items-center">
          <FileView fileIndex={fileIndex} />
        </div>

        {/*Input Message */}
        <div className="w-full flex justify-center items-center absolute bottom-[140px]">
          <InputMessage message={message} setMessage={setMessage} />
        </div>
        <div className="border-[0.5px] w-full border-dark_bg_9 mb-4"></div>

        {/*Thumbnail list with send Button */}
        <div className="w-full flex justify-center items-center">
          <ThumbnailListAndSend
            fileIndex={fileIndex}
            setFileIndex={setFileIndex}
            message={message}
          />
        </div>
      </div>
    </div>
  );
}
