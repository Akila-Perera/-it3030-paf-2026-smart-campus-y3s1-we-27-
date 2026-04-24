import DashboardNav from "../components/DashboardNav";
import NotificationForm from "../components/NotificationForm";
import Notifications from "./Notifications";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Search,
  Settings,
} from "lucide-react";

export default function LecturerDashboard({
  userEmail,
  notificationsMountKey,
  listRefreshTrigger,
  onNotificationSent,
}) {
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
            SMART <span style={{ color: "#6366f1" }}>CAMPUS</span>
          </span>
        </div>

        <nav style={{ flex: 1 }}>
          <div className="sc-nav-item active">
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div className="sc-nav-item">
            <Megaphone size={20} /> Announcements
          </div>
          <div className="sc-nav-item">
            <Settings size={20} /> Settings
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
              Dashboard
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "4px" }}>
              Welcome back,{" "}
              <span style={{ color: "#94a3b8" }}>{userEmail.split("@")[0]}</span>
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
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
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

        <div className="sc-dashboard-grid">
          <div className="glass-card">
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
              <Megaphone size={20} color="#6366f1" />
              Campus Feed
            </h2>

            <Notifications
              key={notificationsMountKey}
              isLecturer={true}
              refreshTrigger={listRefreshTrigger}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div
              className="glass-card"
              style={{ border: "1px solid rgba(99,102,241,0.2)" }}
            >
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "20px" }}>
                New Notification
              </h3>
              <NotificationForm onNotificationSent={onNotificationSent} />
            </div>

            <div className="glass-card" style={{ padding: "20px" }}>
              <h4
                style={{
                  fontSize: "0.85rem",
                  color: "#64748b",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                Support
              </h4>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: 0 }}>
                Contact admin for help.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
