import { addFileToState } from "@/utils/addFileToState";
import { useRef } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

export default function AddFile() {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { activeConversation } = useSelector((state) => state.chatState);

  const handleAddFiles = (e) => {
    const fileAdded = addFileToState(e, activeConversation, dispatch);
    if (!fileAdded) return;
  };
  return (
    <div
      className="w-14 h-14 border  rounded-md overflow-hidden cursor-pointer flex justify-center items-center"
      onClick={() => inputRef.current.click()}
    >
      <FaPlus className="w-5 h-5 fill-dark_text_1" />
      <input
        type="file"
        hidden
        ref={inputRef}
        onChange={handleAddFiles}
        multiple
        accept="image/png,image/jpeg,image/gif,image/webp, video/* application/*,text/*,audio/*"
      />
    </div>
  );
}
