export const getDaysInMonth = (year: number, month: number) => {
  return new Date(Date.UTC(year, month + 1, 0)).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(Date.UTC(year, month, 1)).getDay();
};
export const toRelativeDate = (date: Date, withTime = false) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60 * 1000) {
    return '刚刚';
  }
  if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))}分钟前`;
  }
  if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}小时前`;
  }
  let time = withTime ? ` ${date.toTimeString().slice(0, 5)}` : '';
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前${time}`;
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  if (now.getFullYear() === year) {
    return `${month}-${day}${time}`;
  }
  return `${year}-${month}-${day}${time}`;
};
