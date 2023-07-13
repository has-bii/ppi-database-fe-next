export const formatDate = (timestamp) => {
  const d = new Date(timestamp);

  const months = [
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
    "Des",
  ];

  const date = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();

  const time = `${date}-${months[month]}-${year}`;

  return time;
};
