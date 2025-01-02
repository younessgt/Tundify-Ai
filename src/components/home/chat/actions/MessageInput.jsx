import { sendMessage } from "@/features/chatSlice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";

export default function MessageInput({ message, setMessage }) {
  const dispatch = useDispatch();
  const { activeConversation } = useSelector((state) => state.chatState);
  const { user } = useSelector((state) => state.userState);

  const { accessToken } = user;

  const handleChange = (e) => {
    setMessage(e.target.value);
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

      await dispatch(sendMessage(values));
      setMessage("");
    }
  };

  //   console.log(message);
  return (
    <div className=" flex-1  justify-center items-center">
      <form className="w-full h-11  mt-2 mb-2" onSubmit={handleSubmit}>
        <div className="relative  w-full h-full">
          <div className="absolute top-1/2 left-2 transform -translate-y-1/2  flex items-center cursor-pointer">
            <RiEmojiStickerLine className="w-7 h-7 fill-current dark:fill-dark_svg_1 " />
          </div>
          <input
            type="text"
            className="w-full h-full pl-12 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-[#ff5722] focus:border-[#ff5722] dark:bg-dark_bg_7 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#ff5722] dark:focus:border-[#ff5722]"
            placeholder="Type a message..."
            onChange={handleChange}
            value={message}
          />
        </div>
      </form>
    </div>
  );
}
