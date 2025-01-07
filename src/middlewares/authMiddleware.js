const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const tokenValidation = require("../services/tokenValidation");
const User = require("../models/userModel");
const jwtHelper = require("../utils/jwtHelper");

const handleExpiredAccessToken = async (userId, req, resp, next) => {
  try {
    // Fetch user from the database
    const user = await User.findById(userId);

    if (!user) return next(new AppError("The user no longer exists.", 401));

    // Create a new access token
    const newAccessToken = await jwtHelper.createSendAccessToken(user, resp);

    // Attach user and new access token to the request
    req.user = { ...user.toObject(), accessToken: newAccessToken };

    return next();
  } catch (error) {
    return next(
      new AppError("Failed to refresh access token. Log in again!", 401)
    );
  }
};

exports.protect = catchAsync(async (req, resp, next) => {
  let accessToken;
  // const accessToken = req.cookies.access_token_form_Cb;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
  }
  if (req.cookies.access_token) {
    accessToken = req.cookies.access_token;
  }

  // Check if token is available
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

// exports.protectWithRenewAccessToken = catchAsync(async (req, resp, next) => {
//   const { refresh_jwt } = req.cookies;
//   let accessToken;

//   console.log("refresh_jwt", refresh_jwt);

//   // Check if token is available
//   if (!refresh_jwt) {
//     return next(
//       new AppError("You are not logged in! Please log in to get access", 401)
//     );
//   }

//   const decodedRefresh = await tokenValidation(
//     refresh_jwt,
//     process.env.REFRESH_JWT_SECRET
//   );

//   if (!decodedRefresh) {
//     return next(new AppError("Invalid token. Please log in again!", 401));
//   }

//   // Check if access_Token is available
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     accessToken = req.headers.authorization.split(" ")[1];
//   }

//   if (!accessToken) {
//     return next(
//       new AppError("You are not logged in! Please log in to get access.", 401)
//     );
//   }

//   // Verify token
//   try {
//     let user;
//     const decoded = await tokenValidation(accessToken, process.env.JWT_SECRET);
//     req.user = {
//       _id: decoded.id,
//     };
//     // req.user = decoded;
//     return next();
//   } catch (error) {
//     if (error.name === "TokenExpiredError") {
//       return handleExpiredAccessToken(decodedRefresh.id, req, resp, next);
//     }
//     return next(new AppError("Invalid token. Please log in again!", 401));
//   }
// });

exports.protectWithRenewAccessToken = catchAsync(async (req, resp, next) => {
  let accessToken;

  // Check if access_Token is available
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
  }

  if (!accessToken) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  try {
    const decoded = await tokenValidation(accessToken, process.env.JWT_SECRET);
    req.user = {
      _id: decoded.id,
    };
    // req.user = decoded;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const { refresh_jwt } = req.cookies;

      // Check if token is available
      if (!refresh_jwt) {
        return next(
          new AppError("You Session has expired! Please log in again", 401)
        );
      }

      const decodedRefresh = await tokenValidation(
        refresh_jwt,
        process.env.REFRESH_JWT_SECRET
      );

      if (!decodedRefresh) {
        return next(new AppError("Invalid token. Please log in again!", 401));
      }

      // renew access
      return handleExpiredAccessToken(decodedRefresh.id, req, resp, next);
    }
    return next(new AppError("Invalid token. Please log in again!", 401));
  }
});
