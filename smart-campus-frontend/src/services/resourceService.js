const BASE_URL = "http://localhost:8081/api/resources";

async function parseJsonResponse(response) {
  const text = await response.text();
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

export async function listResources(filters = {}) {
  const url = `${BASE_URL}${buildQuery(filters)}`;
  const response = await fetch(url, { mode: "cors" });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Failed to fetch resources (${response.status})${detail ? `: ${detail}` : ""}`
    );
  }
  const parsed = await parseJsonResponse(response);
  return Array.isArray(parsed) ? parsed : [];
}

export async function createResource(payload) {
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
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Failed to create resource (${response.status})${detail ? `: ${detail}` : ""}`
    );
  }

  return parseJsonResponse(response);
}

export async function updateResource(id, payload) {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Failed to update resource (${response.status})${detail ? `: ${detail}` : ""}`
    );
  }

  return parseJsonResponse(response);
}

export async function deleteResource(id) {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    mode: "cors",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Failed to delete resource (${response.status})${detail ? `: ${detail}` : ""}`
    );
  }
}
