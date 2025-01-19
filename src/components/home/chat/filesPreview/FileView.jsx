import { getFilesForActiveConversation } from "@/utils/getFilesForActiveConversation";
import { useSelector } from "react-redux";

export default function FileView({ fileIndex }) {
  const { files, activeConversation } = useSelector((state) => state.chatState);
  const newFiles = getFilesForActiveConversation(files, activeConversation);
  return (
    <div className="w-full flex items-center justify-center overflow-hidden p-4 h-full ">
      {newFiles[fileIndex]?.type === "IMAGE" ? (
        <div className="w-[700px] h-[400px]  flex justify-center items-center">
          <img
            src={newFiles[fileIndex]?.fileBase64}
            alt=""
            className="object-contain w-full h-full"
          />
        </div>
      ) : newFiles[fileIndex]?.type === "VIDEO" ? (
        <video
          src={newFiles[fileIndex]?.fileBase64}
          className="object-contain max-w-full max-h-full"
          style={{
            maxWidth: "80%",
            maxHeight: "80%",
          }}
          controls
        ></video>
      ) : (
        <div className="flex flex-col items-center justify-center text-center max-w-[80%] max-h-[80%]">
          {/* File Icon Image */}
          <img
            src={`/images/${newFiles[fileIndex]?.type}.png`}
            alt={newFiles[fileIndex]?.type}
            className="w-24 h-24 object-contain mb-4"
          />
          {/* No preview text */}
          <h1 className="dark:text-dark_text_2 text-lg mb-2">
            No preview available
          </h1>
          {/* File size and type */}
          <span className="dark:text-dark_text_2 text-sm">
            {newFiles[fileIndex]?.file.size} kB - {newFiles[fileIndex]?.type}
          </span>
        </div>
      )}
    </div>
  );
}
