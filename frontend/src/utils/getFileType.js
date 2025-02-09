export const getFileType = (mimeType) => {
  switch (mimeType) {
    case "text/plain":
    case "text/html":
    case "text/css":
      return "TXT";
    case "application/pdf":
      return "PDF";
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "DOCX";
    case "application/vnd.ms-powerpoint":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return "PPTX";
    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "XLSX ";
    case "application/vnd.rar":
      return "RAR";
    case "application/zip":
    case "application/x-zip-compressed":
    case "application/x-7z-compressed":
      return "ZIP";
    case "audio/mpeg":
    case "audio/3gpp":
    case "audio/wav":
      return "AUDIO";
    case "video/mp4":
    case "video/mpeg":
    case "video/webm":
    case "video/x-msvideo":
      return "VIDEO";
    default:
      return "IMAGE";
  }
};

export const getMessageTitle = (file) => {
  switch (file.type) {
    case "TXT":
      return `${file.file.original_filename}.${
        file.file.public_id.split(".")[1]
      }`;
    case "PDF":
      return `${file.file.original_filename}.${
        file.file.public_id.split(".")[1]
      }`;
    case "DOCX":
      return `${file.file.original_filename}.${
        file.file.public_id.split(".")[1]
      }`;
    case "PPTX":
      return `${file.file.original_filename}.${
        file.file.public_id.split(".")[1]
      }`;
    case "XLSX":
      return `${file.file.original_filename}.${
        file.file.public_id.split(".")[1]
      }`;
    case "RAR":
      return `${file.file.original_filename}.${
        file.file.public_id.split(".")[1]
      }`;
    case "ZIP":
      return `${file.file.original_filename}.${
        file.file.public_id.split(".")[1]
      }`;
    case "AUDIO":
      return "Audio";
    case "VIDEO":
      return "Video";
    case "IMAGE":
      return "Photo";

    default:
      return "Unknown";
  }
};
