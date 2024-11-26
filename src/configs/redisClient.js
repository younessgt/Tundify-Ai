const Redis = require("ioredis");

// Create a Redis instance
const redisClient = new Redis({
  host: "127.0.0.1", // Redis server host
  port: 6379, // Redis server port
  password: process.env.REDIS_PASSWORD || null, // Optional password
});

// Handle connection errors
redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Log successful connection
redisClient.on("connect", () => {
  console.log("Connected to Redis!");
});

module.exports = redisClient;
