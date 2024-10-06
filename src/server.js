const dotenv = require("dotenv");
const logger = require("./configs/logger");
const mongoose = require("mongoose");

// handling uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Load environment variables from the .env file
dotenv.config({ path: "./config.env" });
const app = require("./app");

// Connect to the Atlas MongoDB database
mongoose
  .connect(
    process.env.DATABASE_ATLAS.replace(
      "<password>",
      process.env.DATABASE_PASSWORD
    )
  )
  .then(() => {
    logger.info("Connected to the Atlas MongoDB database");
  })
  .catch((err) => {
    logger.error(
      `Error connecting to the Atlas MongoDB database: ${err.message}`
    );
    process.exit(1);
  });

// activate mongoose debugging mode on development environment
if (process.env.NODE_ENV === "development") {
  mongoose.set("debug", true);
}

// Start the server on the specified port
const PORT = process.env.PORT || 8000;
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
