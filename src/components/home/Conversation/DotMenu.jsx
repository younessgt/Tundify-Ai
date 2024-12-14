import { useDispatch } from "react-redux";
import { logout } from "@/features/userSlice";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function DotMenu() {
  const dispatch = useDispatch();
  const AUTH_ENDPOINT = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth`;
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    axios.get(`${AUTH_ENDPOINT}/logout`, { withCredentials: true });
    router.push("/login");
  };
  return (
    <div className="absolute right-2 mt-1 w-56 rounded-[3px] shadow-lg dark:bg-dark_bg_2 text-white z-50 ">
      <ul className="py-2">
        <li
          className="px-6 py-2 hover:bg-dark_bg_7 cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </li>
        <li className="px-6 py-2 hover:bg-dark_bg_7 cursor-pointer">
          Settings
        </li>
        <li className="px-6 py-2 hover:bg-dark_bg_7 cursor-pointer">Help</li>
      </ul>
    </div>
  );
}
