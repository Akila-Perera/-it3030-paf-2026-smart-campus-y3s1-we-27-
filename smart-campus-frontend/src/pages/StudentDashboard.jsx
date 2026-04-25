import { useState } from "react";
import DashboardNav from "../components/DashboardNav";
import BookingPanel from "../components/BookingPanel";
import Notifications from "./Notifications";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Search,
  Calendar,
  Ticket,
} from "lucide-react";

export default function StudentDashboard({ userEmail, notificationsMountKey }) {
  const [active, setActive] = useState("dashboard");

  return (
    <div className="sc-db-wrap">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <aside className="glass-sidebar">
        <div
          style={{
            padding: "0 10px",
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "35px",
              height: "35px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: "10px",
              display: "grid",
              placeItems: "center",
              fontWeight: "bold",
            }}
          >
            SC
          </div>
          <span style={{ fontSize: "1.1rem", fontWeight: 800 }}>
            SMART <span style={{ color: "#38bdf8" }}>CAMPUS</span>
          </span>
        </div>

        <nav style={{ flex: 1 }}>
          <div
            className={`sc-nav-item ${active === "dashboard" ? "active" : ""}`}
            onClick={() => setActive("dashboard")}
          >
            <LayoutDashboard size={20} color={active === "dashboard" ? "#38bdf8" : undefined} />
            Dashboard
          </div>
          <div
            className={`sc-nav-item ${active === "booking" ? "active" : ""}`}
            onClick={() => setActive("booking")}
          >
            <Calendar size={20} color={active === "booking" ? "#38bdf8" : undefined} />
            Booking
          </div>

          <div
            className="sc-nav-item"
            style={{ marginLeft: 18, paddingLeft: 14, opacity: 0.7, cursor: "default" }}
          >
            <Ticket size={18} />
            Ticket
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="sc-nav-item logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      <main className="sc-main-content">
        <header className="sc-dash-header" style={{ marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0 }}>
              Student Dashboard
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "4px" }}>
              Welcome back,{" "}
              <span style={{ color: "#7dd3fc" }}>{userEmail.split("@")[0]}</span>
            </p>
          </div>

          <div className="sc-dash-header-actions">
            <div
              className="sc-dash-search"
              style={{
                background: "rgba(15,23,42,0.5)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "12px",
                padding: "8px 16px",
              }}
            >
              <Search size={18} color="#475569" style={{ flexShrink: 0 }} />
              <input
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  outline: "none",
                  fontSize: "0.9rem",
                }}
                placeholder="Search..."
              />
            </div>
            <Bell size={22} color="#64748b" style={{ flexShrink: 0 }} />
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #0ea5e9, #f59e0b)",
                display: "grid",
                placeItems: "center",
                fontWeight: "bold",
                flexShrink: 0,
              }}
            >
              {userEmail[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        <div style={{ marginBottom: "32px" }}>
          <DashboardNav userEmail={userEmail} />
        </div>

        {active === "dashboard" ? (
          <div className="glass-card" style={{ width: "100%" }}>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              Campus Feed
            </h2>

            <Notifications key={notificationsMountKey} isLecturer={false} />
          </div>
        ) : null}

        {active === "booking" ? <BookingPanel /> : null}
      </main>
    </div>
  );
}
