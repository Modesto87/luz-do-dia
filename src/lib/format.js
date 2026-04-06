export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function round(value, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function formatClock(date, locale) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '--:--';
  }

  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatFullDate(date, locale) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
}

export function formatDurationMinutes(totalMinutes, labels = { hours: 'h', minutes: 'min' }) {
  const safeMinutes = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  if (hours && minutes) {
    return `${hours}${labels.hours} ${minutes}${labels.minutes}`;
  }

  if (hours) {
    return `${hours}${labels.hours}`;
  }

  return `${minutes}${labels.minutes}`;
}

export function formatSignedMinutes(totalMinutes, labels = { hours: 'h', minutes: 'min' }) {
  const prefix = totalMinutes > 0 ? '+' : totalMinutes < 0 ? '-' : '';
  return `${prefix}${formatDurationMinutes(Math.abs(totalMinutes), labels)}`;
}

export function formatWindowRange(start, end, locale) {
  return `${formatClock(start, locale)} - ${formatClock(end, locale)}`;
}

export function formatCoordinates(lat, lon) {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return '--';
  }

  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}${ns} • ${Math.abs(lon).toFixed(2)}${ew}`;
}

export function toTimeInputValue(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '18:00';
  }

  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function timeInputToDate(baseDate, value) {
  const next = new Date(baseDate);
  const [hours, minutes] = `${value || ''}`.split(':').map(Number);

  next.setHours(Number.isFinite(hours) ? hours : 18, Number.isFinite(minutes) ? minutes : 0, 0, 0);
  return next;
}

export function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function startOfDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function isSameDay(left, right) {
  return startOfDay(left).getTime() === startOfDay(right).getTime();
}

export function minutesBetween(from, to) {
  return Math.round((to.getTime() - from.getTime()) / 60000);
}