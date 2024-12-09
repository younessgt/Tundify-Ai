import { BsChatDotsFill } from "react-icons/bs";
import { FaPhone, FaCalendarDays } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import StatusIcon from "../svg/statusIcon";
import { useState } from "react";

export default function MenuBar({ onMenuSelect, selectedMenu }) {
  const menuItems = [
    {
      id: "chat",
      label: "Chat",
      icon: <BsChatDotsFill size={25} color="white" />,
    },
    { id: "calls", label: "Calls", icon: <FaPhone size={25} color="white" /> },
    {
      id: "calendar",
      label: "Calendar",
      icon: <FaCalendarDays size={25} color="white" />,
    },
    {
      id: "story",
      label: "Story",
      icon: <StatusIcon className="text-white" size={25} />,
    },
  ];

  const buttomItems = [
    {
      id: "settings",
      label: "Settings",
      icon: <IoSettingsSharp size={25} color="white" />,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <div className="border-2 rounded-full w-[26px] h-[26px]"></div>,
    },
  ];

  const renderMenuItems = (items) =>
    items.map(({ id, label, icon }) => (
      <div
        key={id}
        className={`relative group ${
          selectedMenu === id ? "bg-dark_bg_7 rounded-lg p-[6px]" : ""
        }`}
        onClick={() => onMenuSelect(id)}
      >
        <div className="transform transition-transform duration-200 hover:scale-125">
          {icon}
        </div>
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-dark_bg_7 text-white px-3 py-1  rounded-2xl text-xs">
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

{
  /* <div className="relative group">
          <div className="transform transition-transform duration-200 hover:scale-125">
            <FaCalendarDays size={25} color="white" />
          </div>
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-dark_btn_2 text-white px-3 py-1  rounded-2xl text-xs">
            Calender
          </div>
        </div>

        <div className="relative group">
          <div className="transform transition-transform duration-200 hover:scale-125">
            <StatusIcon className="text-white" size={25} />
          </div>
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-dark_bg_2 text-white px-3 py-1  rounded-2xl text-xs">
            Story
          </div>
        </div>
      </div>

      <div className=" w-[35px] flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="transform transition-transform duration-200 hover:scale-125">
            <IoSettingsSharp size={25} color="white" />
          </div>
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-dark_btn_2 text-white px-3 py-1  rounded-2xl text-xs">
            Settings
          </div>
        </div>

        <div className="relative group">
          <div className="transform transition-transform duration-200 hover:scale-125">
            <div className="border-2 rounded-full w-[26px] h-[26px]"></div>
          </div>
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-dark_bg_2 text-white px-3 py-1  rounded-2xl text-xs">
            Profile
          </div>
        </div> */
}
