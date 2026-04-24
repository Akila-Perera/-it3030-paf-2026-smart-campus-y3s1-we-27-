import { useEffect, useState } from "react";
import NotificationCard from "./NotificationCard";
import { markAsRead } from "../services/notificationService";
import { formatNotificationRelativeTime } from "../utils/notificationTime";

export default function NotificationList({
  notifications,
  onRefetch,
  isLecturer = false,
}) {
  const [visibleNotifications, setVisibleNotifications] = useState(notifications);

  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    await onRefetch();
  };

  /** NotificationCard calls the API; we only refresh list state from the server. */
  const handleAfterDelete = async (_id) => {
    if (typeof onRefetch === "function") {
      await onRefetch();
    }
  };

  const handleDismissLocal = (id) => {
    setVisibleNotifications((prev) =>
      prev.filter((item) => item?.id !== id && item?._id !== id)
    );
  };

  return (
    <div className="space-y-3">
      {visibleNotifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          timeLabel={formatNotificationRelativeTime(notification?.createdAt)}
          isLecturer={isLecturer}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleAfterDelete}
          onDismissLocal={handleDismissLocal}
        />
      ))}
    </div>
  );
}
