"use client";

import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { logout } from "../features/userSlice";
import { CallIcon, ChatIcon } from "../components/svg";

export default function Home() {
  const dispatch = useDispatch();
  const { status, user } = useSelector((state) => state.userState);
  console.log(status, user);
  return (
    <div className="dark">
      <button
        onClick={() => {
          dispatch(logout());
        }}
      >
        Logout
      </button>
      <h1 className="dark:bg-dark_bg_1">{user.email}</h1>

      <CallIcon />
      <ChatIcon />
    </div>
  );
}
