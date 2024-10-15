const AppError = require("../utils/appError");

// send error in development
const sendErrorDev = (err, req, resp) => {
  resp.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
  });
};

// send error in production
const sendErrorProd = (err, req, resp) => {
  if (err.isOperational) {
    resp.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR 💥", err);

    resp.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

// handle JWT error
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

// handle JWT expired error
const handleJWTExpireError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  // console.log(err.errmsg);
  return new AppError(message, 400);
};
// error handler middleware
module.exports = (err, req, resp, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, resp);
  } else {
    let error = {};
    console.log(err);
    Object.defineProperties(error, Object.getOwnPropertyDescriptors(err));

    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpireError();
    if (err.code === 11000) {
      error = handleDuplicateFieldsDB(err);
    }
    sendErrorProd(error, req, resp);
  }
};
