const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const logger = require("./configs/logger");
const router = require("./routes/indexRoute");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");

const app = express();

// HTTP request logger middleware for node.js
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Secure Express apps by setting various HTTP headers (helmet)
app.use(helmet());

// Parse JSON bodies (as sent by API clients)
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Compress all responses
app.use(compression());

// File upload middleware
app.use(fileUpload({ useTempFiles: true }));

// Enable CORS
// app.use(cors());

// // this options method is used to handle preflight requests that are sent by the browser
// // to check if the server is ready to accept non simple requests  such as PUT, PATCH, DELETE

// app.options("*", cors());

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
// Pre-flight requests for all routes
app.options("*", cors(corsOptions));

// app.get("/", (req, resp) => {
//   //   logger.info("Hello World!");
//   //   try {
//   //     throw new Error("Something went wrong!");
//   //   } catch (error) {
//   //     logger.error(error); // Log the error
//   //   }
//   resp.status(200).send("Hello World!");
// });

// Routes
app.use("/api/v1", router);

// Catch all other routes which are not defined
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
