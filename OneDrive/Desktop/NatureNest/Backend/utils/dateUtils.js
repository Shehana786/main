// Calculates next care date by adding days to the given date
exports.calculateNextDate = (lastDate, days) => {
  if (!lastDate) return null;
  const next = new Date(lastDate);
  next.setDate(next.getDate() + days);
  return next;
};
