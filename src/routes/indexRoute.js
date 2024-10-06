const express = require("express");
const userRoute = require("./userRoute");

const router = express.Router();

router.use("/auth", userRoute);

module.exports = router;
