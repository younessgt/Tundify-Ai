"use client";
import { useEffect, useState } from "react";

import { CircularProgress } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import useSocketContext from "@/hooks/useSocket";

import Conversation from "./Conversation";

export default function ConversationList({ searchValue }) {
  const { conversations } = useSelector((state) => state.chatState);
  const [loading, setLoading] = useState(true);
  const [typingStatus, setTypingStatus] = useState({});
  const { socket } = useSocketContext();

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleTyping = (conversationId) => {
      setTypingStatus((prev) => ({
        ...prev,
        [conversationId]: true,
      }));
    };

    const handleStopTyping = (conversationId) => {
      setTypingStatus((prev) => {
        const updated = { ...prev };
        delete updated[conversationId];
        console.log("updated", updated);
        return updated;
      });
    };

    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
    };
  }, [socket]);

  if (loading) {
    return (
      <div className="w-full h-full  overflow-y-scroll custom-scrollbar flex justify-center items-center">
        <CircularProgress
          style={{ color: "#ff5722" }}
          data-testid="loading-spinner"
        />
      </div>
    );
  }

  // console.log(conversations);
  return (
    <div className="w-full h-full  overflow-y-scroll custom-scrollbar">
      {conversations && searchValue === "" ? (
        conversations.map((convo) => (
          <Conversation
            convo={convo}
            key={convo._id}
            isTyping={typingStatus[convo._id] || false}
            // onClick={() => handleConversationClick(convo._id)}
          />
        ))
      ) : (
        <div className="w-full h-full  overflow-y-scroll custom-scrollbar flex justify-center items-center">
          No results found
        </div>
      )}
    </div>
  );
}
