const dotenv = require("dotenv");
const logger = require("./configs/logger");

// handling uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Load environment variables from the .env file
dotenv.config({ path: "./config.env" });
const app = require("./app");

const PORT = process.env.PORT || 8000;

// console.log(process.env.NODE_ENV);

// Start the server on the specified port
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// handling unhandled promise rejections

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection: ", err.message);
  server.close(() => {
    process.exit(1);
  });
});

// handling SIGTERM signal
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully.");
  server.close(() => {
    process.exit(0);
  });
});
