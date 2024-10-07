const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const logger = require("../configs/logger");

module.exports = async (token, secret) => {
  const jwtVerify = promisify(jwt.verify);

  const decoded = await jwtVerify(token, secret);

  return decoded;
};
