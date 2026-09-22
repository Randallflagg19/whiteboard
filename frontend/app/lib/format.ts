export function formatShortDate(value: string) {
  const [, month, day] = value.split("-");
  return `${day}.${month}`;
}
