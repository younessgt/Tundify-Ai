const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    message: {
      type: String,
      trim: true,
    },

    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    files: [],
  },
  {
    collection: "messages",
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
