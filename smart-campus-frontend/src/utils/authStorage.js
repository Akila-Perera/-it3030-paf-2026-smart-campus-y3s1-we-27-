export const AUTH_USER_KEY = "smartcampus_user";
export const LEGACY_USER_KEY = "user";

export function getStoredUser() {
  try {
    const rawLegacy = localStorage.getItem(LEGACY_USER_KEY);
    if (rawLegacy) {
      const parsedLegacy = JSON.parse(rawLegacy);
      if (parsedLegacy && typeof parsedLegacy === "object") return parsedLegacy;
    }

    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  localStorage.setItem(LEGACY_USER_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(LEGACY_USER_KEY);
}

/**
 * Owner key for notifications: Google email first, then `sub`.
 * No legacy "1" default — must match the signed-in account.
 */
export function getEffectiveNotificationUserId() {
  const u = getStoredUser();
  const email = u?.email?.toString().trim();
  if (email) return email;
  const sub = u?.sub?.toString().trim();
  if (sub) return sub;
  return "";
}
