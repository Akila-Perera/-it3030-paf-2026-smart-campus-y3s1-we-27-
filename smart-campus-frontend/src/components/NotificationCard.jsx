import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Trash2, Clock3, BellDot, BookOpen, CalendarDays } from "lucide-react";
import {
  deleteNotification,
  normalizeNotificationId,
} from "../services/notificationService";

/* ─── Type config ───────────────────────────────────────────────── */
const TYPE_CONFIG = {
  GENERAL: {
    label: "General",
    Icon: BellDot,
    stripe: "linear-gradient(180deg, #0ea5e9, #2563eb)",
    badge: { bg: "rgba(14,165,233,0.1)", border: "rgba(56,189,248,0.25)", color: "#7dd3fc" },
    cardGlow: "rgba(14,165,233,0.06)",
    hoverBorder: "rgba(56,189,248,0.22)",
  },
  ACADEMIC: {
    label: "Academic",
    Icon: BookOpen,
    stripe: "linear-gradient(180deg, #a78bfa, #7c3aed)",
    badge: { bg: "rgba(139,92,246,0.1)", border: "rgba(167,139,250,0.25)", color: "#c4b5fd" },
    cardGlow: "rgba(139,92,246,0.06)",
    hoverBorder: "rgba(167,139,250,0.22)",
  },
  EVENT: {
    label: "Event",
    Icon: CalendarDays,
    stripe: "linear-gradient(180deg, #34d399, #059669)",
    badge: { bg: "rgba(16,185,129,0.1)", border: "rgba(52,211,153,0.25)", color: "#6ee7b7" },
    cardGlow: "rgba(16,185,129,0.06)",
    hoverBorder: "rgba(52,211,153,0.22)",
  },
};

const getCfg = (t) => TYPE_CONFIG[t] ?? TYPE_CONFIG.GENERAL;

/* ─── Action button ─────────────────────────────────────────────── */
function ActionBtn({ onClick, disabled, loading, icon: Icon, label, loadingLabel, danger }) {
  const [hov, setHov] = useState(false);
  const hoverBg = danger ? "rgba(244,63,94,0.1)" : "rgba(99,102,241,0.1)";
  const hoverBorder = danger ? "rgba(251,113,133,0.3)" : "rgba(129,140,248,0.3)";
  const hoverColor = danger ? "#fb7185" : "#a5b4fc";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.04 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "7px 13px",
        borderRadius: "10px",
        border: `1px solid ${hov && !disabled ? hoverBorder : "rgba(255,255,255,0.07)"}`,
        background: hov && !disabled ? hoverBg : "rgba(255,255,255,0.03)",
        color: hov && !disabled ? hoverColor : "#475569",
        fontSize: "0.72rem",
        fontWeight: 600,
        letterSpacing: "0.02em",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.35 : 1,
        transition: "all 0.18s ease",
        backdropFilter: "blur(8px)",
        fontFamily: "inherit",
        border: `1px solid ${hov && !disabled ? hoverBorder : "rgba(255,255,255,0.07)"}`,
      }}
    >
      <Icon size={13} />
      {loading ? loadingLabel : label}
    </motion.button>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export default function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
  onDismissLocal,
  isLecturer = false,
  timeLabel = "Recently",
}) {
  const [isRead, setIsRead] = useState(notification?.isRead ?? false);
  const [isMarking, setIsMarking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [removed, setRemoved] = useState(false);

  const type = notification?.type || "GENERAL";
  const cfg = getCfg(type);

  const handleMarkAsRead = async () => {
    if (isRead || !notification?.id) return;
    try {
      setIsMarking(true);
      if (onMarkAsRead) await onMarkAsRead(notification.id);
      setIsRead(true);
    } finally {
      setIsMarking(false);
    }
  };

  const handleDelete = async () => {
    const id = normalizeNotificationId(
      notification?.id ?? notification?._id
    );
    if (!id) {
      window.alert("Missing notification id — cannot delete.");
      return;
    }

    if (!isLecturer) {
      setRemoved(true);
      if (onDismissLocal) {
        onDismissLocal(id);
      }
      return;
    }

    try {
      setIsDeleting(true);
      await deleteNotification(id);
      setRemoved(true);
      if (onDelete) {
        try {
          await onDelete(id);
        } catch (refetchErr) {
          console.error("List refresh after delete failed:", refetchErr);
        }
      }
    } catch (err) {
      console.error("Delete failed:", err);
      window.alert(
        err?.message ||
          "Could not delete this notification. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {!removed && (
        <motion.article
          layout
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: -28, scale: 0.95, transition: { duration: 0.22 } }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: "relative",
            display: "flex",
            borderRadius: "18px",
            border: `1px solid ${hovered && !isRead ? cfg.hoverBorder : "rgba(255,255,255,0.07)"}`,
            background: isRead
              ? "rgba(255,255,255,0.02)"
              : `radial-gradient(ellipse at top left, ${cfg.cardGlow} 0%, transparent 65%), rgba(255,255,255,0.04)`,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: hovered && !isRead
              ? `0 14px 44px rgba(0,0,0,0.45), 0 0 0 1px ${cfg.hoverBorder}`
              : "0 4px 20px rgba(0,0,0,0.28)",
            overflow: "hidden",
            transition: "box-shadow 0.28s ease, border-color 0.28s ease, background 0.3s ease, opacity 0.3s",
            opacity: isRead ? 0.5 : 1,
            filter: isRead ? "saturate(0.35)" : "none",
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          {/* ── Left accent stripe ── */}
          <div style={{
            width: "3px",
            flexShrink: 0,
            background: cfg.stripe,
            borderRadius: "18px 0 0 18px",
            opacity: isRead ? 0.25 : 1,
            transition: "opacity 0.3s",
          }} />

          {/* ── Card body ── */}
          <div style={{ flex: 1, padding: "18px 18px 15px 16px" }}>

            {/* Top row */}
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "11px",
            }}>
              {/* Badges */}
              <div style={{ display: "flex", alignItems: "center", gap: "7px", flexWrap: "wrap" }}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  border: `1px solid ${cfg.badge.border}`,
                  background: cfg.badge.bg,
                  color: cfg.badge.color,
                  fontSize: "0.63rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}>
                  <cfg.Icon size={10} />
                  {cfg.label}
                </span>

                <AnimatePresence>
                  {isRead && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.75 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.75 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "4px 9px",
                        borderRadius: "8px",
                        border: "1px solid rgba(100,116,139,0.18)",
                        background: "rgba(100,116,139,0.07)",
                        color: "#475569",
                        fontSize: "0.6rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      <Check size={9} /> Read
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Timestamp */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 10px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.03)",
                color: "#334155",
                fontSize: "0.68rem",
                fontWeight: 500,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}>
                <Clock3 size={11} />
                {timeLabel}
              </div>
            </div>

            {/* Message */}
            <p style={{
              margin: "0 0 15px",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: isRead ? "#334155" : "#cbd5e1",
              lineHeight: 1.65,
              letterSpacing: "-0.005em",
              transition: "color 0.3s",
            }}>
              {notification?.message || "No notification message available."}
            </p>

            {/* Footer */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
            }}>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.6rem",
                color: "#1e293b",
                letterSpacing: "0.06em",
              }}>
                #{String(notification?.id ?? 0).padStart(4, "0")}
              </span>

              <div style={{ display: "flex", gap: "6px" }}>
                <ActionBtn
                  onClick={handleMarkAsRead}
                  disabled={isRead || isMarking}
                  loading={isMarking}
                  icon={Check}
                  label="Mark Read"
                  loadingLabel="Marking…"
                  danger={false}
                />
                <ActionBtn
                  onClick={handleDelete}
                  disabled={isDeleting}
                  loading={isDeleting}
                  icon={Trash2}
                  label={isLecturer ? "Delete" : "Dismiss"}
                  loadingLabel={isLecturer ? "Deleting…" : "Dismissing…"}
                  danger
                />
              </div>
            </div>
          </div>
        </motion.article>
      )}
    </AnimatePresence>
  );
}