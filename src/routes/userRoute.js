const express = require("express");
const authController = require("../controllers/authController");
const trimRequest = require("trim-request");

const router = express.Router();

// Trim Request Middleware - A middleware to trim request query, params and body
router.use(trimRequest.all);

router.route("/register").post(authController.register);

module.exports = router;
