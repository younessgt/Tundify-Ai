const authController = require("../controllers/authController");
const jwt = require("jsonwebtoken");

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
    const token = await signToken(
      user._id,
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN
    );

    resp.cookie("auth_token", token, {
      maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      // sameSite: "lax",
    });

    resp.cookie("access_token_form_Cb", user.accessToken, {
      maxAge: process.env.REFRESH_JWT_COOKIE_EXPIRES_IN * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    resp.redirect(`http://localhost:3000/google-callback`);
  } catch (error) {
    console.log(error);
    resp.redirect("http://localhost:3000/login");
  }
};

module.exports = handleGoogleAuthCallback;
