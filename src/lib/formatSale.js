// Helpers that turn raw sale dates and times from Supabase into friendly text.
// Used by SaleCard (Browse page) and the sale detail page, so both show dates the same way.

// Turns a database date like "2026-11-15" into a JavaScript Date.
// Takes: the sale_date string. Returns: a Date, or null if the value is missing or broken.
// Why not just `new Date("2026-11-15")`? JavaScript reads that as midnight in London (UTC),
// which is still the 14th in Texas, so the sale would show up a day early.
// Building the date from its parts keeps it in the viewer's local time zone.
function parseSaleDate(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  // Months start at 0 in JavaScript (January = 0), so subtract 1.
  return new Date(year, month - 1, day);
}

// Today's date in the same "YYYY-MM-DD" format the database uses, e.g. "2026-11-10".
// Used by the Home page to only show sales from today onward.
// Takes nothing. Returns: today's date as a string, based on the clock of the computer running the code.
// Note: on a hosted server that clock may be in UTC, so "today" can flip over a few hours early in the evening.
export function getTodayString() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// Cleans up a list of tags: trims spaces, makes them lowercase and removes repeats.
// Used when saving a sale (CreateSaleForm) and when showing tags (SaleCard, detail page,
// Browse tag filter), so older sales that were saved with repeats still show each tag once.
// Takes: an array like ["Clothes", " clothes", "toys"] (or nothing). Returns: ["clothes", "toys"].
export function uniqueTags(tags) {
  if (!tags) return [];
  const cleaned = tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean);
  // A Set only keeps one copy of each value; [...set] turns it back into an array
  return [...new Set(cleaned)];
}

// Full readable date for the detail page.
// Takes: "2026-11-15". Returns: "Sunday, November 15, 2026", or "" if there is no date.
export function formatSaleDate(value) {
  const date = parseSaleDate(value);
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// The three short pieces shown in the date badge on a sale card.
// Takes: "2026-11-15". Returns: { weekday: "SUN", month: "NOV", day: "15" }, or null if there is no date.
export function getDateBadge(value) {
  const date = parseSaleDate(value);
  if (!date) return null;
  return {
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: String(date.getDate()),
  };
}

// Turns a database time like "13:00:00" into "1:00 PM".
// Takes: the time string. Returns: the 12-hour time, or "" if the value is missing.
export function formatTime(value) {
  if (!value) return "";
  const [hours, minutes] = value.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  // 0 becomes 12 (midnight) and 13 becomes 1, so the hour reads like a normal clock.
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

// Start and end time together, like "9:00 AM – 1:00 PM".
// Takes: start_time and end_time strings. Returns: the range, one time if only one exists, or "".
export function formatTimeRange(start, end) {
  const from = formatTime(start);
  const to = formatTime(end);
  if (from && to) return `${from} – ${to}`;
  return from || to;
}
