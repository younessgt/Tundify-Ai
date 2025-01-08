"use client";

import { useState, useEffect, useRef } from "react";
import { DotsIcon } from "../../svg";
import ConversationList from "./ConversationList";
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";
import DotMenu from "./DotMenu";
import useSocketContext from "@/hooks/useSocket";
import { useSelector } from "react-redux";

export default function Conversations() {
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [typingStatus, setTypingStatus] = useState({});
  const { socket, isConnected } = useSocketContext();
  const { conversations } = useSelector((state) => state.chatState);

  const handleToggleMenu = () => setShowMenu((prev) => !prev);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      // Check if the click is outside the menuRef

      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false); // Close the menu
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  console.log(typingStatus);

  useEffect(() => {
    console.log("socket", socket);
    if (!socket) return;

    const handleTyping = (conversationId) => {
      console.log("type");
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

  useEffect(() => {
    if (socket && isConnected && conversations.length > 0) {
      conversations.forEach((convo) => {
        socket.emit("user-join-conversation", convo._id);
      });
    }
  }, [socket, isConnected, conversations]);

  return (
    <div className="w-full h-full bg-dark_bg_8 flex flex-col">
      {/* Header */}
      <div className=" flex justify-between items-center text-white  p-2 relative">
        <h1 className="text-lg">Chats</h1>
        <ul className="flex items-center justify-center">
          <li ref={menuRef}>
            <button
              onClick={handleToggleMenu}
              className={`p-2 rounded-full transition-colors duration-200 ${
                showMenu ? "dark:bg-dark_bg_2" : ""
              }`}
            >
              <DotsIcon className="fill-white" />
            </button>
            {showMenu ? <DotMenu /> : null}
          </li>
        </ul>
      </div>
      {/*Search bar */}
      <SearchBar
        setSearchResult={setSearchResult}
        setSearchValue={setSearchValue}
      />
      {/* Conversation list*/}
      {searchResult.length > 0 ? (
        <>
          <SearchResult searchResult={searchResult} />
        </>
      ) : (
        <>
          <ConversationList
            searchValue={searchValue}
            typingStatus={typingStatus}
          />
        </>
      )}
    </div>
  );
}
