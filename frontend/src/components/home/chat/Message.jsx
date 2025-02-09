import moment from "moment";

export default function Message({
  message,
  senderIsMe,
  isNewDay,
  currentDate,
}) {
  return (
    <div className="flex flex-col">
      {/* Date divider (only if isNewDay is true) */}
      <div className="w-full flex justify-center items-center">
        {isNewDay && (
          <div className="my-2 flex justify-center">
            <div className="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200">
              {currentDate}
            </div>
          </div>
        )}
      </div>

      {/* Main message bubble */}
      <div
        className={`w-full flex mt-2 space-x-3 max-w-xs ${
          senderIsMe ? "ml-auto justify-end" : ""
        }`}
      >
        <div>
          <div
            className={`relative dark:text-dark_text_1 pl-2 py-2  rounded-xl shadow-lg max-w-xs ${
              senderIsMe
                ? "dark:bg-dark_bg_7 pr-[60px]"
                : "dark:bg-dark_btn_1 pr-[45px]"
            }`}
          >
            {/* Message text */}
            <p className="pb-[2px] whitespace-normal break-words">
              {message?.message}
            </p>

            {/* Timestamp in bottom-right */}
            <span
              className={`absolute bottom-0  text-[11px] text-gray-400 dark:text-gray-300 ${
                senderIsMe ? "right-7" : "right-3"
              }`}
            >
              {moment(message.createdAt).format("HH:mm")}
            </span>

            {/* Outer arrow for the bubble */}
            <div
              className={`absolute  ${
                senderIsMe
                  ? "dark:bg-dark_bg_7 bottom-0 -right-3 w-6 h-3"
                  : "dark:bg-dark_btn_1 bottom-0 -left-3 w-6 h-3"
              }`}
            ></div>

            {/* Inner corner (white) arrow */}
            <div
              className={`absolute bottom-[1px] ${
                senderIsMe ? "-right-4 rounded-bl-xl" : "-left-4 rounded-br-xl"
              } w-4 h-4 bg-white dark:bg-dark_bg_2`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
