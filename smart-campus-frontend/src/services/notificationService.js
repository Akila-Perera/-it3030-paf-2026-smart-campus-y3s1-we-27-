const BASE_URL = "http://localhost:8081/api/notifications";

/** Normalize id from API (string id or Mongo-style _id). */
export function normalizeNotificationId(id) {
  if (id == null) return "";
  const s = String(id).trim();
  return s;
}

async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function getAllNotifications() {
  const url = `${BASE_URL}`;
  console.log("[notificationService] GET", url);

  const response = await fetch(url, { mode: "cors" });
  const text = await response.text();
  console.log(
    "[notificationService] response",
    response.status,
    "length",
    text?.length ?? 0,
    "preview",
    text?.slice(0, 240)
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch notifications: ${response.status}`);
  }

  if (!text) {
    console.log("[notificationService] empty body, treating as []");
    return [];
  }

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      console.log("[notificationService] parsed array, count:", parsed.length);
      return parsed;
    }
    console.warn("[notificationService] JSON is not an array:", typeof parsed, parsed);
    return [];
  } catch (e) {
    console.error("[notificationService] JSON parse failed:", e);
    return [];
  }
}

export async function markAsRead(id) {
  const safeId = normalizeNotificationId(id);
  if (!safeId) {
    throw new Error("Cannot mark as read: missing notification id");
  }
  const response = await fetch(
    `${BASE_URL}/${encodeURIComponent(safeId)}/read`,
    {
      method: "PUT",
      headers: { Accept: "application/json" },
      mode: "cors",
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to mark as read: ${response.status}`);
  }
  return parseJsonResponse(response);
}

export async function deleteNotification(id) {
  const safeId = normalizeNotificationId(id);
  if (!safeId) {
    throw new Error("Cannot delete: missing notification id");
  }
  const url = `http://localhost:8081/api/notifications/${encodeURIComponent(safeId)}`;
  const response = await fetch(url, {
    method: "DELETE",
    mode: "cors",
    headers: {
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Failed to delete notification (${response.status})${detail ? `: ${detail}` : ""}`
    );
  }
}
