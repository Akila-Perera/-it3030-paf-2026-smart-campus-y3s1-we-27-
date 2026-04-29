import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, LayoutDashboard, LogOut, Ticket } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getStoredUser } from "../utils/authStorage";
import { DASHBOARD_STYLES } from "../styles/dashboardStyles";
import ResourceAdminPanel from "../components/ResourceAdminPanel";
import AdminBookingPanel from "../components/AdminBookingPanel";
import TicketAdminDashboard from "../pages/TicketAdminDashboard";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const stored = getStoredUser();
  const isAdmin = stored?.role === "ADMIN";

  const [active, setActive] = useState("resources");

  useEffect(() => {
    const el = document.createElement("style");
    el.innerText = DASHBOARD_STYLES;
    document.head.appendChild(el);
    return () => {
      if (document.head.contains(el)) document.head.removeChild(el);
    };
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAdmin, navigate]);

  const title = useMemo(() => {
    if (active === "resources") return "Admin Dashboard · Resources";
    if (active === "bookings") return "Admin Dashboard · Booking Requests";
    if (active === "tickets") return "Admin Dashboard · Ticket Analytics";
    return "Admin Dashboard";
  }, [active]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
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
            ADMIN <span style={{ color: "#a78bfa" }}>PANEL</span>
          </span>
        </div>

        <nav style={{ flex: 1 }}>
          <div
            className={`sc-nav-item ${active === "resources" ? "active" : ""}`}
            onClick={() => setActive("resources")}
          >
            <BookOpen size={20} color={active === "resources" ? "#a78bfa" : undefined} />
            Resources
          </div>
          <div
            className={`sc-nav-item ${active === "bookings" ? "active" : ""}`}
            onClick={() => setActive("bookings")}
          >
            <LayoutDashboard size={20} color={active === "bookings" ? "#a78bfa" : undefined} />
            Booking Requests
          </div>
          <div
            className={`sc-nav-item ${active === "tickets" ? "active" : ""}`}
            onClick={() => setActive("tickets")}
          >
            <Ticket size={20} color={active === "tickets" ? "#a78bfa" : undefined} />
            Ticket Analytics
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="sc-nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      <main className="sc-main-content">
        <header className="sc-dash-header" style={{ marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 900, margin: 0 }}>
              {title}
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "6px" }}>
              Signed in as <span style={{ color: "#c4b5fd" }}>Admin1</span>
            </p>
          </div>
        </header>

        {active === "resources" && <ResourceAdminPanel />}
        {active === "bookings" && <AdminBookingPanel />}
        {active === "tickets" && <TicketAdminDashboard />}
      </main>
    </div>
  );
}