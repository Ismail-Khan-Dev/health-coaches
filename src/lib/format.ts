import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatDay(iso: string) {
  try {
    return format(parseISO(iso), "EEE d MMM");
  } catch {
    return iso;
  }
}

export function formatDayLong(iso: string) {
  try {
    return format(parseISO(iso), "EEEE, d MMMM");
  } catch {
    return iso;
  }
}

export function formatTime(iso: string) {
  try {
    return format(parseISO(iso), "h:mm a");
  } catch {
    return iso;
  }
}

export function formatWhen(iso: string) {
  try {
    return format(parseISO(iso), "EEE d MMM, h:mm a");
  } catch {
    return iso;
  }
}

export function fromNow(iso: string) {
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true });
  } catch {
    return iso;
  }
}

export function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
