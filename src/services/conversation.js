const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.checkIfConversationExist = async (senderId, recieverId, isGroup) => {
  if (isGroup === false) {
    let conversations = await Conversation.find({
      isGroup: false,
      $and: [
        {
          users: { $elemMatch: { $eq: senderId } },
        },
        {
          users: { $elemMatch: { $eq: recieverId } },
        },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (!conversations) {
      throw new AppError("No conversation found", 400);
    }

    // populate latestMessage.sender also

    conversations = await User.populate(conversations, {
      path: "latestMessage.sender",
      select: "name email picture status",
    });

    return conversations[0];
  } else {
    console.log("neeeded");
    return null;
  }
};

exports.createConversation = async (data) => {
  const newConversation = await Conversation.create(data);

  if (!newConversation) {
    throw new AppError("Error when creating new conversation", 400);
  }

  return newConversation;
};

exports.populateConversation = async (id, fieldToPopulate, fieldToRemove) => {
  const populatedConversation = await Conversation.findOne({
    _id: id,
  }).populate(fieldToPopulate, fieldToRemove);

  if (!populatedConversation) {
    throw new AppError("Error on populated Conversation");
  }
  return populatedConversation;
};

exports.getUserConversations = async (userId) => {
  if (!userId) {
    throw new Error("Please provide a userId");
  }

  let conversations = await Conversation.find({
    users: { $elemMatch: { $eq: userId } },
  })
    .populate("users", "-password")
    .populate("admin")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  if (!conversations) {
    throw new AppError("No conversation found", 400);
  }

  conversations = await User.populate(conversations, {
    path: "latestMessage.sender",
    select: "name email picture status",
  });

  return conversations;
};
