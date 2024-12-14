"use client";

import { useState, useEffect, useRef } from "react";
import { DotsIcon } from "../../svg";
import ConversationList from "./ConversationList";
import SearchBar from "./SearchBar";
import SearchResult from "./SearchResult";
import DotMenu from "./DotMenu";

export default function Conversations() {
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handleToggleMenu = () => setShowMenu((prev) => !prev);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      // Check if the click is outside the menuRef
      console.log(menuRef.current);
      console.log(e.target);
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false); // Close the menu
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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
          <ConversationList searchValue={searchValue} />
        </>
      )}
    </div>
  );
}
