"use client";
import { useEffect, useState } from "react";

import { CircularProgress } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
// import useSocketContext from "@/hooks/useSocket";

import Conversation from "./Conversation";

export default function ConversationList({ searchValue, typingStatus }) {
  const { conversations } = useSelector((state) => state.chatState);
  const [loading, setLoading] = useState(true);
  // console.log("conversations", conversations);

  useEffect(() => {
    setLoading(false);
  }, []);

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
