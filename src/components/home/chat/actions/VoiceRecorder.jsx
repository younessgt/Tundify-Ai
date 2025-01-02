import { MdKeyboardVoice } from "react-icons/md";

export default function VoiceRecorder() {
  return (
    <div className=" attachment-icon flex justify-center items-center w-[60px] cursor-pointer">
      <div className="w-[45px] h-[45px] flex justify-center items-center ">
        <MdKeyboardVoice className="w-7 h-7 fill-current dark:fill-dark_svg_1" />
      </div>
    </div>
  );
}
