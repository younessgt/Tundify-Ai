const authController = require("../controllers/authController");
const jwt = require("jsonwebtoken");

const FRONTEND_URL = process.env.FRONTEND_URL;

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

const handleGoogleAuthCallback = async (req, resp) => {
  try {
    const user = await authController.findOrCreateUser_goolgeAuth(req, resp);

    resp.cookie("access_token", user.accessToken, {
      maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      // sameSite: "lax",
    });

    resp.redirect(`${FRONTEND_URL}/google-callback`);
  } catch (error) {
    console.log(error);
    resp.redirect(`${FRONTEND_URL}/login`);
  }
};

module.exports = handleGoogleAuthCallback;
