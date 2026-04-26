const express = require("express");
const { Chat } = require("../models/chat");
const { userAuth } = require("../middlewares/auth");

const chatRouter = express.Router();

// We have created this file so that we can fetch the user chat and show in the UI
chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;
  //
  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "message.senderId",
      select: "firstName lastName",
    });
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.log(err);
  }
});

module.exports = chatRouter;

// Router must be included in the App file
