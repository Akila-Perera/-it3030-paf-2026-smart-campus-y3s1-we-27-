import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getStoredUser } from "../utils/authStorage";
import { DASHBOARD_STYLES } from "../styles/dashboardStyles";
import LecturerDashboard from "./LecturerDashboard";
import StudentDashboard from "./StudentDashboard";

export default function Dashboard() {
  // --- Core Logic ---
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listRefreshTrigger, setListRefreshTrigger] = useState(0);
  const localUser = getStoredUser();
  const isAdmin = localUser?.role === "ADMIN" || user?.role === "ADMIN";
  const userEmail = (localUser?.email || user?.email || "").toString().trim().toLowerCase();
  
  // REAL ROLE DETECTION - Based on email domain
  const isStudent = userEmail.endsWith("@my.sliit.lk");
  const isLecturer = !isStudent;
  
  const notificationsMountKey = user?.sub || user?.email || "notifications-default";

  // --- Style Injection ---
  useEffect(() => {
    const el = document.createElement("style");
    el.innerText = DASHBOARD_STYLES;
    document.head.appendChild(el);
    return () => { if(document.head.contains(el)) document.head.removeChild(el); };
  }, []);

  useEffect(() => {
    if (isAdmin) {
      navigate("/admindashboard", { replace: true });
    }
  }, [isAdmin, navigate]);

  return (
    isLecturer ? (
      <LecturerDashboard
        userEmail={userEmail}
        notificationsMountKey={notificationsMountKey}
        listRefreshTrigger={listRefreshTrigger}
        onNotificationSent={() => setListRefreshTrigger((n) => n + 1)}
      />
    ) : (
      <StudentDashboard
        userEmail={userEmail}
        notificationsMountKey={notificationsMountKey}
      />
    )
  );
}