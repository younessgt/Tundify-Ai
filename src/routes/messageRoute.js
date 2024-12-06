const express = require("express");
const trimRequest = require("trim-request");
const authMiddleware = require("../middlewares/authMiddleware");
const messageController = require("../controllers/messageController");

const router = express.Router();

router.use(trimRequest.all);
router.use(authMiddleware.protect);

router.route("/").post(messageController.sendMessage);
router.route("/:conversation_id").get(messageController.getMessages);

module.exports = router;
