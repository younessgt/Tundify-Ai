import { addFiles } from "@/features/chatSlice";
import { getFileType } from "@/utils/getFileType";

export const addFileToState = (e, activeConversation, dispatch) => {
  let files = Array.from(e.target.files);
  let atLeastOneFileAdded = false;
  files.forEach((file) => {
    if (
      file.type !== "application/pdf" &&
      file.type !== "text/css" &&
      file.type !== "application/msword" &&
      file.type !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      file.type !== "text/html" &&
      file.type !== "application/vnd.ms-powerpoint" &&
      file.type !==
        "application/vnd.openxmlformats-officedocument.presentationml.presentation" &&
      file.type !== "application/vnd.rar" &&
      file.type !== "text/plain" &&
      file.type !== "audio/wav" &&
      file.type !== "application/vnd.ms-excel" &&
      file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      file.type !== "application/zip" &&
      file.type !== "application/x-zip-compressed" &&
      file.type !== "audio/3gpp" &&
      file.type !== "application/x-7z-compressed" &&
      file.type !== "audio/mpeg" &&
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
    } else if (file.size > 1024 * 1024 * 10) {
      files = files.filter((elem) => elem.name !== file.name);
      return;
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        dispatch(
          addFiles({
            file,
            fileBase64:
              getFileType(file.type) === "IMAGE" ||
              getFileType(file.type) === "VIDEO"
                ? e.target.result
                : "",
            type: getFileType(file.type),
            fileConvoId: activeConversation._id,
            id: crypto.randomUUID(),
          })
        );
      };
      atLeastOneFileAdded = true;
    }
  });
  return atLeastOneFileAdded;
};
