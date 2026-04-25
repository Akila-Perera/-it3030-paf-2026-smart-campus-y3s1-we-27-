const BASE_URL = "http://localhost:8081/api/bookings";

async function safeText(response) {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

async function parseJsonResponse(response) {
  const text = await safeText(response);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function buildQuery(filters = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null) continue;
    const s = String(value).trim();
    if (!s) continue;
    params.set(key, s);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function createBooking(payload) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await safeText(response);
    const err = new Error(
      `Failed to create booking (${response.status})${detail ? `: ${detail}` : ""}`
    );
    err.status = response.status;
    throw err;
  }

  return parseJsonResponse(response);
}

export async function listBookings(filters = {}) {
  const url = `${BASE_URL}${buildQuery(filters)}`;
  const response = await fetch(url, { mode: "cors" });
  if (!response.ok) {
    const detail = await safeText(response);
    throw new Error(
      `Failed to fetch bookings (${response.status})${detail ? `: ${detail}` : ""}`
    );
  }
  const parsed = await parseJsonResponse(response);
  return Array.isArray(parsed) ? parsed : [];
}

export async function listBookingsForUser(requesterId) {
  const url = `${BASE_URL}/user/${encodeURIComponent(requesterId)}`;
  const response = await fetch(url, { mode: "cors" });
  if (!response.ok) {
    const detail = await safeText(response);
    throw new Error(
      `Failed to fetch bookings (${response.status})${detail ? `: ${detail}` : ""}`
    );
  }
  const parsed = await parseJsonResponse(response);
  return Array.isArray(parsed) ? parsed : [];
}

export async function approveBooking(id) {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}/approve`, {
    method: "PUT",
    mode: "cors",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    const detail = await safeText(response);
    const err = new Error(
      `Failed to approve booking (${response.status})${detail ? `: ${detail}` : ""}`
    );
    err.status = response.status;
    throw err;
  }
  return parseJsonResponse(response);
}

export async function rejectBooking(id, reason) {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}/reject`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ reason }),
  });
  if (!response.ok) {
    const detail = await safeText(response);
    throw new Error(
      `Failed to reject booking (${response.status})${detail ? `: ${detail}` : ""}`
    );
  }
  return parseJsonResponse(response);
}

export async function cancelBooking(id) {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}/cancel`, {
    method: "PUT",
    mode: "cors",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    const detail = await safeText(response);
    throw new Error(
      `Failed to cancel booking (${response.status})${detail ? `: ${detail}` : ""}`
    );
  }
  return parseJsonResponse(response);
}
