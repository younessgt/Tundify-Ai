import { useSelector } from "react-redux";
import Message from "./Message";
import React from "react";
import { formatDate } from "@/utils/dateConverter";
import { useRef, useEffect } from "react";

export default function ChatMessages() {
  const { messages } = useSelector((state) => state.chatState);
  const { user } = useSelector((state) => state.userState);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      // console.log("scroll");
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col overflow-y-auto custom-scrollbar overflow-x-hidden  w-full py-2 px-[6%] h-full">
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
        })}
      <div ref={messagesEndRef} />
    </div>
  );
}
