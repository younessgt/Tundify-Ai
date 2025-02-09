const express = require("express");
const authRoute = require("./authRoute");
const conversationRoute = require("./conversationRoute");
const messageRoute = require("./messageRoute");
const userRoute = require("./userRoute");
const geminiRoute = require("./geminiRoute");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/conversation", conversationRoute);
router.use("/message", messageRoute);
router.use("/gemini", geminiRoute);

module.exports = router;
