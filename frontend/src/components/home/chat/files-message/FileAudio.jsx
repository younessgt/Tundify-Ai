import { DownloadIcon } from "@/components/svg";
import React from "react";
import AudioPlayer from "../audioplayer/AudioPlayer";

export default function FileAudio({ file, senderIsMe }) {
  return (
    <>
      <div className="flex cursor-pointer w-full h-full p-1">
        <div
          className={`flex  gap-2 w-[320px] p-1 rounded-md ${
            senderIsMe ? "dark:bg-dark_bg_8" : "dark:bg-dark_btn_2"
          }`}
        >
          {/*File Infos */}
          <div className="flex items-center gap-1 w-[250px] audio-player">
            {/* <audio
              controls
              src={file.file.secure_url}
              className="h-10 m-1"
            ></audio> */}
            <AudioPlayer
              audioFileURL={file.file.secure_url}
              senderIsMe={senderIsMe}
            />
          </div>
          {/*Download */}
          <div className="flex items-center">
            <a
              // href={file.file.secure_url}
              href={`${file.file.secure_url.replace(
                "/upload/",
                "/upload/fl_attachment/"
              )}`}
              target="_blank"
              download
              rel="noreferrer"
            >
              <DownloadIcon />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
