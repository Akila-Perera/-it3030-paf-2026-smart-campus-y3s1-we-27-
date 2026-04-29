import { useMemo, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import LecturerDashboard from "./pages/LecturerDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import { clearStoredUser, getStoredUser } from "./utils/authStorage";
import "./App.css";

// Import Your Ticket Pages
import TicketsPage from "./pages/TicketsPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import TicketAdminDashboard from "./pages/TicketAdminDashboard";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/notifications" element={<Notifications />} />

      {/* Protected Routes */}
      <Route
        path="/admindashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Friend's Dashboard Routes */}
      <Route 
        path="/lecturer-dashboard" 
        element={
          <ProtectedRoute>
            <LecturerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student-dashboard" 
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />

      {/* ========== YOUR TICKET ROUTES ========== */}
      <Route 
        path="/tickets" 
        element={
          <ProtectedRoute>
            <TicketsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tickets/create" 
        element={
          <ProtectedRoute>
            <CreateTicketPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tickets/:ticketId" 
        element={
          <ProtectedRoute>
            <TicketDetailPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ticket-admin" 
        element={
          <ProtectedRoute>
            <TicketAdminDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getStoredUser());
  const [user, setUser] = useState(() => getStoredUser());

  const authValue = useMemo(
    () => ({
      isLoggedIn,
      user,
      login: () => {
        const next = getStoredUser();
        setUser(next);
        setIsLoggedIn(!!next);
      },
      logout: () => {
        clearStoredUser();
        setUser(null);
        setIsLoggedIn(false);
      },
    }),
    [isLoggedIn, user]
  );

  return (
    <GoogleOAuthProvider clientId="849178226571-3behe1ehkvqn6et463dbps5ttp2mkojr.apps.googleusercontent.com">
      <AuthContext.Provider value={authValue}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default App;