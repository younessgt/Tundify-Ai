const AppError = require("../utils/appError");
const Validate = require("validator");
const User = require("../models/userModel");

module.exports = async (userData) => {
  const { name, email, password, confirmPassword, status, picture } = userData;

  if (!name || !email || !password || !confirmPassword) {
    throw new AppError("Please fill all fields", 400);
  }

  if (!Validate.isEmail(email)) {
    throw new AppError("Invalid email address", 400);
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

  try {
    const user = await User.findOne({ email });
  } catch (error) {
    throw new AppError("Email already exists", 400);
  }
  return true;
};
