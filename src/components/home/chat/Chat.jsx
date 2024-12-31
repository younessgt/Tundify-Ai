"use client";
import { useDispatch, useSelector } from "react-redux";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import { useEffect } from "react";
import { getConversationMessages } from "@/features/chatSlice";
import { CircularProgress } from "@mui/material";
import ChatActions from "./ChatActions";

export default function Chat() {
  const dispatch = useDispatch();
  const { activeConversation, status } = useSelector(
    (state) => state.chatState
  );

  //   console.log("activeConversation", activeConversation._id);
  //   console.log("messages", messages[0]?.conversation._id);

  const { user } = useSelector((state) => state.userState);
  const values = {
    accessToken: user.accessToken,
    conversation_id: activeConversation._id,
  };

  useEffect(() => {
    if (user?.accessToken && activeConversation?._id) {
      dispatch(getConversationMessages(values));
    }
  }, [activeConversation]);

  //   console.log("activeConversation", activeConversation._id);
  //   console.log("messages", messages[0].conversation._id);

  //   if (activeConversation?._id === messages[0]?.conversation._id) {
  //     console.log("messages", messages);
  //   }
  return (
    <div className="dark:bg-dark_bg_2 h-full flex flex-col w-full border-l dark:border-l-dark_border_2">
      {/* chat header */}
      <div className="w-full h-[60px] flex  items-center  dark:bg-dark_bg_3 border-b dark:border-b-dark_border_2">
        <ChatHeader />
      </div>
      <div className="flex flex-grow justify-center items-center">
        {status !== "succeeded" && status !== "failed" ? (
          <div className="flex justify-center items-center ">
            <CircularProgress
              style={{ color: "#ff5722" }}
              data-testid="loading-spinner"
            />
          </div>
        ) : (
          <ChatMessages />
        )}
      </div>
      <div className="h-[60px] w-full flex items-center dark:bg-dark_bg_3 border-t dark:border-t-dark_border_2">
        <ChatActions />
      </div>
    </div>
  );
}
