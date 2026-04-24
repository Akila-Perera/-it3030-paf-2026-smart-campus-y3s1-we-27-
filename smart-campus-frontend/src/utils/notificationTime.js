import { formatDistanceToNow } from "date-fns";

/** True if the string already ends with Z or a numeric offset like +05:30 / -08:00. */
function hasExplicitTimezone(isoLike) {
  const s = isoLike.trim();
  return (
    /Z$/i.test(s) ||
    /[+-]\d{2}:\d{2}$/.test(s) ||
    /[+-]\d{4}$/.test(s)
  );
}

/**
 * If the server sends an ISO-like datetime without a zone, it is treated as UTC
 * (append `Z`) so the browser converts to local time correctly.
 */
function parseStringToDate(raw) {
  const trimmed = raw.trim();

  let candidate = trimmed;
  if (!hasExplicitTimezone(trimmed)) {
    if (trimmed.includes(" ") && !trimmed.includes("T")) {
      candidate = trimmed.replace(" ", "T");
    }
    if (!hasExplicitTimezone(candidate)) {
      candidate = `${candidate}Z`;
      console.log(
        "[notificationTime] no timezone in string — treating as UTC:",
        candidate
      );
    }
  }

  const d = new Date(candidate);
  if (Number.isNaN(d.getTime())) {
    console.warn("[notificationTime] invalid date after parse:", candidate);
    return null;
  }
  console.log(
    "[notificationTime] parsed instant (UTC ISO):",
    d.toISOString(),
    "| local:",
    d.toString()
  );
  return d;
}

/**
 * Parse backend createdAt (ISO string, array from Java LocalDateTime, or Date).
 * Strings without a timezone are interpreted as UTC.
 * Arrays use UTC calendar fields via Date.UTC (Java month is 1–12).
 */
export function parseNotificationDate(value) {
  if (value == null || value === "") return null;

  if (value instanceof Date) {
    const d = Number.isNaN(value.getTime()) ? null : value;
    if (d) {
      console.log(
        "[notificationTime] createdAt raw (Date):",
        value.toISOString?.() ?? value
      );
    }
    return d;
  }

  if (typeof value === "string") {
    return parseStringToDate(value);
  }

  if (Array.isArray(value) && value.length >= 3) {
    const [y, m, day, h = 0, min = 0, sec = 0, nano = 0] = value;
    const ms = typeof nano === "number" ? Math.floor(nano / 1e6) : 0;
    const t = Date.UTC(y, m - 1, day, h, min, sec, ms);
    const d = new Date(t);
    if (Number.isNaN(d.getTime())) {
      console.warn("[notificationTime] invalid Date from array:", value);
      return null;
    }
    console.log(
      "[notificationTime] array → UTC instant:",
      d.toISOString(),
      "| local:",
      d.toString()
    );
    return d;
  }

  console.warn("[notificationTime] unsupported createdAt shape:", value);
  return null;
}

/**
 * Relative time like "2 minutes ago" via date-fns, or "Recently" if missing/invalid.
 */
export function formatNotificationRelativeTime(createdAt) {
  console.log(
    "[notificationTime] formatNotificationRelativeTime — exact DB value:",
    createdAt,
    "| typeof:",
    typeof createdAt,
    Array.isArray(createdAt) ? "(array)" : ""
  );

  const d = parseNotificationDate(createdAt);
  if (!d) return "Recently";
  try {
    const label = formatDistanceToNow(d, { addSuffix: true });
    console.log("[notificationTime] formatDistanceToNow result:", label);
    return label;
  } catch (e) {
    console.warn("[notificationTime] formatDistanceToNow failed:", e);
    return "Recently";
  }
}
