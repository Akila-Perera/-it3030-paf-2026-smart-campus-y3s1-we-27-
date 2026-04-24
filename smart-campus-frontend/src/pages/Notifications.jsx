import { useCallback, useEffect, useState } from "react";
import NotificationList from "../components/NotificationList";
import { getAllNotifications } from "../services/notificationService";

function sortNotificationsNewestFirst(list) {
  return [...list].sort((a, b) => {
    const ta = new Date(a?.createdAt ?? 0).getTime();
    const tb = new Date(b?.createdAt ?? 0).getTime();
    return tb - ta;
  });
}

export default function Notifications({ refreshTrigger = 0, isLecturer = false }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = useCallback(async () => {
    setError("");
    const data = await getAllNotifications();
    const list = Array.isArray(data) ? data : [];
    setNotifications(sortNotificationsNewestFirst(list));
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        await fetchNotifications();
      } catch (err) {
        setError("Failed to load notifications.");
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fetchNotifications]);

  useEffect(() => {
    if (refreshTrigger === 0) return;
    const refetch = async () => {
      try {
        await fetchNotifications();
      } catch (err) {
        console.error("Error refreshing notifications after send:", err);
      }
    };
    refetch();
  }, [refreshTrigger, fetchNotifications]);

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-2xl font-bold text-slate-800">
        Your Notifications
      </h1>

      {loading && <p className="text-slate-600">Loading notifications...</p>}

      {!loading && error && <p className="text-red-600">{error}</p>}

      {!loading && !error && notifications.length === 0 && (
        <p className="text-slate-600">No notifications found.</p>
      )}

      {!loading && !error && notifications.length > 0 && (
        <NotificationList
          notifications={notifications}
          isLecturer={isLecturer}
          onRefetch={fetchNotifications}
        />
      )}
    </div>
  );
}
