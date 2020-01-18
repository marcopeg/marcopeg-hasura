const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

const day2str = day => {
  if (day === 1) return `${day}st`;
  if (day === 2) return `${day}nd`;
  if (day === 3) return `${day}rd`;
  return `${day}th`;
};

const ensureDate = input => input instanceof Date ? input : new Date(input);

export const showDate = input => {
  const date = ensureDate(input);
  return `${monthNames[date.getMonth()]}  ${day2str(
    date.getDate()
  )}, ${date.getFullYear()}`;
};

export const showTime = input => {
  const date = ensureDate(input);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`
};
