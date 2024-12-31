import { useSelector } from "react-redux";
import Message from "./Message";
import React from "react";
import { formatDate } from "@/utils/dateConverter";

export default function ChatMessages() {
  const { messages } = useSelector((state) => state.chatState);
  const { user } = useSelector((state) => state.userState);

  console.log("messages", messages);
  return (
    <div className="flex flex-col overflow-y-auto custom-scrollbar overflow-x-hidden border-2 w-full py-2 px-[6%] h-full">
      {messages &&
        messages.map((message, index) => {
          const currentDate = formatDate(message.createdAt);

          const previousDate =
            index > 0 ? formatDate(messages[index - 1].createdAt) : null;

          // compare
          const isNewDay = currentDate !== previousDate;

          return (
            <React.Fragment key={message._id}>
              {/* Your existing Message component */}
              <Message
                message={message}
                isNewDay={isNewDay}
                currentDate={currentDate}
                senderIsMe={user._id === message.sender._id}
              />
            </React.Fragment>
          );

          // <Message
          //   message={message}
          //   key={message._id}
          //   senderIsMe={user._id === message.sender._id}
          // />;
        })}
    </div>
  );
}
