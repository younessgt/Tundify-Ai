import { DownloadIcon } from "@/components/svg";

export default function FileRest({ file, type, senderIsMe }) {
  return (
    <>
      <div className="flex cursor-pointer w-full h-full p-1">
        {/* {type === "AUDIO" ? (
          <>
            <img
              src={file?.file?.secure_url}
              alt=""
              className="rounded-md border-2 dark:bg-dark_text_1"
            />
            <p className="dark:text-dark_text_1 pb-[2px] whitespace-normal break-words pt-3">
              {file?.message}
            </p>
          </>
        ) : (
          <div>{"File"}</div>
        )} */}
        <div
          className={`flex justify-between gap-2 w-[320px] p-1 rounded-md ${
            senderIsMe ? "dark:bg-dark_bg_8" : "dark:bg-dark_btn_2"
          }`}
        >
          {/*File Infos */}
          <div className="flex items-center gap-2 w-[220px]">
            <img
              src={`/images/${type}.png`}
              alt=""
              className="w-8 object-contain"
            />
            <div className="flex flex-col w-full ">
              <h1 className="whitespace-normal break-words">
                {`${file.file.original_filename}.${type.toLowerCase()}`}
              </h1>
              <span className="text-sm">
                {type} . {file.file.bytes}B
              </span>
            </div>
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
