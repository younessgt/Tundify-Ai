import { useEffect, useRef } from "react";
import { BeatLoader } from "react-spinners";

export default function Typing({ messages }) {
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      // console.log("scroll");
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className="flex flex-col">
      {/* Main message bubble */}
      <div className="w-full flex mt-2 space-x-3 max-w-xs ">
        <div>
          <div className="relative dark:text-dark_text_1 pl-2 py-2  rounded-xl shadow-lg max-w-xs dark:bg-dark_btn_1 pr-[10px]">
            {/* Message text */}
            <p className=" whitespace-normal break-words">
              <BeatLoader size={8} color="white" />{" "}
            </p>

            {/* Outer arrow for the bubble */}
            <div className="absolute dark:bg-dark_btn_1 bottom-0 -left-3 w-6 h-3"></div>

            {/* Inner corner (white) arrow */}
            <div className="absolute bottom-[1px] -left-4 rounded-br-xl w-4 h-4 bg-white dark:bg-dark_bg_2" />
          </div>
        </div>
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}
