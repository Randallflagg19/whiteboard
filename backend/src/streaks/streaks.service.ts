import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Streak, StreakEntry } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateStreakInput, StreakResultInput } from './streaks.validation.js';

const timeZone = 'Europe/Moscow';

function calendarDay(date: Date): string {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(date);
}

function previousDay(day: string): string {
  const date = new Date(`${day}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

function toResponse(streak: Streak, entries: Pick<StreakEntry, 'date' | 'result'>[], from: Date, to: Date) {
  const today = calendarDay(new Date());
  const results = new Map(entries.map((entry) => [entry.date.toISOString().slice(0, 10), entry.result]));
  let day = results.get(today) === 'SUCCESS' ? today : previousDay(today);
  let currentCount = 0;
  if (results.get(today) !== 'MISSED') {
    while (results.get(day) === 'SUCCESS') {
      currentCount += 1;
      day = previousDay(day);
    }
  }
  return {
    id: streak.id,
    emoji: streak.emoji,
    title: streak.title,
    showTitle: streak.showTitle,
    createdAt: streak.createdAt,
    currentCount,
    entries: entries
      .filter((entry) => entry.date >= from && entry.date <= to)
      .map((entry) => ({ date: entry.date.toISOString().slice(0, 10), result: entry.result })),
  };
}

function validateRange(from: Date, to: Date) {
  if (from > to) throw new BadRequestException('from must be on or before to');
}

@Injectable()
export class StreaksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(from: Date, to: Date) {
    validateRange(from, to);
    const streaks = await this.prisma.streak.findMany({
      include: { entries: { select: { date: true, result: true } } },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
    });
    return streaks.map(({ entries, ...streak }) => toResponse(streak, entries, from, to));
  }

  async findOne(id: string, from: Date, to: Date) {
    validateRange(from, to);
    const streak = await this.prisma.streak.findUnique({
      where: { id },
      include: { entries: { select: { date: true, result: true } } },
    });
    if (!streak) throw new NotFoundException('Streak not found');
    const { entries, ...fields } = streak;
    return toResponse(fields, entries, from, to);
  }

  create(input: CreateStreakInput) {
    return this.prisma.streak.create({ data: input });
  }

  async mark(streakId: string, date: Date, result: StreakResultInput) {
    const streak = await this.prisma.streak.findUnique({ where: { id: streakId }, select: { id: true, createdAt: true } });
    if (!streak) throw new NotFoundException('Streak not found');
    const day = date.toISOString().slice(0, 10);
    if (day < calendarDay(streak.createdAt) || day > calendarDay(new Date())) {
      throw new BadRequestException('Date must be between streak creation and today');
    }
    const entry = await this.prisma.streakEntry.upsert({
      where: { streakId_date: { streakId, date } },
      create: { streakId, date, result },
      update: { result },
    });
    return { id: entry.id, date: entry.date.toISOString().slice(0, 10), result: entry.result };
  }

  async delete(id: string) {
    const result = await this.prisma.streak.deleteMany({ where: { id } });
    if (result.count === 0) throw new NotFoundException('Streak not found');
    return { deleted: true };
  }
}
