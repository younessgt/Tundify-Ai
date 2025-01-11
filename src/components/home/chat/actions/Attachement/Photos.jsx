import { useRef } from "react";
import { IoMdPhotos } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { addFiles } from "@/features/chatSlice";
import { getFileType } from "@/utils/getFileType";
export default function Photos() {
  const inputRef = useRef();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    let files = Array.from(e.target.files);

    files.forEach((file) => {
      if (
        file.type !== "image/png" &&
        file.type !== "image/webp" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/gif" &&
        file.type !== "video/mp4" &&
        file.type !== "video/mpeg" &&
        file.type !== "video/x-msvideo" &&
        file.type !== "video/webm"
      ) {
        files = files.filter((elem) => elem.name !== file.name);
        return;
      } else if (file.size > 1024 * 1024 * 5) {
        files = files.filter((elem) => elem.name !== file.name);
        return;
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          dispatch(
            addFiles({
              file: file,
              fileBase64: e.target.result,
              type: getFileType(file.type),
            })
          );
        };
      }
    });
  };
  return (
    <li
      className="flex pr-9 pl-3 hover:bg-dark_bg_7 h-10 items-center rounded-lg "
      onClick={() => inputRef.current.click()}
    >
      <div className="mr-2 ">
        <IoMdPhotos className="w-6 h-6 fill-dark_svg_5" />
      </div>
      <div>
        <span>Photos & Videos</span>
      </div>
      <input
        type="file"
        hidden
        multiple
        ref={inputRef}
        onChange={handleInputChange}
        accept="image/png,image/jpeg,image/gif,image/webp, video/*"
      />
    </li>
  );
}
