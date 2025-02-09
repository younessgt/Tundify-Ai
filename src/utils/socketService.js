const redisClient = require("../configs/redisClient");

const ONLINE_USERS_KEY = process.env.ONLINE_USERS_KEY;

exports.socketService = (socket, io) => {
  socket.on("user-join-app", (userId) => {
    if (!userId) {
      console.error("User ID is required for socket connection");
      socket.disconnect();
      return;
    }

    socket.userId = userId;

    socket.join(userId);

    (async () => {
      try {
        // Add the new user to Redis
        await redisClient.hset(ONLINE_USERS_KEY, userId, socket.id);

        io.emit("user-online", { userId });
      } catch (err) {
        console.error("Error adding user to Redis:", err);
      }
    })();
  });

  socket.on("user-join-conversation", (conversationId) => {
    socket.join(conversationId);
    console.log("user join conversation  backend", conversationId);
  });

  socket.on("user-send-message", (message) => {
    const users = message.conversation.users;

    if (!users) return;

    users.forEach((user) => {
      if (user._id === message.sender._id) return;
      console.log("user", user._id);
      socket.in(user._id).emit("recieve-message", message);
    });
    console.log("message", message);
  });

  // Handle disconnection
  socket.on("disconnect", async () => {
    const userId = socket.userId;
    if (!userId) {
      console.log("No userId associated with the disconnected socket");
      return;
    }
    try {
      console.log(`User ${userId} disconnected`);

      // Remove the user from Redis
      const isDeleted = await redisClient.hdel(ONLINE_USERS_KEY, userId);

      if (isDeleted) {
        // emit to client
        io.emit("user-offline", { userId });
      }
    } catch (err) {
      console.error("Error removing user from Redis:", err);
    }
  });

  // handle user status
  socket.on("check-recipient-status", async (recipientId) => {
    try {
      const socketId = await redisClient.hget(ONLINE_USERS_KEY, recipientId);
      if (socketId) {
        socket.emit("recipient-status", { recipientId, isOnline: true });
      } else {
        socket.emit("recipient-status", { recipientId, isOnline: false });
      }
    } catch (err) {
      console.error("Error checking recipient status:", err);
    }
  });

  // handle user typing
  socket.on("user-typing", (conversationId) => {
    console.log(`User is typing in conversation: ${conversationId}`);

    // Emit a "typing" event to all other sockets in the same room
    // - `socket.in(conversationId)` ensures the event is sent to all clients
    //   in the specified room (conversationId), except for the sender's socket.
    // - This means only other participants in the conversation receive the event.
    socket.in(conversationId).emit("typing", conversationId);
  });

  socket.on("user-stop-typing", (conversationId) => {
    console.log("user-stop-typing");

    socket.in(conversationId).emit("stop-typing", conversationId);
  });
};
