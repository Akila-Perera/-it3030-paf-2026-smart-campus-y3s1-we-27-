import { useEffect, useMemo, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStoredUser, setStoredUser } from "../utils/authStorage";

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #020617;
    color: #cbd5e1;
    font-family: 'Bricolage Grotesque', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }

  @keyframes orb1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(30px, -20px) scale(1.05); }
    66%       { transform: translate(-15px, 15px) scale(0.97); }
  }

  @keyframes orb2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    40%       { transform: translate(-25px, 20px) scale(1.04); }
    70%       { transform: translate(20px, -10px) scale(0.96); }
  }

  @keyframes gridFade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity: 0.5; }
    100% { transform: scale(1.6); opacity: 0; }
  }

  .login-card {
    animation: fadeUp 0.55s cubic-bezier(.22,1,.36,1) both;
  }

  .eyebrow  { animation: fadeUp 0.45s 0.05s cubic-bezier(.22,1,.36,1) both; }
  .headline { animation: fadeUp 0.45s 0.12s cubic-bezier(.22,1,.36,1) both; }
  .sub      { animation: fadeUp 0.45s 0.18s cubic-bezier(.22,1,.36,1) both; }
  .divider  { animation: fadeUp 0.45s 0.24s cubic-bezier(.22,1,.36,1) both; }
  .gbutton  { animation: fadeUp 0.45s 0.30s cubic-bezier(.22,1,.36,1) both; }
  .footer   { animation: fadeUp 0.45s 0.38s cubic-bezier(.22,1,.36,1) both; }

  .google-btn {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 11px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.96);
    padding: 13px 20px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
    cursor: pointer;
    transition: background 0.15s, box-shadow 0.15s, transform 0.12s;
    position: relative;
    overflow: hidden;
    font-family: 'Bricolage Grotesque', sans-serif;
    letter-spacing: -0.01em;
  }

  .google-btn:hover {
    background: #fff;
    box-shadow: 0 4px 24px rgba(99,102,241,0.18), 0 1px 4px rgba(0,0,0,0.15);
    transform: translateY(-1px);
  }

  .google-btn:active {
    transform: translateY(0);
    box-shadow: none;
  }

  .google-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%);
    background-size: 400px 100%;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .google-btn:hover::after {
    opacity: 1;
    animation: shimmer 0.7s ease forwards;
  }

  .stat-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    background: rgba(15,23,42,0.7);
    border: 1px solid rgba(51,65,85,0.5);
    border-radius: 99px;
    font-size: 0.65rem;
    color: #64748b;
    font-family: 'DM Mono', monospace;
    white-space: nowrap;
  }

  .stat-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #34d399;
    box-shadow: 0 0 6px rgba(52,211,153,0.7);
    flex-shrink: 0;
  }
`;

const features = [
  { icon: "🔔", label: "Real-time notifications" },
  { icon: "📊", label: "Academic analytics" },
  { icon: "📅", label: "Course scheduling" },
  { icon: "🎓", label: "Student management" },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn } = useAuth();

  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  // Get the redirect path from location state (default to dashboard)
  const from = location.state?.from || "/dashboard";

  const nextPathForUser = useMemo(() => {
    const u = getStoredUser();
    if (u?.role === "ADMIN") return "/admindashboard";
    return from; // Use the stored redirect path
  }, [from]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate(nextPathForUser, { replace: true });
    }
  }, [isLoggedIn, navigate, nextPathForUser]);

  const handleLoginSuccess = (credentialResponse) => {
    const token = credentialResponse?.credential;
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const user = {
        name: decoded.name ?? "",
        email: decoded.email ?? "",
        picture: decoded.picture ?? "",
        sub: decoded.sub ?? "",
        role: "STUDENT", // Default role for Google login
      };
      setStoredUser(user);
      login();
      // Redirect to the intended page (tickets or dashboard)
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Failed to decode Google credential:", err);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setAdminError("");

    const u = adminUsername.trim();
    const p = adminPassword;

    if (u === "Admin1" && p === "Admin123") {
      const adminUser = {
        name: "Admin1",
        email: "admin@smartcampus.local",
        picture: "",
        sub: "admin-1",
        role: "ADMIN",
        username: "Admin1",
      };
      setStoredUser(adminUser);
      login();
      navigate(from, { replace: true });
      return;
    }

    setAdminError("Invalid admin credentials.");
  };

  return (
    <>
      <style>{globalStyles}</style>

      {/* Full-page wrapper */}
      <div style={{
        minHeight: "100vh",
        background: "#020617",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* ── Ambient orbs ── */}
        <div style={{
          position: "absolute", top: "12%", left: "18%",
          width: 520, height: 520,
          background: "radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 68%)",
          borderRadius: "50%",
          animation: "orb1 12s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "8%", right: "14%",
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 68%)",
          borderRadius: "50%",
          animation: "orb2 16s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "45%", right: "25%",
          width: 200, height: 200,
          background: "radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />

        {/* ── Dot grid ── */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(rgba(51,65,85,0.35) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          animation: "gridFade 1.2s 0.1s ease both",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }} />

        {/* ── Two-column layout ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "5rem",
          maxWidth: 900,
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}>

          {/* ── Left panel: branding ── */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Logo mark */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                position: "relative",
                width: 42, height: 42,
              }}>
                {/* Pulse ring */}
                <div style={{
                  position: "absolute", inset: -4,
                  borderRadius: 11,
                  border: "1px solid rgba(99,102,241,0.4)",
                  animation: "pulse-ring 2.5s cubic-bezier(.4,0,.6,1) infinite",
                }} />
                <div style={{
                  width: 42, height: 42, borderRadius: 11,
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 20px rgba(99,102,241,0.35)",
                  fontSize: "0.72rem", fontWeight: 800,
                  color: "#fff", letterSpacing: "0.05em",
                  fontFamily: "'DM Mono', monospace",
                }}>SC</div>
              </div>
              <div>
                <div style={{ fontSize: "1rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>UniPortal</div>
                <div style={{ fontSize: "0.6rem", color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>Smart Campus</div>
              </div>
            </div>

            {/* Headline */}
            <div>
              <p className="eyebrow" style={{
                fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase",
                color: "#6366f1", fontFamily: "'DM Mono', monospace", marginBottom: "0.75rem",
              }}>▸ University Management System</p>
              <h1 className="headline" style={{
                fontSize: "2.6rem", fontWeight: 800, color: "#f1f5f9",
                letterSpacing: "-0.05em", lineHeight: 1.05,
                marginBottom: "1rem",
              }}>
                Your campus,<br />
                <span style={{
                  background: "linear-gradient(90deg, #818cf8, #c084fc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>unified.</span>
              </h1>
              <p className="sub" style={{
                fontSize: "0.875rem", color: "#475569", lineHeight: 1.65, maxWidth: 340,
              }}>
                One portal for students, faculty and administration. Manage courses, notifications, and academic operations seamlessly.
              </p>
            </div>

            {/* Feature list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {features.map((f, i) => (
                <div key={f.label} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  animation: `fadeUp 0.4s ${0.2 + i * 0.07}s cubic-bezier(.22,1,.36,1) both`,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: "rgba(99,102,241,0.08)",
                    border: "1px solid rgba(99,102,241,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", flexShrink: 0,
                  }}>{f.icon}</div>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{f.label}</span>
                </div>
              ))}
            </div>

            {/* Live stats row */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div className="stat-pill"><span className="stat-dot" />All systems live</div>
              <div className="stat-pill">12,847 students</div>
              <div className="stat-pill">284 courses</div>
            </div>
          </div>

          {/* ── Right panel: login card ── */}
          <div className="login-card" style={{
            width: "100%",
            maxWidth: 380,
            flexShrink: 0,
          }}>
            {/* Card */}
            <div style={{
              background: "rgba(15,23,42,0.7)",
              border: "1px solid rgba(51,65,85,0.6)",
              borderRadius: 16,
              padding: "2rem",
              backdropFilter: "blur(24px)",
              boxShadow: "0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}>
              {/* Card header */}
              <div style={{ marginBottom: "1.75rem" }}>
                <h2 style={{
                  fontSize: "1.2rem", fontWeight: 800, color: "#f1f5f9",
                  letterSpacing: "-0.03em", marginBottom: 6,
                }}>Sign in</h2>
                <p style={{ fontSize: "0.78rem", color: "#475569", lineHeight: 1.5 }}>
                  Use your university Google account to continue.
                </p>
              </div>

              {/* Divider with label */}
              <div className="divider" style={{
                display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem",
              }}>
                <div style={{ flex: 1, height: 1, background: "rgba(51,65,85,0.5)" }} />
                <span style={{
                  fontSize: "0.6rem", color: "#334155",
                  fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase",
                }}>continue with</span>
                <div style={{ flex: 1, height: 1, background: "rgba(51,65,85,0.5)" }} />
              </div>

              {/* Google Sign-In (official widget) */}
              <div
                className="gbutton"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={() => console.error("Google Sign-In failed")}
                  theme="filled_black"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width={340}
                />
              </div>

              {/* Admin Sign-In */}
              <div style={{ marginTop: "1.35rem" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10, marginBottom: "0.9rem",
                }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(51,65,85,0.5)" }} />
                  <span style={{
                    fontSize: "0.6rem", color: "#334155",
                    fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase",
                  }}>admin login</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(51,65,85,0.5)" }} />
                </div>

                <form onSubmit={handleAdminLogin} style={{ display: "grid", gap: 10 }}>
                  <input
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Username (Admin1)"
                    autoComplete="username"
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(51,65,85,0.6)",
                      background: "rgba(2,6,23,0.55)",
                      color: "#e2e8f0",
                      outline: "none",
                      fontSize: "0.85rem",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Password (Admin123)"
                    autoComplete="current-password"
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(51,65,85,0.6)",
                      background: "rgba(2,6,23,0.55)",
                      color: "#e2e8f0",
                      outline: "none",
                      fontSize: "0.85rem",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  />

                  {adminError ? (
                    <div style={{
                      fontSize: "0.72rem",
                      color: "#fca5a5",
                      fontFamily: "'DM Mono', monospace",
                      lineHeight: 1.4,
                    }}>
                      {adminError}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: 10,
                      border: "1px solid rgba(99,102,241,0.35)",
                      background: "rgba(99,102,241,0.12)",
                      color: "#c7d2fe",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'DM Mono', monospace",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Sign in as Admin
                  </button>
                </form>
              </div>

              {/* Security note */}
              <div style={{
                marginTop: "1.25rem",
                padding: "10px 12px",
                background: "rgba(99,102,241,0.06)",
                border: "1px solid rgba(99,102,241,0.15)",
                borderRadius: 8,
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" style={{ marginTop: 1, flexShrink: 0 }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <p style={{ fontSize: "0.68rem", color: "#475569", lineHeight: 1.5, fontFamily: "'DM Mono', monospace" }}>
                  Secured via institutional SSO. Only <span style={{ color: "#818cf8" }}>@uni.edu</span> accounts are permitted.
                </p>
              </div>
            </div>

            {/* Below-card note */}
            <p className="footer" style={{
              marginTop: "1.25rem",
              textAlign: "center",
              fontSize: "0.65rem",
              color: "#1e293b",
              fontFamily: "'DM Mono', monospace",
              lineHeight: 1.6,
            }}>
              Signed-in profile is stored locally so you stay on the dashboard
              until you log out.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}