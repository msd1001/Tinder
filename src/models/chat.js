// We are creating schema to save chat
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    //Each chat have senderid,text
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const chatSchema = new mongoose.Schema({
  // For every set of participant there will be a unique chat
  // participant will be of objectId type
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  message: [messageSchema],
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = { Chat };
