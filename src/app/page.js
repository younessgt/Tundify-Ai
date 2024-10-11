"use client";

import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { logout } from "../features/userSlice";
import { CallIcon, ChatIcon } from "../components/svg";

export default function Home() {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.userState);
  console.log("hello", userState);
  return (
    <div className="dark">
      <button
        onClick={() => {
          dispatch(logout());
        }}
      >
        Logout
      </button>
      <h1 className="dark:bg-dark_bg_1">Hello World</h1>

      <CallIcon />
      <ChatIcon />
    </div>
  );
}
