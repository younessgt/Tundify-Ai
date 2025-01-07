export const getRecieverId = (users, userLoggedInId) => {
  const user = users.find((user) => user._id !== userLoggedInId);
  return user._id;
};

export const getRecieverName = (users, userLoggedInId) => {
  const user = users.find((user) => user._id !== userLoggedInId);
  return user.name;
};

export const getRecieverPicture = (users, userLoggedInId) => {
  const user = users.find((user) => user._id !== userLoggedInId);
  return user.picture;
};
