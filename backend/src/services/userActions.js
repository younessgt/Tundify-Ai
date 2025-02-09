const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.userExist = async (email) => {
  const user = await User.findOne({ email });
  return user ? user : null;
};

exports.findUserById = async (id) => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new AppError("no user found", 400);
  }
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    status: user.status,
    picture: user.picture,
  };
};

exports.findUserByNameOrEmail = async (keyword, userId) => {
  const users = await User.find({
    $or: [{ name: { $regex: keyword, $options: "i" } }, { email: keyword }],
    _id: { $ne: userId },
  });

  return users;
};
