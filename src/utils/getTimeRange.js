export const getTimeRange = (filter) => {
  const now = new Date();
  let start = new Date(), end = new Date();

  const pad = (n) => String(n).padStart(2, "0");
  const format = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

  if (filter === "today") {
    start.setHours(0, 0, 0, 0);
  } else if (filter === "yesterday") {
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);
    end = new Date(start);
    end.setHours(23, 59, 59, 999);
  } else if (filter === "week") {
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);
  } else if (filter === "month") {
    start.setMonth(start.getMonth() - 1);
    start.setHours(0, 0, 0, 0);
  }

  return {
    startDate: format(start),
    endDate: format(end),
  };
};
