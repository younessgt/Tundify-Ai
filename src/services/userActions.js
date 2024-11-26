const User = require("../models/userModel");

exports.userExist = async (email) => {
  const user = await User.findOne({ email });
  return user ? user : null;
};
