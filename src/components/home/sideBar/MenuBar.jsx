import { BsChatDotsFill } from "react-icons/bs";
import { FaPhone, FaCalendarDays } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import StatusIcon from "../../svg/statusIcon";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function MenuBar({ onMenuSelect, selectedMenu }) {
  const { user } = useSelector((state) => state.userState);
  const menuItems = [
    {
      id: "chat",
      label: "Chats",
      icon: (
        <BsChatDotsFill
          size={25}
          color="white"
          className="hover:cursor-pointer"
        />
      ),
    },
    {
      id: "calls",
      label: "Calls",
      icon: (
        <FaPhone size={25} color="white" className="hover:cursor-pointer" />
      ),
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: (
        <FaCalendarDays
          size={25}
          color="white"
          className="hover:cursor-pointer"
        />
      ),
    },
    {
      id: "story",
      label: "Story",
      icon: (
        <StatusIcon className="text-white hover:cursor-pointer" size={25} />
      ),
    },
  ];

  const buttomItems = [
    {
      id: "settings",
      label: "Settings",
      icon: (
        <IoSettingsSharp
          size={25}
          color="white"
          className="hover:cursor-pointer"
        />
      ),
    },
    {
      id: "profile",
      label: "Profile",
      icon: (
        <div className="border-2 rounded-full w-[26px] h-[26px] hover:cursor-pointer">
          <img src={user.picture} alt="user picture" />
        </div>
      ),
    },
  ];

  const renderMenuItems = (items) =>
    items.map(({ id, label, icon }) => (
      <div
        key={id}
        className={`relative group ${
          selectedMenu === id
            ? "bg-dark_bg_7 rounded-lg p-[6px] border-[#ff5722] ring-[#ff5722] border-[1.7px]"
            : ""
        }`}
        onClick={() => onMenuSelect(id)}
      >
        <div className="transform transition-transform duration-200 hover:scale-125">
          {icon}
        </div>
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 invisible group-hover:visible transition-opacity duration-200 bg-dark_bg_2 text-white px-3 py-1  rounded-2xl text-xs">
          {label}
        </div>
      </div>
    ));

  return (
    <>
      <div className=" w-[35px] flex flex-col items-center gap-4">
        {renderMenuItems(menuItems)}
      </div>

      <div className=" w-[35px] flex flex-col items-center gap-4">
        {renderMenuItems(buttomItems)}
      </div>
    </>
  );
}
