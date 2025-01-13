import { removeFiles } from "@/features/chatSlice";
import { getFilesForActiveConversation } from "@/utils/getFilesForActiveConversation";
import { useDispatch, useSelector } from "react-redux";
import { IoSend } from "react-icons/io5";
import AddFile from "./AddFile";
import { uploadFiles } from "@/utils/uploadFiles";

export default function ThumbnailListAndSend({
  fileIndex,
  setFileIndex,
  message,
}) {
  const { files, activeConversation } = useSelector((state) => state.chatState);
  const dispatch = useDispatch();
  let newFiles = getFilesForActiveConversation(files, activeConversation);

  const handleDelete = (index) => {
    dispatch(removeFiles(index));

    if (fileIndex >= newFiles.length - 1) {
      setFileIndex(Math.max(newFiles.length - 2, 0)); // Adjust fileIndex to stay within bounds
    }
  };

  return (
    <div className="w-full flex justify-between items-center">
      <span></span>
      <div className="flex gap-x-2 relative">
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

      <div className="w-14 h-14 dark:bg-dark_btn_1 rounded-full flex justify-center items-center">
        <IoSend className="fill-dark_text_1 w-7 h-7 " />
      </div>
    </div>
  );
}
