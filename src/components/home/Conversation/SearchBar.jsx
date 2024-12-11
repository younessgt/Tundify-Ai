"use client";
import { ReturnIcon } from "@/components/svg";
import { useRef, useState } from "react";

export default function SearchBar() {
  // const [showArrow, setShowArrow] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const searchInput = useRef();

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="p-2">
      <div className=" h-[40px] w-full mb-3">
        <form className="w-full mx-auto h-full">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative h-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              {searchValue ? (
                <ReturnIcon className="fill-dark_btn_1 rotateAnimation" />
              ) : (
                <svg
                  className="w-3 h-3 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              )}
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full h-full ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-[#ff5722] focus:border-[#ff5722] dark:bg-dark_bg_2 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#ff5722] dark:focus:border-[#ff5722]"
              placeholder="Search "
              required
              onChange={handleInputChange}
              ref={searchInput}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
