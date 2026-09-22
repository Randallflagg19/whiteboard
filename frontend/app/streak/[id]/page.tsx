import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ApiNotFoundError, getStreak } from "../../lib/api";
import { DataError } from "../../ui/data-error";
import { calendarDay, monthBounds, shiftDay, shiftMonth } from "../date";
import { StreakDelete } from "../streak-delete";
import { StreakMark } from "./streak-mark";

const weekdays = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

function validDay(value: string | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export default async function StreakDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ date?: string }> }) {
  const { id } = await params;
  const today = calendarDay(new Date());
  const requested = (await searchParams).date;
  const date = validDay(requested) && requested <= today ? requested : today;
  const { first, last } = monthBounds(date);
  let streak;
  try {
    streak = await getStreak(id, first, last);
  } catch (error) {
    if (error instanceof ApiNotFoundError) notFound();
    return <DataError />;
  }

  const createdDay = calendarDay(new Date(streak.createdAt));
  if (date < createdDay) redirect(`/streak/${id}?date=${createdDay}`);
  const selectedDay = date;
  const name = streak.title || streak.emoji;
  const monthLabel = new Intl.DateTimeFormat("ru-RU", { timeZone: "UTC", month: "long", year: "numeric" }).format(new Date(`${first}T00:00:00.000Z`));
  const selectedLabel = new Intl.DateTimeFormat("ru-RU", { timeZone: "UTC", day: "numeric", month: "long" }).format(new Date(`${selectedDay}T00:00:00.000Z`));
  const previousMonth = shiftMonth(first, -1);
  const nextMonth = shiftMonth(first, 1);
  const canPrevious = monthBounds(previousMonth).last >= createdDay;
  const canNext = nextMonth <= today;
  const leadingDays = (new Date(`${first}T00:00:00.000Z`).getUTCDay() + 6) % 7;
  const days: string[] = [];
  for (let day = first; day <= last; day = shiftDay(day, 1)) days.push(day);
  const results = new Map(streak.entries.map((entry) => [entry.date, entry.result]));
  const selectedResult = results.get(selectedDay) ?? null;

  return (
    <div className="page-content streak-detail-page">
      <header className="streak-detail-header">
        <Link className="back-link" href="/streak" aria-label="Назад к Streak">‹</Link>
        <div className="streak-detail-identity">
          <span className="streak-emoji" aria-hidden="true">{streak.emoji}</span>
          <span className="streak-count" title="Галочек подряд">{streak.currentCount}</span>
          {streak.showTitle && streak.title && <span className="streak-detail-title">{streak.title}</span>}
        </div>
        <details className="streak-detail-menu">
          <summary aria-label="Действия с привычкой">⋯</summary>
          <div><StreakDelete id={id} name={name} /></div>
        </details>
      </header>
      <div className="streak-month-heading">
        {canPrevious ? <Link href={`/streak/${id}?date=${previousMonth}`} aria-label="Предыдущий месяц">‹</Link> : <span aria-hidden="true" />}
        <h1>{monthLabel}</h1>
        {canNext ? <Link href={`/streak/${id}?date=${nextMonth}`} aria-label="Следующий месяц">›</Link> : <span aria-hidden="true" />}
      </div>
      <div className="streak-month-grid" role="group" aria-label={`Календарь: ${monthLabel}`}>
        {weekdays.map((weekday) => <span className="streak-month-weekday" key={weekday}>{weekday}</span>)}
        {Array.from({ length: leadingDays }, (_, index) => <span key={`blank-${index}`} />)}
        {days.map((day) => {
          const result = results.get(day);
          const unavailable = day < createdDay || day > today;
          const classes = `streak-month-day ${result === "SUCCESS" ? "streak-success" : result === "MISSED" ? "streak-missed" : ""} ${day === selectedDay ? "streak-month-selected" : ""}`;
          return unavailable
            ? <span className="streak-month-day streak-month-unavailable" key={day}>{Number(day.slice(-2))}</span>
            : <Link className={classes} href={`/streak/${id}?date=${day}`} key={day} aria-label={`${Number(day.slice(-2))} ${monthLabel}: ${result === "SUCCESS" ? "сделано" : result === "MISSED" ? "пропущено" : "без отметки"}`} aria-current={day === selectedDay ? "date" : undefined}>{result === "SUCCESS" ? "✓" : result === "MISSED" ? "✕" : Number(day.slice(-2))}</Link>;
        })}
      </div>
      <section className="streak-selected-day">
        <h2>{selectedLabel}</h2>
        <StreakMark key={selectedDay} id={id} date={selectedDay} result={selectedResult} />
      </section>
    </div>
  );
}
