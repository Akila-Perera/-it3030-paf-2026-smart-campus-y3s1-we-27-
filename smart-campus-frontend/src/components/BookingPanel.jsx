import { useEffect, useMemo, useState } from "react";
import { getStoredUser } from "../utils/authStorage";
import { createBooking, listBookingsForUser, cancelBooking } from "../services/bookingService";
import { listResources } from "../services/resourceService";

const RESOURCE_TYPES = [
  "LECTURE_HALL",
  "LAB",
  "MEETING_ROOM",
  "EQUIPMENT",
];

function typeLabel(type) {
  if (!type) return "";
  if (type === "LECTURE_HALL") return "Lecture Hall";
  if (type === "MEETING_ROOM") return "Room";
  if (type === "LAB") return "Lab";
  if (type === "EQUIPMENT") return "Equipment";
  return String(type);
}

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

export default function BookingPanel() {
  const stored = getStoredUser();
  const requesterId = useMemo(() => {
    const email = stored?.email?.toString().trim();
    if (email) return email;
    const sub = stored?.sub?.toString().trim();
    if (sub) return sub;
    const username = stored?.username?.toString().trim();
    if (username) return username;
    return "";
  }, [stored]);

  const requesterName = stored?.name || stored?.username || "";
  const requesterEmail = stored?.email || "";

  const [resources, setResources] = useState([]);
  const [resourceFilters, setResourceFilters] = useState({
    type: "",
    status: "ACTIVE",
  });

  const [selectedResourceId, setSelectedResourceId] = useState("");

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [expectedAttendees, setExpectedAttendees] = useState("");

  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const refreshResources = async () => {
    const next = await listResources(resourceFilters);
    setResources(next);
    setSelectedResourceId((cur) => (cur && next.some((r) => r.id === cur) ? cur : ""));
  };

  const selectedResource = useMemo(
    () => resources.find((r) => r.id === selectedResourceId) || null,
    [resources, selectedResourceId]
  );

  const refreshMyBookings = async () => {
    if (!requesterId) return;
    const next = await listBookingsForUser(requesterId);
    setMyBookings(next);
  };

  useEffect(() => {
    refreshResources().catch((e) => setError(e.message || "Failed to load resources"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceFilters.type, resourceFilters.status]);

  useEffect(() => {
    refreshMyBookings().catch((e) => setError(e.message || "Failed to load bookings"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requesterId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedResourceId) {
      setError("Please choose a resource first.");
      return;
    }
    if (!date || !startTime || !endTime) {
      setError("Please provide date and time range.");
      return;
    }
    if (!purpose.trim()) {
      setError("Please enter a purpose.");
      return;
    }

    const expected = expectedAttendees === "" ? null : Number(expectedAttendees);
    if (expectedAttendees !== "" && (!Number.isFinite(expected) || expected < 0)) {
      setError("Expected attendees must be a valid number.");
      return;
    }

    setLoading(true);
    try {
      await createBooking({
        resourceId: selectedResourceId,
        requesterId,
        requesterName,
        requesterEmail,
        date,
        startTime,
        endTime,
        purpose: purpose.trim(),
        expectedAttendees: expected,
      });
      setSuccess("Booking request submitted (PENDING). ");
      setPurpose("");
      setExpectedAttendees("");
      await refreshMyBookings();
    } catch (e2) {
      if (e2?.status === 409) {
        setError("Scheduling conflict: that resource is already booked for that time range.");
      } else {
        setError(e2?.message || "Failed to create booking");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await cancelBooking(bookingId);
      setSuccess("Booking cancelled.");
      await refreshMyBookings();
    } catch (e) {
      setError(e?.message || "Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  const handleStartBooking = (resourceId) => {
    setError("");
    setSuccess("");
    setSelectedResourceId(resourceId);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 24 }}>
      <div className="glass-card">
        <h2 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>
          Resources
        </h2>
        <p style={{ marginTop: 8, color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6 }}>
          Filter by resource type and click <b>Book</b> to start a booking.
        </p>

        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setResourceFilters((s) => ({ ...s, type: "" }))}
            style={{
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.18)",
              background: resourceFilters.type === "" ? "rgba(99,102,241,0.14)" : "rgba(2,6,23,0.35)",
              color: resourceFilters.type === "" ? "#c7d2fe" : "#cbd5e1",
              fontWeight: 800,
              fontSize: "0.75rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            All
          </button>
          {RESOURCE_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setResourceFilters((s) => ({ ...s, type: t }))}
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.18)",
                background: resourceFilters.type === t ? "rgba(99,102,241,0.14)" : "rgba(2,6,23,0.35)",
                color: resourceFilters.type === t ? "#c7d2fe" : "#cbd5e1",
                fontWeight: 800,
                fontSize: "0.75rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {typeLabel(t)}
            </button>
          ))}
        </div>

        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 12,
          }}
        >
          {resources.length === 0 ? (
            <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              No resources found.
            </div>
          ) : (
            resources.map((r) => {
              const isSelected = r.id === selectedResourceId;
              return (
                <div
                  key={r.id}
                  style={{
                    padding: 14,
                    borderRadius: 16,
                    border: isSelected
                      ? "1px solid rgba(99,102,241,0.35)"
                      : "1px solid rgba(148,163,184,0.12)",
                    background: "rgba(2,6,23,0.35)",
                    display: "grid",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontWeight: 900, color: "#e2e8f0", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.name}
                    </div>
                    <div style={{ ...badgeStyle("PENDING"), border: "1px solid rgba(148,163,184,0.18)", background: "rgba(148,163,184,0.06)", color: "#cbd5e1" }}>
                      {typeLabel(r.type)}
                    </div>
                  </div>

                  <div style={{ color: "#94a3b8", fontSize: "0.86rem", lineHeight: 1.5 }}>
                    {r.location ? `Location: ${r.location}` : "Location: —"}
                    <br />
                    {r.capacity != null ? `Capacity: ${r.capacity}` : "Capacity: —"}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartBooking(r.id)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid rgba(99,102,241,0.25)",
                      background: "rgba(99,102,241,0.14)",
                      color: "#c7d2fe",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    Book
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedResource ? (
        <div className="glass-card">
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>
            Booking Form
          </h2>
          <p style={{ marginTop: 8, color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6 }}>
            Booking for <b>{selectedResource.name}</b> ({typeLabel(selectedResource.type)})
            {selectedResource.location ? ` · ${selectedResource.location}` : ""}
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: 16, display: "grid", gap: 12 }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                Date
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
              />
            </div>
            <div>
              <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                Start
              </div>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
              />
            </div>
            <div>
              <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                End
              </div>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
              />
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
              Purpose
            </div>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
              placeholder="e.g., Project meeting / Lab session"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0", resize: "vertical" }}
            />
          </div>

          <div>
            <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
              Expected Attendees (optional)
            </div>
            <input
              type="number"
              min={0}
              value={expectedAttendees}
              onChange={(e) => setExpectedAttendees(e.target.value)}
              placeholder="e.g., 30"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,6,23,0.5)", color: "#e2e8f0" }}
            />
          </div>

          {error ? (
            <div style={{ color: "#fca5a5", fontSize: "0.85rem" }}>{error}</div>
          ) : null}
          {success ? (
            <div style={{ color: "#6ee7b7", fontSize: "0.85rem" }}>{success}</div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(99,102,241,0.25)",
              background: "rgba(99,102,241,0.14)",
              color: "#c7d2fe",
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Submitting..." : "Submit Booking Request"}
          </button>
        </form>
        </div>
      ) : null}

      <div className="glass-card">
        <h2 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>
          My Bookings
        </h2>

        <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
          {myBookings.length === 0 ? (
            <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>No bookings yet.</div>
          ) : (
            myBookings
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
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <div style={{ fontWeight: 800, color: "#e2e8f0" }}>
                        {b.resourceName || "Resource"}
                      </div>
                      <span style={badgeStyle(b.status)}>{b.status}</span>
                    </div>
                    <div style={{ marginTop: 8, color: "#94a3b8", fontSize: "0.86rem", lineHeight: 1.5 }}>
                      {b.date} · {b.startTime}–{b.endTime}
                      {b.purpose ? ` · ${b.purpose}` : ""}
                    </div>
                    {b.adminReason ? (
                      <div style={{ marginTop: 8, color: "#cbd5e1", fontSize: "0.82rem", lineHeight: 1.5 }}>
                        Reason: <span style={{ color: "#94a3b8" }}>{b.adminReason}</span>
                      </div>
                    ) : null}
                  </div>

                  <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                    {b.status === "APPROVED" ? (
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleCancel(b.id)}
                        style={{
                          padding: "0.55rem 0.8rem",
                          borderRadius: 10,
                          border: "1px solid rgba(248,113,113,0.28)",
                          background: "rgba(248,113,113,0.08)",
                          color: "#fca5a5",
                          fontWeight: 800,
                          fontSize: "0.72rem",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          cursor: loading ? "not-allowed" : "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
