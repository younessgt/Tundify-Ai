import moment from "moment";

export const dateConverter = (date) => {
  const now = moment();
  const momentDate = moment(date);

  const diffInMinutes = now.diff(momentDate, "minutes");
  const diffInHours = now.diff(momentDate, "hours");
  const diffInDays = now.diff(momentDate, "days", true);

  if (diffInMinutes < 1) {
    return "Now";
  }
  if (diffInMinutes < 60) {
    return momentDate.format("HH:mm");
  }
  if (diffInHours < 24) {
    return momentDate.format("HH:mm");
  }
  if (diffInDays === 1) {
    return "Yesterday";
  }
  if (diffInDays < 8) {
    return momentDate.format("dddd"); // Day of the week (e.g., Monday)
  }

  return momentDate.format("DD/MM/YYYY");
};

export const formatDate = (date) => {
  const now = moment();
  const momentDate = moment(date);

  const diffInDays = now.diff(momentDate, "days", true);

  if (diffInDays === 1) {
    return "Yesterday";
  }
  if (diffInDays < 8) {
    return momentDate.format("dddd"); // Day of the week (e.g., Monday)
  }

  return momentDate.format("DD/MM/YYYY");
};
