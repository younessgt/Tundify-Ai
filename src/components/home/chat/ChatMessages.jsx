import { useSelector } from "react-redux";
import Message from "./Message";
import React, { useCallback, useLayoutEffect } from "react";
import { formatDate } from "@/utils/dateConverter";
import { useRef, useEffect, useState } from "react";
import useSocketContext from "@/hooks/useSocket";
import Typing from "./Typing";
import FileMessage from "./files-message/FileMessage";

export default function ChatMessages() {
  const { messages, activeConversation } = useSelector(
    (state) => state.chatState
  );

  const { user } = useSelector((state) => state.userState);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const { socket, isConnected } = useSocketContext();
  const [isTyping, setIsTyping] = useState(false);

  // Track how many media are left to load
  const [mediaToLoad, setMediaToLoad] = useState(0);

  // Re-calculate the image count whenever `messages` change
  useEffect(() => {
    let count = 0;
    messages.forEach((message) => {
      if (message.files && message.files.length > 0) {
        message.files.forEach((file) => {
          if (file.type === "IMAGE" || file.type === "VIDEO") {
            count++;
          }
        });
      }
    });
    setMediaToLoad(count);
  }, [messages]);

  //  Scroll immediately if there are no images to load;
  //    otherwise we’ll scroll as soon as the last image finishes loading
  // useEffect(() => {
  //   if (mediaToLoad === 0 && messagesEndRef.current) {
  //     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messages, mediaToLoad]);

  //  Handler we’ll pass down to fire each time an image loads
  const handleMediaLoad = () => {
    setMediaToLoad((prev) => {
      const newCount = prev - 1;
      // Once we’ve loaded the LAST image, scroll
      if (newCount === 0 && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
      return newCount;
    });
  };

  // const handleMediaLoad = useCallback(() => {
  //   setMediaToLoad((prev) => {
  //     const newCount = prev - 1;
  //     if (newCount === 0 && messagesEndRef.current) {
  //       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  //     }
  //     return newCount;
  //   });
  // }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
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
    <div
      className="flex flex-col overflow-y-auto custom-scrollbar overflow-x-hidden  w-full py-2 px-[6%] h-full"
      ref={messagesContainerRef}
    >
      {messages &&
        messages.map((message, index) => {
          const currentDate = formatDate(message.createdAt);

          const previousDate =
            index > 0 ? formatDate(messages[index - 1].createdAt) : null;

          // compare
          const isNewDay = currentDate !== previousDate;

          return (
            <React.Fragment key={message._id}>
              {message.files.length > 0 ? (
                message.files.map((file, id) => (
                  <FileMessage
                    file={file}
                    message={message}
                    isNewDay={isNewDay}
                    currentDate={currentDate}
                    senderIsMe={user._id === message.sender._id}
                    key={id}
                    onMediaLoad={handleMediaLoad}
                  />
                ))
              ) : (
                <Message
                  message={message}
                  isNewDay={isNewDay}
                  currentDate={currentDate}
                  senderIsMe={user._id === message.sender._id}
                />
              )}
              {/* <Message
                message={message}
                isNewDay={isNewDay}
                currentDate={currentDate}
                senderIsMe={user._id === message.sender._id}
              /> */}
            </React.Fragment>
          );
        })}

      {isTyping && <Typing messages={messages} />}
      <div ref={messagesEndRef}></div>
    </div>
  );
}
