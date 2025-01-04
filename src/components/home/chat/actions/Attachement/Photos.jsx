import { IoMdPhotos } from "react-icons/io";
export default function Photos() {
  return (
    <li className="flex pr-9 pl-3 hover:bg-dark_bg_7 h-10 items-center rounded-lg ">
      <div className="mr-2 ">
        <IoMdPhotos className="w-6 h-6 fill-dark_svg_5" />
      </div>
      <div>
        <span>Photos & Videos</span>
      </div>
    </li>
  );
}
