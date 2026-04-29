import { useEffect, useMemo, useState } from "react";
import { approveBooking, listBookings, rejectBooking } from "../services/bookingService";
import { listResources } from "../services/resourceService";

function badgeStyle(status) {
  const base = {
    padding: "0.25rem 0.5rem",
    borderRadius: 999,
    fontSize: "0.62rem",
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(148,163,184,0.08)",
    color: "#cbd5e1",
  };

  if (status === "PENDING") {
    return { ...base, border: "1px solid rgba(251,191,36,0.28)", background: "rgba(251,191,36,0.08)", color: "#fcd34d" };
  }
  if (status === "APPROVED") {
    return { ...base, border: "1px solid rgba(52,211,153,0.25)", background: "rgba(52,211,153,0.08)", color: "#6ee7b7" };
  }
  if (status === "REJECTED") {
    return { ...base, border: "1px solid rgba(248,113,113,0.25)", background: "rgba(248,113,113,0.08)", color: "#fca5a5" };
  }
  if (status === "CANCELLED") {
    return { ...base, border: "1px solid rgba(148,163,184,0.18)", background: "rgba(148,163,184,0.06)", color: "#94a3b8" };
  }
  return base;
}

export default function AdminBookingPanel() {
  const [filters, setFilters] = useState({
    status: "PENDING",
    resourceId: "",
    date: "",
    requesterId: "",
  });

  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rejectReasonById, setRejectReasonById] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resourceNameById = useMemo(() => {
    const m = new Map();
    for (const r of resources) m.set(r.id, r.name);
    return m;
  }, [resources]);

  const refresh = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const [resList, bookingList] = await Promise.all([
        listResources({ status: "" }),
        listBookings(filters),
      ]);
      setResources(resList);
      setBookings(bookingList);
    } catch (e) {
      setError(e?.message || "Failed to load booking requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.resourceId, filters.date, filters.requesterId]);

  const handleApprove = async (id) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await approveBooking(id);
      setSuccess("Booking approved.");
      await refresh();
    } catch (e) {
      if (e?.status === 409) {
        setError("Cannot approve: scheduling conflict with an existing booking.");
      } else {
        setError(e?.message || "Failed to approve");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    setError("");
    setSuccess("");
    const reason = (rejectReasonById[id] || "").trim();
    if (!reason) {
      setError("Reject reason is required.");
      return;
    }
    setLoading(true);
    try {
      await rejectBooking(id, reason);
      setSuccess("Booking rejected.");
      setRejectReasonById((s) => {
        const next = { ...s };
        delete next[id];
        return next;
      });
      await refresh();
    } catch (e) {
      setError(e?.message || "Failed to reject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div className="glass-card">
        <h2 style={{ fontSize: "1.15rem", fontWeight: 900, margin: 0 }}>
          Booking Requests
        </h2>
        <p style={{ marginTop: 8, color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6 }}>
          Review requests. Approve or reject with a reason.
        </p>

        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
          <select
            value={filters.status}
            onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value }))}
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
          >
            <option value="">All statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <select
            value={filters.resourceId}
            onChange={(e) => setFilters((s) => ({ ...s, resourceId: e.target.value }))}
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
          >
            <option value="">All resources</option>
            {resources.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters((s) => ({ ...s, date: e.target.value }))}
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
          />

          <input
            value={filters.requesterId}
            onChange={(e) => setFilters((s) => ({ ...s, requesterId: e.target.value }))}
            placeholder="Requester id/email"
            style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
          />
        </div>

        {error ? (
          <div style={{ marginTop: 12, color: "#fca5a5", fontSize: "0.9rem" }}>{error}</div>
        ) : null}
        {success ? (
          <div style={{ marginTop: 12, color: "#6ee7b7", fontSize: "0.9rem" }}>{success}</div>
        ) : null}
      </div>

      <div className="glass-card" style={{ paddingTop: 18 }}>
        <div style={{ display: "grid", gap: 12 }}>
          {loading ? (
            <div style={{ color: "#94a3b8" }}>Loading...</div>
          ) : bookings.length === 0 ? (
            <div style={{ color: "#94a3b8" }}>No bookings found.</div>
          ) : (
            bookings
              .slice()
              .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
              .map((b) => (
                <div
                  key={b.id}
                  style={{
                    padding: 14,
                    borderRadius: 16,
                    border: "1px solid rgba(148,163,184,0.12)",
                    background: "rgba(2,6,23,0.35)",
                    display: "grid",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                        <div style={{ fontWeight: 900, color: "#e2e8f0" }}>
                          {b.resourceName || resourceNameById.get(b.resourceId) || "Resource"}
                        </div>
                        <span style={badgeStyle(b.status)}>{b.status}</span>
                      </div>
                      <div style={{ marginTop: 6, color: "#94a3b8", fontSize: "0.86rem", lineHeight: 1.5 }}>
                        {b.date} · {b.startTime}–{b.endTime} · {b.requesterId}
                      </div>
                      <div style={{ marginTop: 6, color: "#cbd5e1", fontSize: "0.86rem", lineHeight: 1.5 }}>
                        {b.purpose || "(no purpose)"}
                        {b.expectedAttendees != null ? ` · attendees: ${b.expectedAttendees}` : ""}
                      </div>
                      {b.adminReason ? (
                        <div style={{ marginTop: 6, color: "#94a3b8", fontSize: "0.82rem" }}>
                          Reason: {b.adminReason}
                        </div>
                      ) : null}
                    </div>

                    {b.status === "PENDING" ? (
                      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleApprove(b.id)}
                          style={{
                            padding: "0.55rem 0.8rem",
                            borderRadius: 10,
                            border: "1px solid rgba(52,211,153,0.25)",
                            background: "rgba(52,211,153,0.08)",
                            color: "#6ee7b7",
                            fontWeight: 900,
                            fontSize: "0.72rem",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            cursor: loading ? "not-allowed" : "pointer",
                          }}
                        >
                          Approve
                        </button>
                      </div>
                    ) : null}
                  </div>

                  {b.status === "PENDING" ? (
                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 10 }}>
                      <input
                        value={rejectReasonById[b.id] || ""}
                        onChange={(e) => setRejectReasonById((s) => ({ ...s, [b.id]: e.target.value }))}
                        placeholder="Reject reason (required)"
                        style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
                      />
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleReject(b.id)}
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
                        Reject
                      </button>
                    </div>
                  ) : null}
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
