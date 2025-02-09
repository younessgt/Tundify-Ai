const express = require("express");
const trimRequest = require("trim-request");
const authMiddleware = require("../middlewares/authMiddleware");
const conversationController = require("../controllers/conversationController");

const router = express.Router();

router.use(trimRequest.all);
// router.use(authMiddleware.protect);

router
  .route("/")
  .post(
    authMiddleware.protectWithRenewAccessToken,
    conversationController.createOrOpenConversation
  );
router
  .route("/")
  .get(authMiddleware.protect, conversationController.getConversations);

module.exports = router;
