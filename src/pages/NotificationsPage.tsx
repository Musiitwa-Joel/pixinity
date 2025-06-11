import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Heart,
  MessageCircle,
  User,
  Download,
  Trash2,
  Check,
  CheckCheck,
  Clock,
  Filter,
  Search,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  type: string;
  message: string;
  actionUrl?: string;
  read: boolean;
  actor?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    verified: boolean;
  };
  createdAt: string;
  readAt?: string;
}

const NotificationsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, filter]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter === "unread") {
        params.append("unread_only", "true");
      }

      const response = await fetch(
        `http://localhost:5000/api/notifications?${params}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setTotalCount(data.total);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (response.ok) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/notifications/mark-all-read",
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (response.ok) {
        // Update local state
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        // Update local state
        const deletedNotification = notifications.find(
          (n) => n.id === notificationId
        );
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        setTotalCount((prev) => Math.max(0, prev - 1));

        if (deletedNotification && !deletedNotification.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        toast.success("Notification deleted");
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate to the action URL if provided
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5 text-error-500" />;
      case "comment":
      case "comment_like":
        return <MessageCircle className="h-5 w-5 text-primary-500" />;
      case "follow":
        return <User className="h-5 w-5 text-green-500" />;
      case "download":
        return <Download className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-neutral-500" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
  };

  // Filter notifications based on search query
  const filteredNotifications = notifications.filter((notification) =>
    notification.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Bell className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Sign in to view notifications
          </h2>
          <p className="text-neutral-600 mb-6">
            You need to be logged in to access your notifications.
          </p>
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Bell className="h-6 w-6 text-primary-600" />
                <h1 className="text-2xl font-bold text-neutral-900">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <span className="bg-primary-100 text-primary-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <CheckCheck className="h-4 w-4" />
                  <span>Mark all as read</span>
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notifications..."
                  className="w-full pl-10 pr-4 py-2 bg-neutral-100 border-0 rounded-lg text-sm placeholder-neutral-500 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filter */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "all"
                      ? "bg-primary-500 text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "unread"
                      ? "bg-primary-500 text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  Unread
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-neutral-100">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 hover:bg-neutral-50 transition-colors ${
                    !notification.read ? "bg-primary-50" : ""
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <p
                        className={`text-sm ${
                          !notification.read
                            ? "font-medium text-neutral-900"
                            : "text-neutral-700"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {getTimeAgo(notification.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 text-primary-600 hover:text-primary-700 transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                        className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-16 text-center">
                <Bell className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                  {searchQuery
                    ? "No matching notifications"
                    : filter === "unread"
                    ? "No unread notifications"
                    : "No notifications yet"}
                </h2>
                <p className="text-neutral-600">
                  {searchQuery
                    ? "Try a different search term"
                    : filter === "unread"
                    ? "You've read all your notifications"
                    : "We'll notify you when something happens"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
