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
