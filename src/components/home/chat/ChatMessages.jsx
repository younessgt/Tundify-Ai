import { useSelector } from "react-redux";
import Message from "./Message";
import React from "react";
import { formatDate } from "@/utils/dateConverter";
import { useRef, useEffect, useState } from "react";
import useSocketContext from "@/hooks/useSocket";
import Typing from "./Typing";

export default function ChatMessages() {
  const { messages, activeConversation } = useSelector(
    (state) => state.chatState
  );
  const { user } = useSelector((state) => state.userState);
  const messagesEndRef = useRef(null);
  const { socket, isConnected } = useSocketContext();
  const [isTyping, setIsTyping] = useState(false);
  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      // console.log("scroll");
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleTyping = (conversationId) => {
      if (conversationId === activeConversation._id) setIsTyping(true);
    };

    const handleStopTyping = () => {
      setIsTyping(false);
    };

    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, [socket, activeConversation]);

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

      {/* {isTyping && (
        <div className="flex items-center space-x-2 text-black dark:text-gray-300">
          <span>Typing...</span>
          <div className="animate-pulse">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          </div>
          <div className="animate-pulse">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          </div>
          <div className="animate-pulse">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          </div>
        </div>
      )} */}

      {isTyping && <Typing messages={messages} />}
      <div ref={messagesEndRef} />
    </div>
  );
}
