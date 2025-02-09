const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Conversation = require("../models/conversationModel");
const mongoose = require("mongoose");
const {
  checkIfConversationExist,
  createConversation,
  populateConversation,
  getUserConversations,
} = require("../services/conversation");
const { findUserById } = require("../services/userActions");

exports.createOrOpenConversation = catchAsync(async (req, resp, next) => {
  const senderId = req.user._id;
  const { recieverId, isGroup } = req.body;

  if (!recieverId) {
    return next(new AppError("Please Provide a reciever Id", 401));
  }

  if (
    !mongoose.isValidObjectId(senderId) ||
    !mongoose.isValidObjectId(recieverId)
  ) {
    return next(new AppError("Invalid sender or receiver ID", 400));
  }

  //   const sender = await findUserById(senderId);
  const reciever = await findUserById(recieverId);

  if (isGroup === false) {
    // check if the conversation already exist

    const existingConversation = await checkIfConversationExist(
      senderId,
      recieverId,
      isGroup
    );

    // if it exist send it back

    if (existingConversation) {
      return resp.status(200).json({
        status: "success",
        conversation: existingConversation,
      });
    }
    // if not create new one
    const conversationData = {
      name: `${senderId}+${recieverId}`,
      //   users: [senderId, new mongoose.Types.ObjectId(recieverId)],
      picture: "picture",
      users: [senderId, recieverId],
      isGroup: false,
    };

    const newConversation = await createConversation(conversationData);
    const populatedConversation = await populateConversation(
      newConversation._id,
      "users",
      "-password"
    );

    resp.status(200).json({
      status: "success",
      conversation: populatedConversation,
    });
  } else {
    console.log("this is for group part");
  }
});

exports.getConversations = catchAsync(async (req, resp, next) => {
  const userId = req.user._id;

  const conversations = await getUserConversations(userId);

  resp.status(200).json({
    status: "success",
    count: conversations.length,
    allConversations: conversations,
  });
});
