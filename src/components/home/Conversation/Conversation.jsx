// import userImage from "../../../assets/images/user.png";
import { dateConverter } from "@/utils/dateConverter";
import { useDispatch, useSelector } from "react-redux";
import { createOpenConversation } from "@/features/chatSlice";
import {
  getRecieverId,
  getRecieverName,
  getRecieverPicture,
} from "@/utils/getReciever";
// import { useState, useEffect } from "react";
import { capitalise } from "@/utils/capitalise";
import useSocketContext from "@/hooks/useSocket";
import { getMessageTitle } from "@/utils/getFileType";

export default function Conversation({ convo, isTyping }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userState);
  const { activeConversation } = useSelector((state) => state.chatState);
  const { socket, isConnected } = useSocketContext();

  let latestMessage = "";
  const finalFileIndex = convo.latestMessage?.files.length - 1;
  const finalFile = convo.latestMessage?.files[finalFileIndex];

  let openConversation = null;

  if (!finalFile) {
    latestMessage =
      convo.latestMessage?.message ||
      convo.latestMessage?.files[finalFileIndex].message ||
      "";
  } else {
    latestMessage =
      convo.latestMessage?.message ||
      convo.latestMessage?.files[finalFileIndex].message ||
      getMessageTitle(finalFile) ||
      "";
  }

  openConversation = async () => {
    const values = {
      accesstoken: user.accessToken,
      recieverId: getRecieverId(convo.users, user._id),
      isGroup: false,
    };
    await dispatch(createOpenConversation(values));
  };

  return (
    <>
      {convo?.latestMessage ? (
        <>
          <div
            className={` ${
              convo._id === activeConversation._id
                ? "dark:bg-dark_bg_2"
                : "hover:dark:bg-dark_bg_9"
            } h-[72px]  cursor-pointer dark:text-dark_text_1 px-[10px]`}
            onClick={openConversation}
          >
            <div className="relative w-full flex items-center justify-between py-[10px]">
              {/*Left side*/}

              <div className="flex items-center gap-x-3">
                {/*Conversation picture*/}

                <div className="relative max-w-[50px] min-w-[50px] h-[50px] rounded-full overflow-hidden  ">
                  <img
                    src={getRecieverPicture(convo.users, user._id)}
                    alt="conversation-picture"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                {/*Conversation name and message*/}

                <div className="w-full flex flex-col justify-center">
                  {/*Conversation name*/}
                  <h1 className="font-bold flex items-center">
                    {capitalise(getRecieverName(convo.users, user._id))}
                  </h1>

                  {/*Conversation latestMessage*/}

                  <div className="max-w-[300px] truncate text-sm dark:text-dark_text_2 relative">
                    {isTyping ? (
                      <span>typing...</span>
                    ) : (
                      <span>{latestMessage}</span>
                    )}
                  </div>
                </div>
              </div>
              {/*Right side*/}
              <div className="dark:text-dark_text_2 text-sm">
                <span>{dateConverter(convo?.latestMessage?.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="border-b-[1px] border-[#202C33] ml-[65px]"></div>{" "}
        </>
      ) : null}
    </>
  );
}
