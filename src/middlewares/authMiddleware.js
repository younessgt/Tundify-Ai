const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const tokenValidation = require("../services/tokenValidation");
const User = require("../models/userModel");

exports.protect = catchAsync(async (req, resp, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // Check if token is available
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // Verify token
  const decoded = await tokenValidation(token, process.env.JWT_SECRET);

  if (!decoded) {
    return next(new AppError("Invalid token. Please log in again!", 401));
  }

  // Check if user still exists
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // part to add LATER
  // Check if user changed password after the token was issued

  // Grant access to protected route
  req.user = user;
  next();
});
