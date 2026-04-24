import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellRing,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Mail,
  MessageSquare,
  Layers,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getEffectiveNotificationUserId } from "../utils/authStorage";

/* ─── Type meta ────────────────────────────────────────────────── */
const TYPES = [
  {
    value: "GENERAL",
    label: "General",
    gradFrom: "rgba(14,165,233,0.18)",
    gradTo: "rgba(37,99,235,0.08)",
    ring: "rgba(56,189,248,0.4)",
    dot: "#38bdf8",
    text: "#7dd3fc",
    border: "rgba(56,189,248,0.28)",
    stripe: "linear-gradient(90deg, #0ea5e9, #2563eb)",
  },
  {
    value: "ACADEMIC",
    label: "Academic",
    gradFrom: "rgba(139,92,246,0.18)",
    gradTo: "rgba(109,40,217,0.08)",
    ring: "rgba(167,139,250,0.4)",
    dot: "#a78bfa",
    text: "#c4b5fd",
    border: "rgba(167,139,250,0.28)",
    stripe: "linear-gradient(90deg, #8b5cf6, #6d28d9)",
  },
  {
    value: "EVENT",
    label: "Event",
    gradFrom: "rgba(16,185,129,0.18)",
    gradTo: "rgba(5,150,105,0.08)",
    ring: "rgba(52,211,153,0.4)",
    dot: "#34d399",
    text: "#6ee7b7",
    border: "rgba(52,211,153,0.28)",
    stripe: "linear-gradient(90deg, #10b981, #059669)",
  },
];

const getType = (v) => TYPES.find((t) => t.value === v) ?? TYPES[0];

/* ─── Field wrapper ─────────────────────────────────────────────── */
function Field({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "8px",
          fontSize: "0.68rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#64748b",
        }}
      >
        <Icon size={11} style={{ opacity: 0.7 }} />
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            style={{
              marginTop: "6px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.72rem",
              color: "#fb7185",
            }}
          >
            <AlertCircle size={11} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Custom type dropdown ──────────────────────────────────────── */
function TypeSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const sel = getType(value);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "12px 16px",
          borderRadius: "16px",
          border: `1px solid ${sel.border}`,
          background: "rgba(15,23,42,0.6)",
          backdropFilter: "blur(12px)",
          color: "#f1f5f9",
          fontSize: "0.875rem",
          fontWeight: 500,
          cursor: "pointer",
          outline: "none",
          transition: "all 0.2s",
          boxShadow: open ? `0 0 0 2px ${sel.ring}` : "none",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: sel.dot, boxShadow: `0 0 8px ${sel.dot}` }} />
          {sel.label}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} style={{ color: "#64748b" }} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "absolute",
              zIndex: 30,
              top: "calc(100% + 8px)",
              left: 0, right: 0,
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(7,12,24,0.95)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
              overflow: "hidden",
              padding: "6px",
              listStyle: "none",
              margin: 0,
            }}
          >
            {TYPES.map((t) => {
              const active = value === t.value;
              return (
                <li key={t.value}>
                  <button
                    type="button"
                    onClick={() => { onChange(t.value); setOpen(false); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      border: "none",
                      background: active
                        ? `linear-gradient(135deg, ${t.gradFrom}, ${t.gradTo})`
                        : "transparent",
                      color: active ? t.text : "#94a3b8",
                      fontSize: "0.85rem",
                      fontWeight: active ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.dot, boxShadow: active ? `0 0 8px ${t.dot}` : "none", flexShrink: 0 }} />
                    {t.label}
                    {active && <CheckCircle2 size={13} style={{ marginLeft: "auto", opacity: 0.7 }} />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Toast ─────────────────────────────────────────────────────── */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [onClose]);

  const ok = type === "success";
  return (
    <motion.div
      initial={{ opacity: 0, y: -18, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "14px 16px",
        borderRadius: "16px",
        border: ok ? "1px solid rgba(52,211,153,0.22)" : "1px solid rgba(251,113,133,0.22)",
        background: ok ? "rgba(2,44,34,0.7)" : "rgba(44,5,15,0.7)",
        backdropFilter: "blur(20px)",
        boxShadow: ok
          ? "0 8px 32px rgba(16,185,129,0.15), 0 0 0 1px rgba(52,211,153,0.08)"
          : "0 8px 32px rgba(225,29,72,0.15), 0 0 0 1px rgba(251,113,133,0.08)",
        marginBottom: "16px",
      }}
    >
      {ok
        ? <CheckCircle2 size={16} style={{ marginTop: 1, flexShrink: 0, color: "#34d399" }} />
        : <AlertCircle size={16} style={{ marginTop: 1, flexShrink: 0, color: "#fb7185" }} />}
      <p style={{ flex: 1, fontSize: "0.82rem", fontWeight: 500, color: ok ? "#6ee7b7" : "#fda4af", lineHeight: 1.5 }}>
        {message}
      </p>
      <button
        onClick={onClose}
        style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.4, padding: 0, color: ok ? "#34d399" : "#fb7185", lineHeight: 1 }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.4")}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

/* ─── Input / Textarea shared style builder ─────────────────────── */
const inputStyle = (hasError) => ({
  width: "100%",
  padding: "12px 16px",
  borderRadius: "16px",
  border: hasError ? "1px solid rgba(251,113,133,0.5)" : "1px solid rgba(255,255,255,0.08)",
  background: "rgba(15,23,42,0.6)",
  backdropFilter: "blur(12px)",
  color: "#f1f5f9",
  fontSize: "0.875rem",
  outline: "none",
  transition: "all 0.2s",
  boxSizing: "border-box",
  fontFamily: "inherit",
});

/* ─── Main ───────────────────────────────────────────────────────── */
export default function NotificationForm({ onNotificationSent }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ type: "GENERAL", message: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const sel = getType(form.type);

  const set = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: typeof e === "string" ? e : e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.message.trim()) e.message = "Message cannot be empty.";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const ownerId = (
      user?.email ||
      user?.sub ||
      getEffectiveNotificationUserId()
    )
      ?.toString()
      .trim();

    if (!ownerId) {
      setToast({
        message: "You must be signed in to send a notification.",
        type: "error",
      });
      return;
    }

    const senderId = ownerId;

    try {
      setIsSubmitting(true);
      const res = await fetch("http://localhost:8081/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: ownerId,
          senderId,
          type: form.type,
          message: form.message,
          isRead: false,
          createdAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Server error. Please try again.");
      setForm({ type: "GENERAL", message: "" });
      setErrors({});
      setToast({ message: "Notification dispatched successfully.", type: "success" });
      if (typeof onNotificationSent === "function") {
        onNotificationSent();
      }
    } catch (err) {
      setToast({ message: err.message || "Something went wrong.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020817",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 16px",
        fontFamily: "'Inter', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Ambient orbs ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: 0, right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", top: "40%", left: "-5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(14,165,233,0.07) 0%, transparent 70%)", filter: "blur(50px)" }} />
        {/* dot grid */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      <div style={{ position: "relative", width: "100%", maxWidth: "460px" }}>
        {/* ── Toast ── */}
        <AnimatePresence>
          {toast && (
            <Toast key="toast" message={toast.message} type={toast.type} onClose={() => setToast(null)} />
          )}
        </AnimatePresence>

        {/* ── Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset",
            overflow: "hidden",
          }}
        >
          {/* ── Type-aware top stripe ── */}
          <motion.div
            key={form.type}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              height: "3px",
              background: sel.stripe,
              transformOrigin: "left",
              opacity: 0.85,
            }}
          />

          <div style={{ padding: "32px" }}>
            {/* ── Header ── */}
            <motion.div
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12, duration: 0.4 }}
              style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}
            >
              <div style={{
                position: "relative",
                width: 48, height: 48, flexShrink: 0,
                borderRadius: "16px",
                border: "1px solid rgba(99,102,241,0.25)",
                background: "rgba(99,102,241,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 28px rgba(99,102,241,0.22)",
              }}>
                <BellRing size={20} style={{ color: "#a5b4fc" }} />
                <span style={{
                  position: "absolute", top: -4, right: -4,
                  width: 11, height: 11, borderRadius: "50%",
                  background: "#818cf8",
                  border: "2px solid #020817",
                  boxShadow: "0 0 8px rgba(129,140,248,0.8)",
                }} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.02em" }}>
                  Send Notification
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#64748b" }}>
                  Messages are saved for your signed-in account.
                </p>
              </div>
            </motion.div>

            {/* ── Form ── */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* Account (sender / owner id) */}
              <Field label="Your account" icon={Mail} error={null}>
                <div
                  style={{
                    ...inputStyle(false),
                    display: "flex",
                    alignItems: "center",
                    minHeight: "44px",
                    color: "#94a3b8",
                    fontSize: "0.82rem",
                    cursor: "default",
                  }}
                >
                  {(user?.email || user?.sub || getEffectiveNotificationUserId() || "—").toString()}
                </div>
                <p style={{ marginTop: "6px", fontSize: "0.65rem", color: "#475569" }}>
                  <code style={{ color: "#818cf8" }}>userId</code> and{" "}
                  <code style={{ color: "#818cf8" }}>senderId</code> are set automatically from this account.
                </p>
              </Field>

              {/* Type */}
              <Field label="Notification Type" icon={Layers}>
                <TypeSelector value={form.type} onChange={(v) => setForm((p) => ({ ...p, type: v }))} />
              </Field>

              {/* Message */}
              <Field label="Message" icon={MessageSquare} error={errors.message}>
                <textarea
                  rows={4}
                  value={form.message}
                  placeholder="Write your notification message…"
                  onChange={set("message")}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...inputStyle(errors.message),
                    resize: "none",
                    lineHeight: 1.6,
                    boxShadow: focusedField === "message"
                      ? errors.message
                        ? "0 0 0 2px rgba(251,113,133,0.3)"
                        : "0 0 0 2px rgba(99,102,241,0.35)"
                      : "none",
                    borderColor: focusedField === "message" && !errors.message
                      ? "rgba(99,102,241,0.5)"
                      : errors.message ? "rgba(251,113,133,0.5)" : "rgba(255,255,255,0.08)",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
                  <span style={{ fontSize: "0.68rem", color: form.message.length > 220 ? "#fb7185" : "#334155" }}>
                    {form.message.length} / 250
                  </span>
                </div>
              </Field>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={isSubmitting ? {} : { scale: 1.018, boxShadow: "0 8px 30px rgba(99,102,241,0.45)" }}
                whileTap={isSubmitting ? {} : { scale: 0.975 }}
                style={{
                  marginTop: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "9px",
                  width: "100%",
                  padding: "14px 20px",
                  borderRadius: "16px",
                  border: "none",
                  background: isSubmitting
                    ? "rgba(99,102,241,0.5)"
                    : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                  color: "#fff",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
                  transition: "background 0.2s, opacity 0.2s",
                  opacity: isSubmitting ? 0.7 : 1,
                  fontFamily: "inherit",
                  letterSpacing: "-0.01em",
                }}
              >
                {isSubmitting ? (
                  <><Loader2 size={16} style={{ animation: "spin 0.6s linear infinite" }} /> Sending…</>
                ) : (
                  <><Send size={15} /> Send Notification</>
                )}
              </motion.button>
            </motion.form>
          </div>
        </motion.div>

        {/* ── Footer ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          style={{ marginTop: "20px", textAlign: "center", fontSize: "0.68rem", color: "#1e293b", letterSpacing: "0.04em" }}
        >
          POST → localhost:8081/api/notifications
        </motion.p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}