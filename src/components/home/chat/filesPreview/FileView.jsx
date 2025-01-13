import { getFilesForActiveConversation } from "@/utils/getFilesForActiveConversation";
import { useSelector } from "react-redux";

export default function FileView({ fileIndex }) {
  const { files, activeConversation } = useSelector((state) => state.chatState);
  const newFiles = getFilesForActiveConversation(files, activeConversation);
  return (
    <div className="max-w-[70%]">
      {newFiles[fileIndex]?.type === "IMAGE" ? (
        <img
          src={newFiles[fileIndex]?.fileBase64}
          alt=""
          className=" object-contain hview"
        />
      ) : (
        <div className="min-w-full hview flex flex-col items-center justify-center">
          {/* File Icon Image */}
          <img
            src={`/images/${newFiles[fileIndex]?.type}.png`}
            alt={newFiles[fileIndex]?.type}
          />
          {/*No preview text*/}
          <h1 className="dark:text-dark_text_2 text-xl">
            No preview available
          </h1>
          {/*File size / type*/}
          <span className="dark:text-dark_text_2">
            {newFiles[fileIndex]?.file.size} kB - {newFiles[fileIndex]?.type}
          </span>
        </div>
      )}
    </div>
  );
}
