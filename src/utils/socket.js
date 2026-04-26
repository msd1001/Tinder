const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  // Initialize the socket

  const io = socket(server, {
    // cors configuration
    cors: {
      origin: "http://localhost:5173",
    },
  });

  // if client send connection request to server for that we r doing code io.on

  io.on("connection", (socket) => {
    // Handle events

    // joinchat is an event, sendMessage is an event, joinchat is an event we r going to receive from frontend
    // userId, targetUserId are coming from fE from where this event is getting emitted.
    socket.on("joinchat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      // We need to create a room for the  chat between at least two user with unique id ...chat b/w madhuresh and harsh;
      socket.join(roomId);
      console.log(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        // Whatever message we are receiving, we are transmitting it to same room id, // suppose madhuresh send message to harsh then
        // then it should goes to Harsh
        // go to room-id and emit the message
        // const roomId = [userId, targetUserId].sort().join("_");
        const roomId = getSecretRoomId(userId, targetUserId);
        // go to room-id and emit the message
        console.log(firstName + " " + text);

        // Save message to database when someone sending message to server
        try {
          // There will be two case :
          //  Either there will be Already existing chat or a new fresh chat b/w participants
          //  If there is existing chat then we need to concenate  old messages

          // we also must find out that userId and targetUserId should be friend, these part code is not written.
          let chat = await Chat.findOne({
            // find chat where  all the people in array should be participants here
            participants: { $all: [userId, targetUserId] },
          });
          // if chat does not exist on database then, create new chat

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          // we are pushing schema of messageSchema

          chat.message.push({
            senderId: userId,
            text,
          });

          await chat.save();
        } catch (err) {
          console.log(err);
        }

        //Whatever message we are receiving, we are transmitting it to same room id so that
        // Now from here we are emitting the message Received event then we need to listen this on frontend and show it on frontend
        io.to(roomId).emit("message Received", { firstName, lastName, text });
      },
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
