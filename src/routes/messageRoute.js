const express = require("express");
const trimRequest = require("trim-request");
const authMiddleware = require("../middlewares/authMiddleware");
const messageController = require("../controllers/messageController");

const router = express.Router();

router.use(trimRequest.all);
// router.use(authMiddleware.protect);

router
  .route("/")
  .post(
    authMiddleware.protectWithRenewAccessToken,
    messageController.send_Message
  );
router
  .route("/:conversation_id")
  .get(
    authMiddleware.protectWithRenewAccessToken,
    messageController.get_Messages
  );

module.exports = router;
