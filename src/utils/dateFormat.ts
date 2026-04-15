const MONTHS_FR = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function formatDateSeparator(timestamp: number, lang: 'fr' | 'en' = 'fr'): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, today)) {
    return lang === 'fr' ? "Aujourd'hui" : 'Today';
  }
  if (isSameDay(date, yesterday)) {
    return lang === 'fr' ? 'Hier' : 'Yesterday';
  }

  const months = lang === 'fr' ? MONTHS_FR : MONTHS_EN;
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function shouldShowDateSeparator(prevTimestamp: number | null, currentTimestamp: number): boolean {
  if (prevTimestamp === null) return true;
  return !isSameDay(new Date(prevTimestamp), new Date(currentTimestamp));
}
