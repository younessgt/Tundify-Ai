import { useRef } from "react";
import { IoMdPhotos } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { addFiles } from "@/features/chatSlice";
export default function Photos() {
  const inputRef = useRef();
  const dispatch = useDispatch();

  const { files } = useSelector((state) => state.chatState);

  console.log(files);

  const handleInpuChange = (e) => {
    let files = Array.from(e.target.files);

    files.forEach((fileImage) => {
      if (
        fileImage.type !== "image/png" &&
        fileImage.type !== "image/webp" &&
        fileImage.type !== "image/jpeg" &&
        fileImage.type !== "image/gif"
      ) {
        files = files.filter((elem) => elem.name !== fileImage.name);
        return;
      } else if (fileImage.size > 1024 * 1024 * 5) {
        files = files.filter((elem) => elem.name !== fileImage.name);
        return;
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(fileImage);
        reader.onload = (e) => {
          dispatch(
            addFiles({
              file: fileImage,
              imgBase64: e.target.result,
              type: "image",
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
        <span>Photos</span>
      </div>
      <input
        type="file"
        hidden
        ref={inputRef}
        onChange={handleInpuChange}
        accept="image/png,image/jpeg,image/gif,image/webp"
      />
    </li>
  );
}
