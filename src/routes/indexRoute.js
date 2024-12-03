const express = require("express");
const userRoute = require("./userRoute");
const conversationRoute = require("./conversationRoute");
const messageRoute = require("./messageRoute");

const router = express.Router();

router.use("/auth", userRoute);
router.use("/conversation", conversationRoute);
router.use("/message", messageRoute);

module.exports = router;
