"use client";
import { ReturnIcon } from "@/components/svg";
import axios from "axios";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateAccessToken, logout } from "@/features/userSlice";
import { useRouter } from "next/navigation";

export default function SearchBar({ setSearchResult, setSearchValue }) {
  // const [showArrow, setShowArrow] = useState(false);
  const USER_ENDPOINT = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user`;
  const AUTH_ENDPOINT = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth`;

  const [searchInputValue, setSearchInputValue] = useState("");
  const { user } = useSelector((state) => state.userState);
  const dispatch = useDispatch();
  const router = useRouter();

  const searchInput = useRef();

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchInputValue(value);

    // **Update searchValue when input is empty**
    if (!value) {
      setSearchResult([]);
      setSearchValue("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // add part where to check if the accessToken is still valid and if not, refresh it

    if (searchInputValue) {
      try {
        const response = await axios.get(
          `${USER_ENDPOINT}?search=${searchInputValue}`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
            withCredentials: true,
          }
        );
        // console.log(response.data.users);
        setSearchResult(response.data?.users);
        setSearchValue(searchInputValue);
        if (response.data?.accessToken) {
          // console.log("updating access token");
          dispatch(updateAccessToken(response.data.accessToken));
        }
        // console.log(response.data);
      } catch (error) {
        if (error.status === 401) {
          // console.log("error 401");
          dispatch(logout());
          axios.get(`${AUTH_ENDPOINT}/logout`, { withCredentials: true });
          router.push("/login");
        }
        console.log(error);
      }
    }
  };

  const handleClickReturn = () => {
    setSearchInputValue("");
    setSearchResult([]);
    setSearchValue("");
    searchInput.current.value = "";
    searchInput.current.focus();
  };

  return (
    <div className="p-2">
      <div className=" h-[40px] w-full mb-3">
        <form className="w-full mx-auto h-full" onSubmit={handleSubmit}>
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative h-full">
            <div className=" absolute inset-y-0 start-0 flex items-center ps-3">
              {searchInputValue ? (
                <span onClick={handleClickReturn} className="cursor-pointer">
                  <ReturnIcon className="fill-dark_btn_1 rotateAnimation" />
                </span>
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
              onChange={handleInputChange}
              ref={searchInput}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
