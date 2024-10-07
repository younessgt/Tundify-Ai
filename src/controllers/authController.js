const jwt = require("jsonwebtoken");
const validate = require("validator");
const User = require("../models/userModel");
const userRegisterValidation = require("../services/userRegisterValidation");
const catchAsync = require("../utils/catchAsync");
const logger = require("../configs/logger");
const AppError = require("../utils/appError");
const tokenValidation = require("../services/tokenValidation");
const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;

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

    const cookieOptions = {
      maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 60 * 1000,
      httpOnly: true,
      path: "/api/v1/auth/refreshToken",
    };

    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    // Send token via cookie
    resp.cookie("jwt", token, cookieOptions);

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
      maxAge: process.env.REFRESH_JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
      httpOnly: true,
      path: "/api/v1/auth/refreshToken",
    };

    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

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
    token: accessToken,
    user: newUser,
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
    token: accessToken,
    user,
  });
});

exports.logout = (req, resp) => {
  resp.clearCookie("refresh_jwt", { path: "/api/v1/auth/refreshToken" });
  resp.clearCookie("jwt", { path: "/api/v1/auth/refreshToken" });

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

  if (!accessToken) {
    next(new AppError("Something went wrong!", 500));
  }

  resp.status(200).json({
    status: "success",
    message: "Token generated successfully",
    token: accessToken,
  });
});
