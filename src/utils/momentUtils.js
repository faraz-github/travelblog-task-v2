export const formatDateIntoMonthNameDateNumberYearNumber = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatObjectIdIntoMonthNameDateNumberYearNumber = (objectId) => {
  const timestamp = objectId.toString().substring(0, 8);

  const date = new Date(parseInt(timestamp, 16) * 1000);

  return formatDateIntoMonthNameDateNumberYearNumber(date);
};
