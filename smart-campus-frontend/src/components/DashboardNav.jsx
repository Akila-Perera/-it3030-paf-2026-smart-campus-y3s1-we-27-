import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardNav({ userEmail = "" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const displayName = user?.name || "Member";
  const avatarUrl = user?.picture || "";
  const normalizedEmail = userEmail.toLowerCase();
  const isStudent =
    normalizedEmail.length > 0 && normalizedEmail.endsWith("@my.sliit.lk");
  const roleLabel = isStudent ? "Student" : "Lecturer";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        margin: "-1.5rem -1rem 1.5rem",
        padding: "0.75rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        borderBottom: "1px solid rgba(51,65,85,0.45)",
        background: "rgba(8,11,16,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: "0 0 14px 14px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: "1px solid rgba(96,165,250,0.35)",
            background: "rgba(96,165,250,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "#7dd3fc",
            flexShrink: 0,
          }}
        >
          SC
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              fontSize: "0.82rem",
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#e2eaf2",
            }}
          >
            Smart Campus
          </span>
          <span
            style={{
              fontSize: "0.58rem",
              color: "#475569",
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: "0.04em",
            }}
          >
            Member 4 · Notifications
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            minWidth: 0,
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              width={40}
              height={40}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(51,65,85,0.6)",
                flexShrink: 0,
              }}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#334155,#1e293b)",
                border: "2px solid rgba(51,65,85,0.6)",
                flexShrink: 0,
              }}
            />
          )}
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#cbd5e1",
              maxWidth: "140px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={displayName}
          >
            {displayName}
          </span>
          <span
            style={{
              padding: "0.2rem 0.45rem",
              borderRadius: "999px",
              border: `1px solid ${
                isStudent ? "rgba(56,189,248,0.45)" : "rgba(167,139,250,0.45)"
              }`,
              background: isStudent
                ? "rgba(56,189,248,0.12)"
                : "rgba(167,139,250,0.12)",
              color: isStudent ? "#7dd3fc" : "#c4b5fd",
              fontSize: "0.62rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              flexShrink: 0,
            }}
          >
            {roleLabel}
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            padding: "0.45rem 0.95rem",
            borderRadius: 8,
            border: "1px solid rgba(248,113,113,0.35)",
            background: "rgba(248,113,113,0.08)",
            color: "#fca5a5",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "'IBM Plex Mono', monospace",
            flexShrink: 0,
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(248,113,113,0.15)";
            e.currentTarget.style.borderColor = "rgba(248,113,113,0.55)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(248,113,113,0.08)";
            e.currentTarget.style.borderColor = "rgba(248,113,113,0.35)";
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
