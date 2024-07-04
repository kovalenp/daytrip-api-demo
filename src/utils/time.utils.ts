export const convertMinutes = (minutes: number) => {
  const days = Math.floor(minutes / 1440);
  minutes %= 1440;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const dayString = days === 1 ? "1 day" : `${days} days`;
  const hourString = hours === 1 ? "1 hour" : `${hours} hours`;
  const minuteString = mins === 1 ? "1 minute" : `${mins} minutes`;

  let result = [];
  if (days > 0) result.push(dayString);
  if (hours > 0) result.push(hourString);
  if (mins > 0) result.push(minuteString);

  return result.join(', ');
}
