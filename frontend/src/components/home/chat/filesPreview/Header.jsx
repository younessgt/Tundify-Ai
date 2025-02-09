import { IoClose } from "react-icons/io5";
import { FaCropSimple } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { removeAllFiles } from "@/features/chatSlice";

export default function Header() {
  const dispatch = useDispatch();
  const handleRemoveFiles = () => {
    dispatch(removeAllFiles());
  };
  return (
    <>
      <div onClick={handleRemoveFiles} className="cursor-pointer">
        <IoClose className="w-7 h-7 fill-current dark:fill-dark_svg_1" />
      </div>

      <div>
        <div>
          <FaCropSimple className="w-5 h-5 fill-current dark:fill-dark_svg_1" />
        </div>
      </div>
    </>
  );
}
