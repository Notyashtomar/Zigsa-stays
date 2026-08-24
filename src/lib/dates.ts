import { addDays, differenceInCalendarDays, format } from "date-fns";

export const HOLD_MINUTES = 15;

export function parseDateOnly(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

export function toDateInput(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function nightsBetween(checkIn: Date, checkOut: Date) {
  return differenceInCalendarDays(checkOut, checkIn);
}

export function dateRangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
) {
  return aStart < bEnd && bStart < aEnd;
}

export function defaultStay() {
  const today = new Date();
  const checkIn = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 1));
  const checkOut = addDays(checkIn, 2);
  return { checkIn, checkOut };
}

export function formatStayDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
