const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { updateLatestMessage } = require("../services/conversation");
const { createMessage, populateMessage } = require("../services/message");

exports.sendMessage = catchAsync(async (req, resp, next) => {
  const senderId = req.user._id;
  const { conversationId, message, files } = req.body;

  if (!conversationId || (!message && !files)) {
    return next(
      new AppError("conversationId , message or files are missing", 400)
    );
  }

  const messageData = {
    sender: senderId,
    message: message || null,
    files: files || [],
    conversation: conversationId,
  };

  const newMessage = await createMessage(messageData);
  const populatedMessage = await populateMessage(newMessage._id);
  // update latestMessage in the conversation
  await updateLatestMessage(conversationId, newMessage);
  resp.status(200).json({
    status: "success",
    message: populatedMessage,
  });
});
