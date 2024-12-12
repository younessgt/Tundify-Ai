const { findUserByNameOrEmail } = require("../services/userActions");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.searchUser = catchAsync(async (req, resp, next) => {
  const searchInput = req.query.search;

  if (!searchInput) {
    next(new AppError("Please provide a search keyword", 400));
  }

  const users = await findUserByNameOrEmail(searchInput);

  resp.status(200).json({
    status: "success",
    length: users.length,
    users,
  });
});
