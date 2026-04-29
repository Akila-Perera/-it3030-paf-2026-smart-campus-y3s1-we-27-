import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNav from "../components/DashboardNav";
import BookingPanel from "../components/BookingPanel";
import Notifications from "./Notifications";
import TicketsPage from "./TicketsPage";
import { useAuth } from "../context/AuthContext";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Search,
  Calendar,
  Ticket,
} from "lucide-react";

export default function StudentDashboard({ userEmail, notificationsMountKey }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [active, setActive] = useState("dashboard");

  const mapRole = (role) => {
    switch(role) {
      case 'STUDENT': return 'USER';
      case 'LECTURER': return 'TECHNICIAN';
      case 'ADMIN': return 'ADMIN';
      default: return 'USER';
    }
  };

  const userRole = mapRole(user?.role);
  const displayName = user?.email?.split("@")[0] || userEmail?.split("@")[0] || "Student";
  const isTechnician = userRole === 'TECHNICIAN';

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    navigate("/");
  };

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
          {/* Dashboard Button */}
          <div
            className={`sc-nav-item ${active === "dashboard" ? "active" : ""}`}
            onClick={() => setActive("dashboard")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              marginBottom: "4px",
              background: active === "dashboard" ? "rgba(56, 189, 248, 0.1)" : "transparent",
              color: active === "dashboard" ? "#38bdf8" : "#94a3b8"
            }}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>

          {/* Booking Button */}
          <div
            className={`sc-nav-item ${active === "booking" ? "active" : ""}`}
            onClick={() => setActive("booking")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              marginBottom: "4px",
              background: active === "booking" ? "rgba(56, 189, 248, 0.1)" : "transparent",
              color: active === "booking" ? "#38bdf8" : "#94a3b8"
            }}
          >
            <Calendar size={20} />
            <span>Booking</span>
          </div>

          {/* Ticket Button */}
          <div
            className={`sc-nav-item ${active === "ticket" ? "active" : ""}`}
            onClick={() => {
              console.log("Ticket button clicked");
              setActive("ticket");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              marginBottom: "4px",
              background: active === "ticket" ? "rgba(56, 189, 248, 0.1)" : "transparent",
              color: active === "ticket" ? "#38bdf8" : "#94a3b8"
            }}
          >
            <Ticket size={18} />
            <span>Ticket</span>
          </div>
          
          {isTechnician && (
            <div style={{ 
              marginTop: "20px", 
              padding: "8px 12px", 
              background: "rgba(56,189,248,0.1)", 
              borderRadius: "10px",
              fontSize: "12px",
              color: "#38bdf8",
              textAlign: "center"
            }}>
              🔧 Technician Mode
            </div>
          )}
        </nav>

        {/* REMOVED LOGOUT BUTTON FROM SIDEBAR - Keep only the one in DashboardNav */}
      </aside>

      <main className="sc-main-content">
        <header className="sc-dash-header" style={{ marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0 }}>
              {isTechnician ? "Technician Dashboard" : "Student Dashboard"}
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "4px" }}>
              Welcome back,{" "}
              <span style={{ color: "#7dd3fc" }}>{displayName}</span>
              {isTechnician && (
                <span style={{ 
                  marginLeft: "10px", 
                  background: "#3b82f6", 
                  padding: "2px 8px", 
                  borderRadius: "20px",
                  fontSize: "11px",
                  color: "white"
                }}>
                  Technician
                </span>
              )}
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
              {displayName?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        <div style={{ marginBottom: "32px" }}>
          <DashboardNav userEmail={user?.email || userEmail} />
        </div>

        {/* DASHBOARD VIEW */}
        {active === "dashboard" && (
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
        )}

        {/* BOOKING VIEW */}
        {active === "booking" && <BookingPanel />}

        {/* TICKET VIEW */}
        {active === "ticket" && (
          <div className="glass-card" style={{ width: "100%", padding: "20px" }}>
            <TicketsPage />
          </div>
        )}
      </main>
    </div>
  );
}