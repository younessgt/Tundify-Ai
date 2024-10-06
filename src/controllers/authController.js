const jwt = require("jsonwebtoken");
const validate = require("validator");
const User = require("../models/userModel");
const userRegisterValidation = require("../services/userRegisterValidation");
const catchAsync = require("../utils/catchAsync");
const logger = require("../configs/logger");
const AppError = require("../utils/appError");

const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;

const signToken = (id) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
      (err, token) => {
        if (err) return reject(err);
        resolve(token);
      }
    );
  });
};

const createAccessToken = async (user) => {
  try {
    const token = await signToken(user._id);
    return token;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

const createRefreshToken = async (user, resp) => {
  try {
    const token = await signToken(user._id);
    const cookieOptions = {
      maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
      httpOnly: true,
      path: "/api/v1/auth/refreshToken",
    };

    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    // Send token via cookie
    resp.cookie("refresh_jwt", token, cookieOptions);

    // Remove password from output
    user.password = undefined;

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

  const accessToken = await createAccessToken(newUser, resp);
  const refreshToken = await createRefreshToken(newUser, resp);

  if (!accessToken || !refreshToken) {
    next(new AppError("Token not Generated", 404));
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

  const accessToken = await createAccessToken(user, resp);
  const refreshToken = await createRefreshToken(user, resp);

  if (!accessToken || !refreshToken) {
    next(new AppError("Token not Generated", 404));
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

  resp.status(200).json({
    status: "success",
    message: "logout successfully",
  });
};
