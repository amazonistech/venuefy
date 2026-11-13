export const paise = (value) => value == null ? "—" : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value) / 100);
export const stateLabel = (value) => (value || "").replaceAll("_", " ").replace(/^\w/, (letter) => letter.toUpperCase());
export const indiaTime = (value) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(value));

export const BOOKING_DAY_MS = 86400000;
export const MAX_BOOKING_INTERVAL_MS = 7 * BOOKING_DAY_MS;

export function asIndiaInput(value, round = Math.floor) {
  return new Date(round(value / 60000) * 60000 + 330 * 60000).toISOString().slice(0, 16);
}

export function earliestVenueStart(venue, selected, now) {
  const days = venue.bookingPolicies?.advanceBookingDays ?? 5;
  return Math.max(now + days * BOOKING_DAY_MS, selected?.availableFrom ? Date.parse(selected.availableFrom) : 0);
}

export function indiaInterval(start, end) {
  const startAt = start + "+05:30", endAt = end + "+05:30";
  if (!start || !end || !(new Date(startAt) > new Date()) || !(new Date(endAt) > new Date(startAt))) throw new Error("Choose a future start and a later end time in IST.");
  if (Date.parse(endAt) - Date.parse(startAt) > MAX_BOOKING_INTERVAL_MS) throw new Error("The event cannot last more than seven days.");
  return { startAt, endAt };
}

export function fromRupees(input) {
  if (!/^\d+(?:\.\d{1,2})?$/.test(input)) throw new Error("Enter an amount with up to two decimal places.");
  const [whole, fraction = ""] = input.split(".");
  const amount = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(amount) || amount < 1) throw new Error("Enter a valid amount.");
  return amount;
}
