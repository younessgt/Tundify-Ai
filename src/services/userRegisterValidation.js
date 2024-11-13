const AppError = require("../utils/appError");
const Validate = require("validator");
const User = require("../models/userModel");

module.exports = async (userData) => {
  const { name, email, password, confirmPassword, status, picture } = userData;

  if (!name || !email || !password || !confirmPassword) {
    throw new AppError("Please fill all fields", 400);
  }

  if (!Validate.isLength(name, { min: 2, max: 16 })) {
    throw new AppError("Name must be between 2 and 16 characters", 400);
  }

  if (!Validate.isEmail(email)) {
    throw new AppError("Invalid email address", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already exists", 400);
  }

  if (password.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400);
  }

  if (password !== confirmPassword) {
    throw new AppError("Passwords do not match", 400);
  }

  if (status && status.length > 64) {
    throw new AppError("Status must be less than 64 characters", 400);
  }

  return true;
};
