import { MdPhotoCamera } from "react-icons/md";
export default function Camera() {
  return (
    <li className="flex pr-9 pl-3 hover:bg-dark_bg_7 h-10 items-center rounded-lg">
      <div className="mr-2 ">
        <MdPhotoCamera className="w-6 h-6 fill-dark_svg_6" />
      </div>
      <div>
        <span>Camera</span>
      </div>
    </li>
  );
}
