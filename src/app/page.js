"use client";

// import { useSelector, useDispatch } from "react-redux";
// import Link from "next/link";
import { logout } from "../features/userSlice";
// import { CallIcon, ChatIcon } from "../components/svg";
import protectedWithAuth from "../hoc/protectedWithAuth";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";

function Home({ user }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const AUTH_ENDPOINT = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth`;
  // const { status, user } = useSelector((state) => state.userState);
  // console.log(status, user);

  const handleLogout = async () => {
    await axios.get(`${AUTH_ENDPOINT}/logout`, {
      withCredentials: true,
    });
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="dark">
      <h1 className="dark:bg-dark_bg_1">{user.email}</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default protectedWithAuth(Home);
