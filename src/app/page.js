"use client";

// import { useSelector, useDispatch } from "react-redux";
// import Link from "next/link";
import { logout } from "../features/userSlice";
// import { CallIcon, ChatIcon } from "../components/svg";
import protectedWithAuth from "../hoc/protectedWithAuth";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";
import SideBar from "@/components/home/sideBar/SideBar";
import Conversations from "@/components/home/Conversation/Conversations";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getConversations } from "../features/chatSlice";
import WelcomePage from "@/components/home/chat/WelcomePage";
import Chat from "@/components/home/chat/Chat";
import useSocket from "@/hooks/useSocket";
import useSocketContext from "@/hooks/useSocket";

function Home() {
  const [isDiv4Open, setIsDiv4Open] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1400);
  const [hasMounted, setHasMounted] = useState(false);
  const dispatch = useDispatch();

  const [selectedMenu, setSelectedMenu] = useState("chat");
  const { user } = useSelector((state) => state.userState);
  const { activeConversation } = useSelector((state) => state.chatState);

  // const { socket, isConnected } = useSocketContext();
  console.log("home");

  useEffect(() => {
    if (user?.accessToken) {
      dispatch(getConversations(user.accessToken));
    }
    const handleResize = () => setIsSmallScreen(window.innerWidth < 1400);
    handleResize();
    window.addEventListener("resize", handleResize);
    setHasMounted(true);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //function to  render content based on the selected menu option.
  const renderContent = () => {
    switch (selectedMenu) {
      case "chat":
        return <Conversations />;
      case "calls":
        return "Calls Content";
      case "calendar":
        return "Calendar Content";
      case "story":
        return "Story Content";
      case "settings":
        return "Settings Content";
      case "profile":
        return "Profile Content";
      default:
        return "Default Content";
    }
  };

  if (!hasMounted) return null;

  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden ">
      <div className=" flex  w-[1600px] h-full mx-auto ">
        <div className=" w-full flex items-center justify-center px-4 sm:px-6 lg:px-8  h-full">
          <div className="  w-full  h-full dark:bg-dark_bg_2 rounded-lg ">
            <div className="dark:bg-dark_bg_1  overflow-hidden rounded-lg w-full h-full">
              <div className="flex grow relative h-full">
                {/* Side Bar */}
                <SideBar
                  onMenuSelect={setSelectedMenu}
                  selectedMenu={selectedMenu}
                />

                {/* changebale content */}
                <div className="bg-dark_bg_8 w-[450px] flex-shrink-0">
                  {renderContent()}
                </div>

                {/* chat side */}
                <motion.div
                  className={
                    "dark:bg-dark_bg_2 h-full flex items-center justify-center"
                  }
                  initial={{ flex: 1 }}
                  animate={{
                    flex: isDiv4Open ? (isSmallScreen ? 0 : 0.65) : 1,
                    // x: isDiv4Open ? 0 : "0%",
                  }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{
                    display: isDiv4Open && isSmallScreen ? "none" : "flex",
                  }}
                >
                  {/* <button
                    onClick={() => setIsDiv4Open(true)}
                    className="bg-white text-green-500 px-4 py-2 rounded shadow"
                  >
                    Open Div 4
                  </button> */}

                  {activeConversation?._id ? <Chat /> : <WelcomePage />}
                </motion.div>

                {/* info of the user that im chating with  */}
                {isDiv4Open && (
                  <motion.div
                    className="bg-purple-500 h-full flex items-center justify-center"
                    initial={{ x: "100%" }}
                    animate={{
                      x: isDiv4Open ? 0 : "100%",
                    }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{
                      flex: isDiv4Open ? (isSmallScreen ? 1 : 0.35) : 0,
                    }}
                  >
                    <button
                      onClick={() => setIsDiv4Open(false)}
                      className="bg-white text-purple-500 px-4 py-2 rounded shadow"
                    >
                      Close Div 4
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}

export default protectedWithAuth(Home);
