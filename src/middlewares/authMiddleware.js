const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const tokenValidation = require("../services/tokenValidation");
const User = require("../models/userModel");

exports.protect = catchAsync(async (req, resp, next) => {
  let accessToken;
  // const accessToken = req.cookies.access_token_form_Cb;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
  }
  if (req.cookies.jwt) {
    accessToken = req.cookies.access_token;
  }

  // Check if token is available
  console.log("accessToken", accessToken);
  if (!accessToken) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // Verify token
  const decoded = await tokenValidation(accessToken, process.env.JWT_SECRET);

  if (!decoded) {
    // resp.clearCookie("jwt");
    return next(new AppError("Invalid token. Please log in again!", 401));
  }

  // Check if user still exists
  let user = await User.findById(decoded.id);

  if (!user) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        404
      )
    );
  }

  user = {
    accessToken,
    ...user._doc,
  };
  // part to add LATER
  // Check if user changed password after the token was issued

  // Grant access to protected route
  req.user = user;
  next();
});
