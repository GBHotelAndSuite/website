export function calculateNights(checkIn: string | Date, checkOut: string | Date): number {
  const start = new Date(typeof checkIn === "string" ? checkIn : checkIn);
  const end = new Date(typeof checkOut === "string" ? checkOut : checkOut);
  const startNorm = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endNorm = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const diff = endNorm.getTime() - startNorm.getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
}
