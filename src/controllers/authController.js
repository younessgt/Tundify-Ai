const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const userRegisterValidation = require("../services/userRegisterValidation");
const catchAsync = require("../utils/catchAsync");
const logger = require("../configs/logger");

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

const createSendToken = async (user, resp) => {
  try {
    const token = await signToken(user._id);
    const cookieOptions = {
      maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
      httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    // Send token via cookie
    resp.cookie("jwt", token, cookieOptions);

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

  const token = await createSendToken(newUser, resp);

  if (!token) {
    next(new AppError("Token not Generated", 404));
  }

  resp.status(201).json({
    status: "success",
    message: "User registered successfully",
    token,
    user: newUser,
  });
});
