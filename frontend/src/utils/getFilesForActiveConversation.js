export const getFilesForActiveConversation = (files, activeConversation) => {
  return files.filter((file) => file.fileConvoId === activeConversation._id);
};
