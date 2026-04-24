import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Shield, Bell, Users, ArrowRight, ChevronDown } from "lucide-react";

/* ─────────────────────────────────────────────
   Tiny CSS-in-JS helper – no extra deps needed
───────────────────────────────────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: #030712;
    color: #e2e8f0;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  /* Gradient text utility */
  .grad-text {
    background: linear-gradient(135deg, #e0f2fe 0%, #818cf8 40%, #a78bfa 70%, #f472b6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .grad-text-subtle {
    background: linear-gradient(100deg, #93c5fd 0%, #a5b4fc 60%, #c4b5fd 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Animated blob */
  @keyframes blobFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(30px, -40px) scale(1.06); }
    66%       { transform: translate(-20px, 20px) scale(0.96); }
  }

  @keyframes blobFloat2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(-40px, 30px) scale(1.04); }
    66%       { transform: translate(25px, -25px) scale(0.98); }
  }

  .blob { animation: blobFloat 18s ease-in-out infinite; }
  .blob2 { animation: blobFloat2 22s ease-in-out infinite; }

  /* Fade-in-up */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .fade-up-1 { animation: fadeUp 0.75s cubic-bezier(.22,1,.36,1) 0.1s both; }
  .fade-up-2 { animation: fadeUp 0.75s cubic-bezier(.22,1,.36,1) 0.28s both; }
  .fade-up-3 { animation: fadeUp 0.75s cubic-bezier(.22,1,.36,1) 0.44s both; }
  .fade-up-4 { animation: fadeUp 0.75s cubic-bezier(.22,1,.36,1) 0.60s both; }
  .fade-up-5 { animation: fadeUp 0.75s cubic-bezier(.22,1,.36,1) 0.76s both; }

  .fade-in-nav { animation: fadeIn 0.6s ease 0s both; }

  /* Card hover lift */
  .feature-card {
    transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease, border-color 0.35s ease;
  }
  .feature-card:hover {
    transform: translateY(-6px) scale(1.015);
    box-shadow: 0 32px 64px rgba(2,6,23,0.55), 0 0 0 1px rgba(165,180,252,0.25);
    border-color: rgba(165,180,252,0.3) !important;
  }

  /* Button hover */
  .btn-primary {
    transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
  }
  .btn-primary:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 16px 40px rgba(139,92,246,0.45), 0 4px 12px rgba(59,130,246,0.3);
    filter: brightness(1.08);
  }
  .btn-primary:active { transform: translateY(0) scale(0.98); }

  .btn-ghost {
    transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
  }
  .btn-ghost:hover {
    background: rgba(165,180,252,0.1) !important;
    border-color: rgba(165,180,252,0.5) !important;
    color: #e0e7ff !important;
    transform: translateY(-2px);
  }

  .nav-login-btn {
    transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
  }
  .nav-login-btn:hover {
    transform: translateY(-1px) scale(1.04);
    box-shadow: 0 8px 24px rgba(139,92,246,0.5);
    filter: brightness(1.1);
  }

  /* Scroll indicator bounce */
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(6px); }
  }
  .bounce { animation: bounce 2s ease-in-out infinite; }

  /* Noise grain overlay */
  .grain::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  /* Grid lines */
  .grid-bg {
    background-image:
      linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px);
    background-size: 64px 64px;
  }

  /* Glow ring on feature icon */
  .icon-wrap {
    transition: box-shadow 0.3s ease;
  }
  .feature-card:hover .icon-wrap {
    box-shadow: 0 0 0 8px rgba(139,92,246,0.12), 0 0 24px rgba(139,92,246,0.25);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .hero-btns { flex-direction: column; align-items: stretch !important; }
    .features-grid { grid-template-columns: 1fr !important; }
    .nav-links { display: none; }
  }
`;

/* ─────────────────────────────────────────────
   Inject styles once
───────────────────────────────────────────── */
function useGlobalStyles() {
  useEffect(() => {
    const id = "sc-global-styles";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = globalStyles;
    document.head.appendChild(el);
  }, []);
}

/* ─────────────────────────────────────────────
   Animated counter (used in stats)
───────────────────────────────────────────── */
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        let start = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          start = Math.min(start + step, target);
          setVal(start);
          if (start >= target) clearInterval(timer);
        }, 18);
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function Home() {
  useGlobalStyles();

  const features = [
    {
      icon: <Shield size={22} strokeWidth={1.8} />,
      label: "Secure Auth",
      title: "Enterprise-Grade Security",
      desc: "Role-based access control with JWT sessions ensures only the right eyes see the right content — always.",
      color: "#6366f1",
      glow: "rgba(99,102,241,0.18)",
    },
    {
      icon: <Bell size={22} strokeWidth={1.8} />,
      label: "Real-time Alerts",
      title: "Instant Notifications",
      desc: "Push critical announcements to students the moment they're published. No refreshing, no delays, no missed updates.",
      color: "#38bdf8",
      glow: "rgba(56,189,248,0.18)",
    },
    {
      icon: <Users size={22} strokeWidth={1.8} />,
      label: "Role Management",
      title: "Unified Role Control",
      desc: "Admins, lecturers, and students each get a tailored experience — with fine-grained permissions baked in from day one.",
      color: "#a78bfa",
      glow: "rgba(167,139,250,0.18)",
    },
  ];

  return (
    <div
      className="grain"
      style={{
        minHeight: "100vh",
        background: "#030712",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* ── Background grid ── */}
      <div
        className="grid-bg"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* ── Glowing blobs ── */}
      <div
        className="blob"
        style={{
          position: "fixed",
          top: "-140px",
          left: "-140px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.22) 0%, rgba(139,92,246,0.1) 50%, transparent 75%)",
          filter: "blur(60px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        className="blob2"
        style={{
          position: "fixed",
          bottom: "-160px",
          right: "-120px",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(56,189,248,0.18) 0%, rgba(99,102,241,0.08) 50%, transparent 75%)",
          filter: "blur(70px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* ══════════════════════════════════
          NAVBAR
      ══════════════════════════════════ */}
      <nav
        className="fade-in-nav"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "rgba(3,7,18,0.65)",
          borderBottom: "1px solid rgba(148,163,184,0.1)",
          boxShadow: "0 1px 40px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
              }}
            >
              <span style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 800 }}>S</span>
            </div>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                color: "#f1f5f9",
              }}
            >
              SmartCampus
            </span>
          </div>

          {/* Nav links */}
          <div
            className="nav-links"
            style={{ display: "flex", alignItems: "center", gap: "32px" }}
          >
            {["Home", "Features", "About"].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  color: "#94a3b8",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#e2e8f0")}
                onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
              >
                {link}
              </a>
            ))}
          </div>

          {/* CTA */}
          <Link
            to="/login"
            className="nav-login-btn"
            style={{
              border: "none",
              color: "#fff",
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: "0.83rem",
              letterSpacing: "0.03em",
              borderRadius: "10px",
              padding: "9px 20px",
              cursor: "pointer",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
              boxShadow: "0 4px 20px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
              position: "relative",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Login →
          </Link>
        </div>
      </nav>

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <main style={{ position: "relative", zIndex: 1 }}>
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "96px 24px 80px",
            textAlign: "center",
          }}
        >
          {/* Eyebrow badge */}
          <div className="fade-up-1" style={{ display: "inline-flex", marginBottom: "28px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: "100px",
                border: "1px solid rgba(99,102,241,0.35)",
                background: "rgba(99,102,241,0.1)",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#a5b4fc",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#6366f1",
                  boxShadow: "0 0 8px #6366f1",
                  display: "inline-block",
                }}
              />
              Smart Notification Platform
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="fade-up-2"
            style={{
              fontSize: "clamp(2.6rem, 7vw, 5rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.04em",
              fontWeight: 800,
              marginBottom: "10px",
              fontFamily: "Plus Jakarta Sans, sans-serif",
            }}
          >
            <span style={{ color: "#f8fafc" }}>Your Campus,</span>
            <br />
            <span
              className="grad-text"
              style={{ fontStyle: "normal" }}
            >
              Unified.
            </span>
          </h1>

          {/* Sub-headline */}
          <p
            className="fade-up-3"
            style={{
              maxWidth: "600px",
              margin: "28px auto 0",
              color: "#64748b",
              fontSize: "1.075rem",
              lineHeight: 1.8,
              fontWeight: 400,
            }}
          >
            Centralize every campus announcement into one intelligent hub.
            Lecturers publish, students receive — in{" "}
            <span style={{ color: "#93c5fd", fontWeight: 500 }}>real time</span>,
            through one{" "}
            <span style={{ color: "#a5b4fc", fontWeight: 500 }}>secure dashboard</span>.
          </p>

          {/* CTA Buttons */}
          <div
            className="fade-up-4 hero-btns"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "14px",
              marginTop: "44px",
            }}
          >
            <Link
              to="/login"
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: "none",
                color: "#fff",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: "0.95rem",
                borderRadius: "14px",
                padding: "14px 28px",
                cursor: "pointer",
                background:
                  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #a855f7 100%)",
                boxShadow:
                  "0 8px 32px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.18)",
                textDecoration: "none",
              }}
            >
              Get Started Free
              <ArrowRight size={16} />
            </Link>

            <button
              type="button"
              className="btn-ghost"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "transparent",
                color: "#94a3b8",
                fontFamily: "inherit",
                fontWeight: 600,
                fontSize: "0.95rem",
                borderRadius: "14px",
                padding: "13px 28px",
                cursor: "pointer",
                border: "1px solid rgba(148,163,184,0.2)",
              }}
            >
              Learn More
              <ChevronDown size={15} />
            </button>
          </div>

          {/* Social proof strip */}
          <div
            className="fade-up-5"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "36px",
            }}
          >
            {/* Avatars */}
            <div style={{ display: "flex" }}>
              {["#6366f1", "#38bdf8", "#a78bfa", "#f472b6"].map((bg, i) => (
                <div
                  key={i}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: bg,
                    border: "2px solid #030712",
                    marginLeft: i === 0 ? 0 : "-8px",
                  }}
                />
              ))}
            </div>
            <span style={{ color: "#475569", fontSize: "0.82rem", fontWeight: 500 }}>
              Trusted by{" "}
              <span style={{ color: "#94a3b8", fontWeight: 600 }}>1,200+ students</span> across
              campuses
            </span>
          </div>
        </section>

        {/* ══════════════════════════════════
            STATS BAR
        ══════════════════════════════════ */}
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto 0",
            padding: "0 24px 80px",
          }}
        >
          <div
            style={{
              borderRadius: "20px",
              border: "1px solid rgba(148,163,184,0.1)",
              background: "rgba(15,23,42,0.5)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              padding: "32px 40px",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            }}
          >
            {[
              { value: 1200, suffix: "+", label: "Active Students" },
              { value: 98, suffix: "%", label: "Delivery Rate" },
              { value: 300, suffix: "+", label: "Announcements Sent" },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  padding: "8px 24px",
                  borderRight:
                    i < 2 ? "1px solid rgba(148,163,184,0.1)" : "none",
                }}
              >
                <div
                  className="grad-text-subtle"
                  style={{
                    fontSize: "2.4rem",
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    marginBottom: "6px",
                  }}
                >
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div
                  style={{
                    color: "#475569",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════
            FEATURE GRID
        ══════════════════════════════════ */}
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px 120px",
          }}
        >
          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <p
              style={{
                textTransform: "uppercase",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                color: "#6366f1",
                fontWeight: 700,
                marginBottom: "14px",
              }}
            >
              Platform Capabilities
            </p>
            <h2
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#f1f5f9",
                lineHeight: 1.1,
              }}
            >
              Everything you need,{" "}
              <span className="grad-text">nothing you don't.</span>
            </h2>
          </div>

          {/* Cards */}
          <div
            className="features-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            {features.map((feat, i) => (
              <div
                key={i}
                className="feature-card"
                style={{
                  borderRadius: "20px",
                  border: "1px solid rgba(148,163,184,0.1)",
                  background: "rgba(15,23,42,0.55)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  padding: "32px 28px",
                  cursor: "default",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Subtle top glow */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "1px",
                    background: `linear-gradient(90deg, transparent 0%, ${feat.color}88 50%, transparent 100%)`,
                  }}
                />

                {/* Icon */}
                <div
                  className="icon-wrap"
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: feat.glow,
                    border: `1px solid ${feat.color}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: feat.color,
                    marginBottom: "22px",
                  }}
                >
                  {feat.icon}
                </div>

                {/* Label */}
                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: "100px",
                    background: `${feat.color}18`,
                    border: `1px solid ${feat.color}33`,
                    color: feat.color,
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "14px",
                  }}
                >
                  {feat.label}
                </span>

                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#f1f5f9",
                    marginBottom: "10px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {feat.title}
                </h3>

                <p
                  style={{
                    color: "#64748b",
                    fontSize: "0.875rem",
                    lineHeight: 1.75,
                    fontWeight: 400,
                  }}
                >
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════
            BOTTOM CTA BANNER
        ══════════════════════════════════ */}
        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px 100px",
          }}
        >
          <div
            style={{
              borderRadius: "24px",
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.15) 50%, rgba(56,189,248,0.12) 100%)",
              border: "1px solid rgba(99,102,241,0.25)",
              padding: "64px 48px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 24px 80px rgba(99,102,241,0.12)",
            }}
          >
            {/* BG radial */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 65%)",
                pointerEvents: "none",
              }}
            />
            <p
              style={{
                textTransform: "uppercase",
                fontSize: "0.72rem",
                letterSpacing: "0.15em",
                color: "#a5b4fc",
                fontWeight: 700,
                marginBottom: "18px",
                position: "relative",
              }}
            >
              Ready to get started?
            </p>
            <h2
              style={{
                fontSize: "clamp(1.7rem, 4vw, 2.8rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#f8fafc",
                marginBottom: "16px",
                lineHeight: 1.1,
                position: "relative",
              }}
            >
              Join SmartCampus today.
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: "1rem",
                marginBottom: "36px",
                position: "relative",
              }}
            >
              One platform. Every announcement. Zero missed updates.
            </p>
            <Link
              to="/login"
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: "none",
                color: "#fff",
                fontFamily: "inherit",
                fontWeight: 700,
                fontSize: "1rem",
                borderRadius: "14px",
                padding: "16px 34px",
                cursor: "pointer",
                background:
                  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 55%, #a855f7 100%)",
                boxShadow:
                  "0 8px 32px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.18)",
                position: "relative",
                textDecoration: "none",
              }}
            >
              Access Your Dashboard
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════
            FOOTER
        ══════════════════════════════════ */}
        <footer
          style={{
            borderTop: "1px solid rgba(148,163,184,0.08)",
            padding: "28px 24px",
            textAlign: "center",
          }}
        >
          <span style={{ color: "#1e293b", fontSize: "0.8rem" }}>
            © 2025 SmartCampus. All rights reserved.
          </span>
        </footer>
      </main>
    </div>
  );
}