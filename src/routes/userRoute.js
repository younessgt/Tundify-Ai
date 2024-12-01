const express = require("express");
const authController = require("../controllers/authController");
const trimRequest = require("trim-request");
const authMiddleware = require("../middlewares/authMiddleware");
const passport = require("passport");
require("../utils/googleStrategy");
const router = express.Router();
const handleGoogleAuthCallback = require("../services/handleGoogleAuthCallback");

// Trim Request Middleware - A middleware to trim request query, params and body
router.use(trimRequest.all);

router.route("/validate-register").post(authController.validateRegister);
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);
router.route("/refreshToken").post(authController.refreshToken);
router.route("/validateRefreshToken").post(authController.validateRefreshToken);

// Google OAuth routes
router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.route("/google/callback").get(
  passport.authenticate("google", {
    // failureRedirect: "/login",
    session: false,
  }),

  async (req, resp) => {
    await handleGoogleAuthCallback(req, resp);
  }
);

router.route("/validateAccessToken").get(authController.validateAccessToken);
router.route("/me").get(authMiddleware.protect, (req, resp) => {
  resp.status(200).json({
    status: "success",
    user: req.user,
  });
});

router.route("/forgot-password").post(authController.forgotPassword);
router.route("/validate-reset-token").get(authController.validateResetToken);
router
  .route("/new-password")
  .post(authMiddleware.protect, authController.newPassword);
module.exports = router;
