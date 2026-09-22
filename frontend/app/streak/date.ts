const timeZone = "Europe/Moscow";

export function calendarDay(date: Date): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
  }).format(date);
}

export function shiftDay(day: string, amount: number): string {
  const date = new Date(`${day}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

export function weekDays(today: string): string[] {
  const weekday = new Date(`${today}T00:00:00.000Z`).getUTCDay();
  const monday = shiftDay(today, -((weekday + 6) % 7));
  return Array.from({ length: 7 }, (_, index) => shiftDay(monday, index));
}

export function monthBounds(day: string): { first: string; last: string } {
  const first = `${day.slice(0, 7)}-01`;
  const date = new Date(`${first}T00:00:00.000Z`);
  date.setUTCMonth(date.getUTCMonth() + 1);
  date.setUTCDate(date.getUTCDate() - 1);
  return { first, last: date.toISOString().slice(0, 10) };
}

export function shiftMonth(day: string, amount: number): string {
  const date = new Date(`${day.slice(0, 7)}-01T00:00:00.000Z`);
  date.setUTCMonth(date.getUTCMonth() + amount);
  return date.toISOString().slice(0, 10);
}
