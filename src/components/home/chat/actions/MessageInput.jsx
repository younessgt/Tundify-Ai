import { sendMessage } from "@/features/chatSlice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import { getRecieverId } from "@/utils/getReciever";

import { useState, useEffect, useRef } from "react";
import useSocketContext from "@/hooks/useSocket";

export default function MessageInput({ message, setMessage }) {
  const dispatch = useDispatch();
  const { activeConversation } = useSelector((state) => state.chatState);
  const { user } = useSelector((state) => state.userState);
  const { accessToken } = user;
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(null);
  const inputRef = useRef(null);
  const inpuTimeOut = useRef(null);
  const { socket, isConnected } = useSocketContext();
  // const recipientId = getRecieverId(activeConversation.users, user._id);

  const handleChange = (e) => {
    setMessage(e.target.value);

    if (socket && isConnected) {
      socket.emit("user-typing", activeConversation._id);
      if (inpuTimeOut.current) clearTimeout(inpuTimeOut.current);

      inpuTimeOut.current = setTimeout(() => {
        socket.emit("user-stop-typing", activeConversation._id);
      }, 1000);
    }
  };

  const handleEmojiClick = (emojiData) => {
    if (!inputRef.current) return;

    // Get the current selection  positions
    const startPos = inputRef.current.selectionStart;
    const endPos = inputRef.current.selectionEnd;
    const emoji = emojiData.emoji;

    // console.log(emojiData);

    setMessage((prevMsg) => {
      return prevMsg.slice(0, startPos) + emoji + prevMsg.slice(endPos);
    });

    // Move the cursor right after the inserted emoji
    // setTimeout(() => {
    //   const newPos = startPos + emoji.length;
    //   inputRef.current.selectionStart = newPos;
    //   inputRef.current.selectionEnd = newPos;
    //   inputRef.current.focus();
    // }, 0);
    setCursorPosition(startPos + emoji.length);
  };

  useEffect(() => {
    if (cursorPosition !== null && inputRef.current) {
      inputRef.current.selectionStart = cursorPosition;
      inputRef.current.selectionEnd = cursorPosition;
      inputRef.current.focus();
      // Reset so we don’t try to set selection on next re-renders
      // setCursorPosition(null);
    }
  }, [cursorPosition]);

  const handleBodyClick = (e) => {
    // If the clicked element is not the icon, reset to "plus" state
    if (!e.target.closest(".emoji-icon")) {
      setIsPickerVisible(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message) {
      const values = {
        message,
        accessToken,
        conversation_id: activeConversation._id,
        files: [],
      };

      const newMessage = await dispatch(sendMessage(values));

      if (socket && isConnected) {
        socket.emit("user-send-message", newMessage.payload.message);

        socket.emit("user-stop-typing");
      }
      setMessage("");
    }
    setIsPickerVisible(false);
  };

  useEffect(() => {
    document.body.addEventListener("click", handleBodyClick);
    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, []);

  return (
    <div className=" flex-1  justify-center items-center">
      <form className="w-full h-11  mt-2 mb-2" onSubmit={handleSubmit}>
        <div className=" emoji-icon relative  w-full h-full">
          <div
            className="absolute top-1/2 left-2 transform -translate-y-1/2  flex items-center cursor-pointer"
            onClick={() => setIsPickerVisible((prev) => !prev)}
          >
            <RiEmojiStickerLine
              className={`w-7 h-7  ${
                isPickerVisible
                  ? "dark:fill-dark_svg_3"
                  : "dark:fill-dark_svg_1"
              }`}
            />
          </div>

          {/* Emoji Picker */}
          {isPickerVisible && (
            <div className="absolute bottom-12 left-0 z-50 openEmojiAnimation">
              <EmojiPicker
                className="custom-emoji-picker"
                onEmojiClick={(emojiData) => handleEmojiClick(emojiData)}
                lazyLoadEmojis={true}
                theme="dark"
                emojiStyle="google"
              />
            </div>
          )}
          <input
            type="text"
            className="w-full h-full pl-12 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-[#ff5722] focus:border-[#ff5722] dark:bg-dark_bg_7 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#ff5722] dark:focus:border-[#ff5722]"
            placeholder="Type a message..."
            onChange={handleChange}
            value={message}
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>
      </form>
    </div>
  );
}
