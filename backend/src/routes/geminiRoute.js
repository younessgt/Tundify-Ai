const express = require("express");
const trimRequest = require("trim-request");
const authMiddleware = require("../middlewares/authMiddleware");
const geminiController = require("../controllers/geminiController");

const router = express.Router();
router.use(trimRequest.all);

router
  .route("/translate")
  .post(
    authMiddleware.protectWithRenewAccessToken,
    geminiController.geminiTranslate
  );
module.exports = router;
