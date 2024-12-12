const express = require("express");
const trimRequest = require("trim-request");
const authMiddleware = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

const router = express.Router();

router.use(trimRequest.all);

router.route("/").get(authMiddleware.protect, userController.searchUser);

module.exports = router;
