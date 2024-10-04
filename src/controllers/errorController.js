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

// error handler middleware
module.exports = (err, req, resp, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, resp);
  }

  let error;

  Object.defineProperties(error, Object.getOwnPropertyDescriptors(err));

  sendErrorProd(error, req, resp);
};
