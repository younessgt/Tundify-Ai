export const getRecieverId = (users, userLoggedInId) => {
  const user = users.find((user) => user._id !== userLoggedInId);
  return user._id;
};
