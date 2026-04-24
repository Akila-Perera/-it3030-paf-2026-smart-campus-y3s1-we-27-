import { useMemo, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import LecturerDashboard from "./pages/LecturerDashboard"; // මේවා අලුතින් එක් කළා
import StudentDashboard from "./pages/StudentDashboard";
import { clearStoredUser, getStoredUser } from "./utils/authStorage";
import "./App.css";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* ඔයා අලුතින් හදපු පේජ් වලට Routes මෙතන තියෙනවා */}
      <Route path="/lecturer-dashboard" element={<ProtectedRoute><LecturerDashboard /></ProtectedRoute>} />
      <Route path="/student-dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
      <Route path="/notifications" element={<Notifications />} />
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