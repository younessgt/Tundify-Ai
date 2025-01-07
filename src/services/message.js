const AppError = require("../utils/appError");
const Message = require("../models/messageModel");

exports.createMessage = async (data) => {
  if (!data || Object.keys(data).length === 0) {
    throw new AppError("data is required", 400);
  }

  const newMessage = await Message.create(data);

  if (!newMessage) {
    throw new AppError("Problem when creating a message", 400);
  }

  return newMessage;
};

exports.populateMessage = async (messageId) => {
  const populatedMessage = await Message.findById(messageId)
    .populate({
      path: "sender",
      select: "name picture",
      model: "User",
    })
    .populate({
      path: "conversation",
      select: "name picture isGroup users",
      model: "Conversation",
      populate: {
        path: "users",
        select: "name email picture status",
        model: "User",
      },
    });

  if (!populatedMessage) {
    throw new AppError("Message Not find", 400);
  }

  return populatedMessage;
};

exports.getMessages = async (conversation_id) => {
  if (!conversation_id) {
    throw new AppError("Please provide a conversation Id", 400);
  }

  const messages = await Message.find({
    conversation: conversation_id,
  })
    .populate("sender", "name picture email status")
    .populate("conversation");

  if (!messages) {
    throw new AppError("No Messages Found", 400);
  }

  return messages;
};
