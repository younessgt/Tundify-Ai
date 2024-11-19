const express = require("express");
const authController = require("../controllers/authController");
const trimRequest = require("trim-request");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Trim Request Middleware - A middleware to trim request query, params and body
router.use(trimRequest.all);

router.route("/validate-register").post(authController.validateRegister);
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);
router.route("/refreshToken").post(authController.refreshToken);
router.route("/validateRefreshToken").post(authController.validateRefreshToken);

router.route("/validateAccessToken").get(authController.validateAccessToken);

module.exports = router;
