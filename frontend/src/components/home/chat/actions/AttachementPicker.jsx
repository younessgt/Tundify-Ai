"use client";

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Document from "./Attachement/Documents";

import Photos from "./Attachement/Photos";
import Camera from "./Attachement/Camera";

export default function AttachementPicker() {
  const [isRotated, setIsRotated] = useState(false);

  const handleToogle = () => {
    setIsRotated((prev) => !prev);
  };

  const handleBodyClick = (e) => {
    // If the clicked element is not the icon, reset to "plus" state
    if (!e.target.closest(".attachment-icon")) {
      setIsRotated(false);
    }
  };

  useEffect(() => {
    document.body.addEventListener("click", handleBodyClick);
    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, []);

  return (
    <div
      className=" attachment-icon flex justify-center items-center w-[60px] cursor-pointer relative"
      onClick={handleToogle}
    >
      <div
        className={`w-[45px] h-[45px] flex justify-center items-center  ${
          isRotated ? " bg-dark_bg_5 rounded-full" : ""
        } `}
      >
        <div
          className={`
            p-4 absolute dark:bg-dark_bg_1 rounded-lg bottom-16 dark:text-dark_text_1 left-6
            w-[230px] max-w-[340px]
            transform-gpu transition-all duration-200 ease-in-out origin-bottom-left
            ${
              isRotated
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-0 pointer-events-none"
            }
          `}
        >
          <ul className="flex flex-col gap-y-1">
            <Document />
            <Photos />
            <Camera />
          </ul>
        </div>

        <FaPlus
          className={`w-5 h-5 fill-current dark:fill-dark_svg_1  transition-transform duration-500 ${
            isRotated ? "rotate-[135deg] hover:bg-dark_bg_5" : ""
          }`}
        />
      </div>
    </div>
  );
}
