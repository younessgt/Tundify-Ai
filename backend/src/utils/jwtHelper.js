const jwt = require("jsonwebtoken");
const logger = require("../configs/logger");

const signToken = (id, secret, expireTime) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id },
      secret,
      {
        expiresIn: expireTime,
      },
      (err, token) => {
        if (err) return reject(err);
        resolve(token);
      }
    );
  });
};

exports.createSendAccessToken = async (user, resp) => {
  try {
    const token = await signToken(
      user._id,
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN
    );

    return token;
  } catch (error) {
    logger.error(error);
    return null;
  }
};
