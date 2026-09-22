export function formatShortDate(value: string) {
  const [, month, day] = value.split("-");
  return `${day}.${month}`;
}

export function formatBlockDate(block: {
  dueDate: string | null;
  scheduledFor: string | null;
  periodStart: string | null;
  periodEnd: string | null;
}): { text: string; isDeadline: boolean } | null {
  if (block.dueDate) return { text: `до ${formatShortDate(block.dueDate)}`, isDeadline: true };
  if (block.scheduledFor) return { text: formatShortDate(block.scheduledFor), isDeadline: false };
  if (block.periodStart && block.periodEnd) {
    return { text: `${formatShortDate(block.periodStart)} — ${formatShortDate(block.periodEnd)}`, isDeadline: false };
  }
  return null;
}
