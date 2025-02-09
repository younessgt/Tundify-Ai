import { useState } from "react";

export default function FileImageVideo({ file, type, onMediaLoad }) {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const thumbnailUrl = `${file?.file?.secure_url}?f=auto&q=80`;
  const handlePreviewClose = () => {
    setIsPreviewVisible(false);
  };
  // return (
  //   <div className="flex flex-col">
  //     {type === "IMAGE" ? (
  //       <>
  //         <img
  //           src={file?.file?.secure_url}
  //           alt=""
  //           className="rounded-md border-2 dark:bg-dark_text_1 "
  //           onLoad={onMediaLoad}
  //         />
  //         <p className="dark:text-dark_text_1 pb-[2px] whitespace-normal break-words pt-3">
  //           {file?.message}
  //         </p>
  //       </>
  //     ) : (
  //       <video
  //         src={file?.file?.secure_url}
  //         controls
  //         onLoadedMetadata={onMediaLoad}
  //         className="rounded-md border"
  //       ></video>
  //     )}
  //   </div>
  // );

  return (
    <>
      <div
        className="flex flex-col cursor-pointer w-full h-full"
        onClick={() => setIsPreviewVisible(true)}
      >
        {type === "IMAGE" ? (
          <>
            <img
              src={thumbnailUrl}
              alt=""
              // className="rounded-md  dark:bg-dark_text_1"
              className="rounded-md dark:bg-dark_text_1  "
              onLoad={onMediaLoad}
              // onLoad={() => {
              //   setIsLoaded(true); // Remove blur once the image is loaded
              //   onMediaLoad?.();
              // }}
              loading="lazy"
            />

            <p className="dark:text-dark_text_1 pb-[2px] whitespace-normal break-words pt-3">
              {file?.message}
            </p>
          </>
        ) : (
          <video
            src={file?.file?.secure_url}
            controls
            onLoadedMetadata={onMediaLoad}
            // onLoadedMetadata={() => {
            //   setIsLoaded(true); // Mark video as loaded
            //   onMediaLoad?.();
            // }}
            // className="rounded-md"
            className="rounded-md"
          ></video>
        )}
      </div>

      {isPreviewVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 "
          onClick={handlePreviewClose}
        >
          <button
            className="absolute top-1 right-[6px] text-white  dark:bg-dark_bg_5 rounded-full w-8 h-8 flex items-center justify-center"
            onClick={handlePreviewClose}
          >
            ✕
          </button>
          <div
            className="relative    rounded-md max-w-full max-h-full "
            onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
          >
            {type === "IMAGE" ? (
              <img
                src={file?.file?.secure_url}
                alt="Preview"
                className="max-w-full max-h-[90vh] object-contain rounded-md"
              />
            ) : (
              <video
                src={file?.file?.secure_url}
                controls
                className="max-w-full max-h-[90vh] object-contain rounded-md"
              ></video>
            )}
            {/* <p className="dark:text-dark_text_1 mt-4 whitespace-normal break-words text-center">
              {file?.message}
            </p> */}
          </div>
        </div>
      )}
    </>
  );
}
