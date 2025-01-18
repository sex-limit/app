export const getDaysInMonth = (year: number, month: number) => {
  return new Date(Date.UTC(year, month + 1, 0)).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(Date.UTC(year, month, 1)).getDay();
};
