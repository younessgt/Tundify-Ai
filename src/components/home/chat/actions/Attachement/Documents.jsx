import { IoDocumentText } from "react-icons/io5";

export default function Documents() {
  return (
    <li className="flex pr-9 pl-3 hover:bg-dark_bg_7 h-10 items-center rounded-lg">
      <div className="mr-2 ">
        <IoDocumentText className="w-6 h-6 fill-dark_svg_4" />
      </div>
      <div>
        <span>Document</span>
      </div>
    </li>
  );
}
