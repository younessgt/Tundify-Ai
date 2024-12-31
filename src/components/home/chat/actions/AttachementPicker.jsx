"use client";

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

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
      className=" attachment-icon flex justify-center items-center w-[60px] cursor-pointer"
      onClick={handleToogle}
    >
      <div
        className={`w-[45px] h-[45px] flex justify-center items-center ${
          isRotated ? " bg-dark_bg_5 rounded-full" : ""
        } `}
      >
        <FaPlus
          className={`w-5 h-5 fill-current dark:fill-dark_svg_1  transition-transform duration-500 ${
            isRotated ? "rotate-[135deg] hover:bg-dark_bg_5" : ""
          }`}
        />
      </div>
    </div>
  );
}
