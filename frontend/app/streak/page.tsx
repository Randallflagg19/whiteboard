import Link from "next/link";
import { getStreaks } from "../lib/api";
import { DataError } from "../ui/data-error";
import { calendarDay, weekDays } from "./date";
import { StreakCreate } from "./streak-create";

const weekdays = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

export default async function StreakPage() {
  const today = calendarDay(new Date());
  const days = weekDays(today);
  let streaks;
  try {
    streaks = await getStreaks(days[0], days[6]);
  } catch {
    return <DataError />;
  }

  return (
    <div className="page-content streak-page">
      <header className="page-header streak-page-header">
        <div className="streak-heading"><h1>Streak</h1><StreakCreate /></div>
      </header>
      {streaks.length === 0 ? (
        <div className="empty-state streak-empty">
          <span className="empty-state-icon" aria-hidden="true">✓</span>
          <h2>Пока нет привычек</h2>
          <p>Нажми +, чтобы добавить первую.</p>
        </div>
      ) : (
        <>
          <div className="streak-week-head" aria-hidden="true">
            <span />
            {days.map((day, index) => <span key={day}><small>{weekdays[index]}</small><strong>{Number(day.slice(-2))}</strong></span>)}
          </div>
          <ul className="streak-week-list">
            {streaks.map((streak) => {
              const results = new Map(streak.entries.map((entry) => [entry.date, entry.result]));
              const createdDay = calendarDay(new Date(streak.createdAt));
              const name = streak.title || streak.emoji;
              return <li key={streak.id}>
                <Link className="streak-week-row" href={`/streak/${streak.id}`} aria-label={`${name}, ${streak.currentCount} подряд. Открыть календарь`}>
                  <span className="streak-week-identity">
                    <span className="streak-emoji" aria-hidden="true">{streak.emoji}</span>
                    <span className="streak-count" title="Галочек подряд">{streak.currentCount}</span>
                    {streak.showTitle && streak.title && <span className="streak-week-title">{streak.title}</span>}
                  </span>
                  {days.map((day) => {
                    const result = results.get(day);
                    const unavailable = day < createdDay || day > today;
                    return <span key={day} className={`streak-week-cell ${result === "SUCCESS" ? "streak-success" : result === "MISSED" ? "streak-missed" : ""} ${unavailable ? "streak-cell-unavailable" : ""} ${day === today ? "streak-cell-today" : ""}`} aria-hidden="true">{result === "SUCCESS" ? "✓" : result === "MISSED" ? "✕" : ""}</span>;
                  })}
                </Link>
              </li>;
            })}
          </ul>
        </>
      )}
    </div>
  );
}
