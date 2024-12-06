const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { updateLatestMessage } = require("../services/conversation");
const {
  createMessage,
  populateMessage,
  getMessages,
} = require("../services/message");

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

exports.getMessages = catchAsync(async (req, resp, next) => {
  const { conversation_id } = req.params;
  console.log(conversation_id);
  if (!conversation_id) {
    return next(new AppError("Please Provide a conversation Id"));
  }

  const messages = await getMessages(conversation_id);

  resp.status(200).json({
    status: "success",
    messages,
  });
});
