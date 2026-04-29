import { useEffect, useMemo, useState } from "react";
import { createResource, deleteResource, listResources, updateResource } from "../services/resourceService";

const RESOURCE_TYPES = [
  "LECTURE_HALL",
  "LAB",
  "MEETING_ROOM",
  "EQUIPMENT",
];

const RESOURCE_STATUSES = ["ACTIVE", "OUT_OF_SERVICE"];

export default function ResourceAdminPanel() {
  const [filters, setFilters] = useState({ q: "", type: "", location: "", status: "", minCapacity: "" });
  const [resources, setResources] = useState([]);

  const [form, setForm] = useState({
    name: "",
    type: "LECTURE_HALL",
    capacity: "",
    location: "",
    availabilityStart: "08:00",
    availabilityEnd: "18:00",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const refresh = async () => {
    setError("");
    setLoading(true);
    try {
      const list = await listResources(filters);
      setResources(list);
    } catch (e) {
      setError(e?.message || "Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.q, filters.type, filters.location, filters.status, filters.minCapacity]);

  const normalizedForm = useMemo(() => {
    const capRaw = form.capacity === "" ? null : Number(form.capacity);
    const capacity = form.capacity === "" ? null : (Number.isFinite(capRaw) ? capRaw : NaN);
    return { ...form, capacity };
  }, [form]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!normalizedForm.name.trim()) {
      setError("Resource name is required.");
      return;
    }

    if (normalizedForm.capacity !== null && (!Number.isFinite(normalizedForm.capacity) || normalizedForm.capacity < 0)) {
      setError("Capacity must be a valid number.");
      return;
    }

    setLoading(true);
    try {
      await createResource({
        name: normalizedForm.name.trim(),
        type: normalizedForm.type,
        capacity: normalizedForm.capacity,
        location: normalizedForm.location.trim(),
        availabilityStart: normalizedForm.availabilityStart,
        availabilityEnd: normalizedForm.availabilityEnd,
        status: normalizedForm.status,
      });
      setSuccess("Resource created.");
      setForm((s) => ({ ...s, name: "", capacity: "", location: "" }));
      await refresh();
    } catch (e2) {
      setError(e2?.message || "Failed to create resource");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (r) => {
    setError("");
    setSuccess("");
    const nextStatus = r.status === "ACTIVE" ? "OUT_OF_SERVICE" : "ACTIVE";
    setLoading(true);
    try {
      await updateResource(r.id, { ...r, status: nextStatus });
      setSuccess("Resource updated.");
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to update resource");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (r) => {
    setError("");
    setSuccess("");
    if (!confirm(`Delete resource "${r.name}"?`)) return;
    setLoading(true);
    try {
      await deleteResource(r.id);
      setSuccess("Resource deleted.");
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to delete resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div className="glass-card">
        <h2 style={{ fontSize: "1.15rem", fontWeight: 900, margin: 0 }}>
          Facilities & Assets Catalogue
        </h2>
        <p style={{ marginTop: 8, color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6 }}>
          Maintain bookable resources (rooms & equipment) with metadata and status.
        </p>

        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
          <input
            value={filters.q}
            onChange={(e) => setFilters((s) => ({ ...s, q: e.target.value }))}
            placeholder="Search"
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
          />
          <select
            value={filters.type}
            onChange={(e) => setFilters((s) => ({ ...s, type: e.target.value }))}
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
          >
            <option value="">All types</option>
            {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            type="number"
            min={0}
            value={filters.minCapacity}
            onChange={(e) => setFilters((s) => ({ ...s, minCapacity: e.target.value }))}
            placeholder="Min capacity"
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
          />
          <input
            value={filters.location}
            onChange={(e) => setFilters((s) => ({ ...s, location: e.target.value }))}
            placeholder="Location"
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
          />
        </div>

        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
          <select
            value={filters.status}
            onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value }))}
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
          >
            <option value="">All statuses</option>
            {RESOURCE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {error ? (
          <div style={{ marginTop: 12, color: "#fca5a5", fontSize: "0.9rem" }}>{error}</div>
        ) : null}
        {success ? (
          <div style={{ marginTop: 12, color: "#6ee7b7", fontSize: "0.9rem" }}>{success}</div>
        ) : null}
      </div>

      <div className="glass-card">
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 900 }}>
          Add Resource
        </h3>

        <form onSubmit={handleCreate} style={{ marginTop: 14, display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
            <input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              placeholder="Resource name"
              style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
            />
            <select
              value={form.type}
              onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
              style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
            >
              {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <input
              type="number"
              min={0}
              value={form.capacity}
              onChange={(e) => setForm((s) => ({ ...s, capacity: e.target.value }))}
              placeholder="Capacity"
              style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
            <input
              value={form.location}
              onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
              placeholder="Location"
              style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
            />
            <input
              type="time"
              value={form.availabilityStart}
              onChange={(e) => setForm((s) => ({ ...s, availabilityStart: e.target.value }))}
              style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
              title="Availability start"
            />
            <input
              type="time"
              value={form.availabilityEnd}
              onChange={(e) => setForm((s) => ({ ...s, availabilityEnd: e.target.value }))}
              style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
              title="Availability end"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }}>
            <select
              value={form.status}
              onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}
              style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
            >
              {RESOURCE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.7rem 1rem",
                borderRadius: 12,
                border: "1px solid rgba(99,102,241,0.25)",
                background: "rgba(99,102,241,0.14)",
                color: "#c7d2fe",
                fontWeight: 900,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              Add
            </button>
          </div>
        </form>
      </div>

      <div className="glass-card">
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 900 }}>
          Resources
        </h3>

        <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
          {loading ? (
            <div style={{ color: "#94a3b8" }}>Loading...</div>
          ) : resources.length === 0 ? (
            <div style={{ color: "#94a3b8" }}>No resources found.</div>
          ) : (
            resources.map((r) => (
              <div
                key={r.id}
                style={{
                  padding: 14,
                  borderRadius: 16,
                  border: "1px solid rgba(148,163,184,0.12)",
                  background: "rgba(2,6,23,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 900, color: "#e2e8f0" }}>{r.name}</div>
                  <div style={{ marginTop: 6, color: "#94a3b8", fontSize: "0.86rem" }}>
                    {r.type}
                    {r.capacity != null ? ` · cap ${r.capacity}` : ""}
                    {r.location ? ` · ${r.location}` : ""}
                    {r.status ? ` · ${r.status}` : ""}
                  </div>
                  <div style={{ marginTop: 6, color: "#64748b", fontSize: "0.8rem" }}>
                    Availability: {r.availabilityStart || "--"}–{r.availabilityEnd || "--"}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleToggleStatus(r)}
                    style={{
                      padding: "0.55rem 0.8rem",
                      borderRadius: 12,
                      border: "1px solid rgba(56,189,248,0.25)",
                      background: "rgba(56,189,248,0.08)",
                      color: "#7dd3fc",
                      fontWeight: 900,
                      fontSize: "0.72rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {r.status === "ACTIVE" ? "Out of service" : "Activate"}
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleDelete(r)}
                    style={{
                      padding: "0.55rem 0.8rem",
                      borderRadius: 12,
                      border: "1px solid rgba(248,113,113,0.28)",
                      background: "rgba(248,113,113,0.08)",
                      color: "#fca5a5",
                      fontWeight: 900,
                      fontSize: "0.72rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
