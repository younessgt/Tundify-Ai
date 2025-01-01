import { RiEmojiStickerLine } from "react-icons/ri";

export default function MessageInput() {
  return (
    <div className=" flex-1  justify-center items-center">
      <form className="w-full h-11  mt-2 mb-2">
        <div className="relative  w-full h-full">
          <div className="absolute top-1/2 left-2 transform -translate-y-1/2  flex items-center cursor-pointer">
            <RiEmojiStickerLine className="w-7 h-7 fill-current dark:fill-dark_svg_1 " />
          </div>
          <input
            type="text"
            className="w-full h-full pl-12 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-[#ff5722] focus:border-[#ff5722] dark:bg-dark_bg_7 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#ff5722] dark:focus:border-[#ff5722]"
            placeholder="Type a message..."
          />
        </div>
      </form>
    </div>
  );
}
