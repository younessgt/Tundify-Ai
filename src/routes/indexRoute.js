const express = require("express");
const userRoute = require("./userRoute");
const conversationRoute = require("./conversationRoute");

const router = express.Router();

router.use("/auth", userRoute);
router.use("/conversation", conversationRoute);

module.exports = router;
