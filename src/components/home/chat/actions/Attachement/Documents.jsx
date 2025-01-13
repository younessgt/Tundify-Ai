import { addFiles } from "@/features/chatSlice";
import { getFileType } from "@/utils/getFileType";
import { useRef } from "react";
import { IoDocumentText } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

export default function Documents() {
  const inputRef = useRef();
  const dispatch = useDispatch();

  const { activeConversation } = useSelector((state) => state.chatState);

  const handleInputChange = (e) => {
    let files = Array.from(e.target.files);
    files.forEach((file) => {
      if (
        file.type !== "application/pdf" &&
        file.type !== "text/css" &&
        file.type !== "application/msword" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
        file.type !== "text/html" &&
        file.type !== "application/vnd.ms-powerpoint" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.presentationml.presentation" &&
        file.type !== "application/vnd.rar" &&
        file.type !== "text/plain" &&
        file.type !== "audio/wav" &&
        file.type !== "application/vnd.ms-excel" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        file.type !== "application/zip" &&
        file.type !== "application/x-zip-compressed" &&
        file.type !== "audio/3gpp" &&
        file.type !== "application/x-7z-compressed" &&
        file.type !== "audio/mpeg"
      ) {
        files = files.filter((elem) => elem.name !== file.name);
        console.log("no");
        return;
      } else if (file.size > 1024 * 1024 * 10) {
        files = files.filter((elem) => elem.name !== file.name);
        return;
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          dispatch(
            addFiles({
              file,
              type: getFileType(file.type),
              fileConvoId: activeConversation._id,
              id: crypto.randomUUID(),
            })
          );
        };
      }
    });
  };
  return (
    <li
      className="flex pr-9 pl-3 hover:bg-dark_bg_7 h-10 items-center rounded-lg"
      onClick={() => inputRef.current.click()}
    >
      <div className="mr-2 ">
        <IoDocumentText className="w-6 h-6 fill-dark_svg_4" />
      </div>
      <div>
        <span>Document</span>
      </div>
      <input
        type="file"
        hidden
        multiple
        onChange={handleInputChange}
        ref={inputRef}
        accept="application/*,text/*,audio/*"
      />
    </li>
  );
}
