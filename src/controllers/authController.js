const jwt = require("jsonwebtoken");
const validate = require("validator");
const User = require("../models/userModel");
const userRegisterValidation = require("../services/userRegisterValidation");
const catchAsync = require("../utils/catchAsync");
const logger = require("../configs/logger");
const AppError = require("../utils/appError");
const tokenValidation = require("../services/tokenValidation");
const crypto = require("crypto");
const redisClient = require("../configs/redisClient");
const Email = require("../services/email");
const path = require("path");

const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;
const FRONTEND_URL = process.env.FRONTEND_URL;

const generatePass = () => {
  let password = "";
  let str =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

  for (let i = 1; i <= 10; i++) {
    let char = Math.floor(Math.random() * str.length + 1);

    password += str.charAt(char);
  }

  return password;
};

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

const createSendAccessToken = async (user, resp) => {
  try {
    const token = await signToken(
      user._id,
      process.env.JWT_SECRET,
      process.env.JWT_EXPIRES_IN
    );

    // const cookieOptions = {
    //   maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 60 * 1000,
    //   httpOnly: true,
    //   path: "/api/v1/auth/refreshToken",
    // };

    // if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    // // Send token via cookie
    // resp.cookie("jwt", token, cookieOptions);

    return token;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

const createSendRefreshToken = async (user, resp) => {
  try {
    const token = await signToken(
      user._id,
      process.env.REFRESH_JWT_SECRET,
      process.env.REFRESH_JWT_EXPIRES_IN
    );
    const cookieOptions = {
      // maxAge: process.env.REFRESH_JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
      maxAge: process.env.REFRESH_JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,

      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      // sameSite: "lax",
    };

    // Send token via cookie
    resp.cookie("refresh_jwt", token, cookieOptions);

    // Remove password from output
    // user.password = undefined;

    return token;
  } catch (error) {
    logger.error(error);
    return null;
  }
  //   resp.status(statusCode).json({
  //     status: "success",
  //     token,
  //     data: {
  //       user,
  //     },
  //   });
};

const createPasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  console.log("resetToken", resetToken);
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  return { resetTokenHash, resetToken };
};

exports.validateRegister = catchAsync(async (req, resp, next) => {
  const { name, email, password, confirmPassword, status, picture } = req.body;

  // Validate user input
  await userRegisterValidation({
    name,
    email,
    password,
    confirmPassword,
    status,
    picture,
  });

  resp.status(200).json({
    status: "success",
    message: "User input is valid",
  });
});

exports.register = catchAsync(async (req, resp) => {
  const { name, email, password, confirmPassword, status, picture } = req.body;

  // Validate user input
  const inputData = await userRegisterValidation({
    name,
    email,
    password,
    confirmPassword,
    status,
    picture,
  });

  let newUser;
  if (inputData) {
    newUser = await User.create({
      name,
      email,
      password,
      confirmPassword,
      status: status || DEFAULT_STATUS,
      picture: picture || DEFAULT_PICTURE,
    });
  }

  const accessToken = await createSendAccessToken(newUser, resp);
  const refreshToken = await createSendRefreshToken(newUser, resp);

  if (!accessToken || !refreshToken) {
    next(new AppError("Something went very wrong!", 500));
  }

  resp.status(201).json({
    status: "success",
    message: "User registered successfully",
    // token: accessToken,
    user: {
      accessToken,
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      status: newUser.status,
      picture: newUser.picture,
    },
  });
});

exports.login = catchAsync(async (req, resp, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  if (!validate.isEmail(email)) {
    return next(new AppError("Invalid email address", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const accessToken = await createSendAccessToken(user, resp);
  const refreshToken = await createSendRefreshToken(user, resp);

  if (!accessToken || !refreshToken) {
    next(new AppError("Something went very wrong!", 500));
  }

  resp.status(200).json({
    status: "success",
    message: "login successfully",
    // token: accessToken,
    user: {
      accessToken,
      _id: user._id,
      name: user.name,
      email: user.email,
      status: user.status,
      picture: user.picture,
    },
  });
});

exports.logout = (req, resp) => {
  resp.clearCookie("refresh_jwt", { path: "/" });
  resp.clearCookie("access_token", { path: "/" });
  // resp.clearCookie("access_token_form_Cb", { path: "/" });
  // resp.clearCookie("jwt", { path: "/api/v1/auth/refreshToken" });

  resp.status(200).json({
    status: "success",
    message: "logout successfully",
  });
};

exports.refreshToken = catchAsync(async (req, resp, next) => {
  const { refresh_jwt } = req.cookies;

  // Check if token is available
  if (!refresh_jwt) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  const decoded = await tokenValidation(
    refresh_jwt,
    process.env.REFRESH_JWT_SECRET
  );

  if (!decoded) {
    return next(new AppError("Invalid token. Please log in again!", 401));
  }

  // Check if user still exists
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(
      new AppError("The user belonging to this token does no longer exist", 401)
    );
  }

  // Create new access token
  const accessToken = await createSendAccessToken(user, resp);
  console.log("new accessToken created");
  if (!accessToken) {
    next(new AppError("Something went wrong!", 500));
  }

  resp.status(200).json({
    status: "success",
    message: "Token generated successfully",
    user: { ...user, accessToken },
    // token: accessToken,
  });
});

exports.validateRefreshToken = catchAsync(async (req, resp, next) => {
  const { refresh_jwt } = req.body;

  // console.log("refresh_jwt", refresh_jwt);
  // Check if token is available
  if (!refresh_jwt) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  const decoded = await tokenValidation(
    refresh_jwt,
    process.env.REFRESH_JWT_SECRET
  );

  if (!decoded) {
    return next(new AppError("Invalid token. Please log in again!", 401));
  }

  // Check if user still exists
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(
      new AppError("The user belonging to this token does no longer exist", 401)
    );
  }

  resp.status(200).json({
    status: "success",
    message: "Token is valid",
  });
});

exports.validateAccessToken = catchAsync(async (req, resp, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    resp.status(401).json({
      status: "fail",
      valid: false,
      expired: false,
      message: "Token is not available",
    });
  }

  try {
    const decoded = await tokenValidation(token, process.env.JWT_SECRET);
    resp.status(200).json({
      status: "success",
      valid: true,
      expired: false,
      message: "Token is valid",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return resp
        .status(200)
        .json({ valid: false, expired: true, message: "Token has expired" });
    }
    return resp
      .status(401)
      .json({ valid: false, expired: false, message: "Token is invalid" });
  }
});

exports.findOrCreateUser_goolgeAuth = async (req, resp) => {
  let user;
  const profile = req.user;
  const { email, name, picture } = profile._json;

  user = await User.findOne({ email });

  if (!user) {
    const status = "";
    const password = generatePass();
    const confirmPassword = password;

    user = await User.create({
      name,
      email,
      password,
      confirmPassword,
      status: status || DEFAULT_STATUS,
      picture: picture || DEFAULT_PICTURE,
    });
  }

  const accessToken = await createSendAccessToken(user, resp);
  const refreshToken = await createSendRefreshToken(user, resp);

  if (!accessToken || !refreshToken) {
    throw new Error("Something went very wrong!");
  }

  return {
    accessToken,
    _id: user._id,
    name: user.name,
    email: user.email,
    status: user.status,
    picture: user.picture,
  };
};

exports.forgotPassword = catchAsync(async (req, resp, next) => {
  const { email } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("No user found with this email address", 404));
  }

  console.log("user", user._id);
  const userIdKey = `resetToken:${user._id.toString()}`;

  // Check if there is already a reset token in the database
  const existingToken = await redisClient.get(userIdKey);
  console.log("existingToken", existingToken);

  if (existingToken) {
    return next(
      new AppError(
        "Email already sent, please check your email or you can retry in 6 minute.",
        429
      )
    );
  }

  // Generate the random reset token
  const { resetTokenHash, resetToken } = createPasswordResetToken();
  // console.log("resetTokenHash", resetTokenHash);
  const tokenKey = `resetToken:${resetTokenHash}`;

  // Save the reset token and expiry time in the database
  await redisClient.setex(userIdKey, 360, resetTokenHash);
  await redisClient.setex(tokenKey, 360, user._id.toString());

  const resetPasswordLink = `http://localhost:8000/api/v1/auth/validate-reset-token?token=${resetToken}`;

  // Send the reset token to the user's email
  await new Email(user, resetPasswordLink).sendPasswordReset();

  resp.status(200).json({
    status: "success",
    message: "Password reset token sent to email",
  });
});

exports.validateResetToken = catchAsync(async (req, resp, next) => {
  const { token } = req.query;

  if (!token) {
    // return next(new AppError("Token is invalid", 400));
    resp.redirect(`${FRONTEND_URL}/invalid-expired-url`);
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const userId = await redisClient.get(`resetToken:${tokenHash}`);

  if (!userId) {
    // return next(new AppError("Invalid or expired token", 400));
    resp.redirect(`${FRONTEND_URL}/invalid-expired-url`);
  }

  const newToken = await signToken(
    userId,
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN
  );

  resp.cookie("access_token", newToken, {
    maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  resp.redirect(`${FRONTEND_URL}/new-password`);
});

// function to reset password
exports.newPassword = catchAsync(async (req, resp, next) => {
  const { email } = req.user;
  const { newPassword, confirmPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  user.password = newPassword;
  user.confirmPassword = confirmPassword;

  await user.save();

  // Delete the reset token from the database
  const userIdKey = `resetToken:${user._id.toString()}`;
  const resetTokenHash = await redisClient.get(userIdKey);

  if (resetTokenHash) {
    const tokenKey = `resetToken:${resetTokenHash}`;
    await redisClient.del(userIdKey);

    await redisClient.del(tokenKey);
  }
  resp.clearCookie("access_token", { path: "/" });

  resp.status(200).json({
    status: "success",
    message: "Password reset successfully",
  });
});
