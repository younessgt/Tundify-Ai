const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "conversation name is required"],
      trim: true,
    },

    isGroup: {
      type: Boolean,
      required: true,
      default: false,
    },

    users: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],

    admin: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    latestMessage: {
      type: mongoose.Schema.ObjectId,
      ref: "Message",
    },
  },
  {
    collection: "conversations",
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
