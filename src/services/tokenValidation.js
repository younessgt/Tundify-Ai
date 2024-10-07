const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const logger = require("../configs/logger");

module.exports = async (refreshToken) => {
  const jwtVerify = promisify(jwt.verify);

  const decoded = await jwtVerify(refreshToken, process.env.REFRESH_JWT_SECRET);

  return decoded;
};
