import type React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Camera,
  Search,
  User,
  Bell,
  Upload,
  Menu,
  X,
  LogOut,
  Settings,
  BarChart3,
  Bookmark,
  Grid3X3,
  Globe,
  ChevronDown,
  Image,
  Check,
  Heart,
  MessageCircle,
  Download,
  Clock,
  Trash2,
  Shield,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";
import toast from "react-hot-toast";

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { openUploadModal } = useApp();
  const navigate = useNavigate();
  const { language: selectedLanguage, setLanguage } = useLanguage();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  // Check if user is admin - either super admin by email or admin by role
  const isAdmin =
    user?.email === "musiitwajoel@gmail.com" || user?.role === "admin";

  // Fetch notifications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  // Fetch notifications when notification panel is opened
  useEffect(() => {
    if (isNotificationsOpen && isAuthenticated) {
      fetchNotifications();
    }
  }, [isNotificationsOpen]);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;

    setIsLoadingNotifications(true);
    try {
      const response = await fetch("http://localhost:5000/api/notifications", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoadingNotifications(false);
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

        if (deletedNotification && !deletedNotification.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any);
    setIsLanguageMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate to the action URL if provided
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setIsNotificationsOpen(false);
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

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Camera className="h-8 w-8 text-primary-600 group-hover:text-primary-700 transition-colors" />
              <div className="absolute -inset-1 bg-primary-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur" />
            </div>
            <span className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
              Pixinity
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search high-resolution photos"
                  className="w-full pl-10 pr-4 py-2 bg-neutral-100 border-0 rounded-full text-sm placeholder-neutral-500 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
                />
              </div>
            </form>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/explore"
              className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors"
            >
              Explore
            </Link>
            <Link
              to="/collections"
              className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors"
            >
              Collections
            </Link>

            {/* Language Selector */}
            <div className="relative ml-4">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors rounded-lg hover:bg-neutral-50"
              >
                <Globe className="h-4 w-4" />
                <span>
                  {
                    languages.find((lang) => lang.code === selectedLanguage)
                      ?.flag
                  }
                </span>
                <span className="hidden sm:inline">
                  {languages
                    .find((lang) => lang.code === selectedLanguage)
                    ?.code.toUpperCase()}
                </span>
                <ChevronDown className="h-3 w-3" />
              </button>

              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50"
                  >
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`flex items-center space-x-3 px-4 py-2 text-sm w-full text-left hover:bg-neutral-50 transition-colors ${
                          selectedLanguage === language.code
                            ? "bg-primary-50 text-primary-600"
                            : "text-neutral-700"
                        }`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <span>{language.name}</span>
                        {selectedLanguage === language.code && (
                          <div className="ml-auto w-2 h-2 bg-primary-600 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2 ml-4">
                {/* Admin Button - Only show for admin users */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 px-3 py-2 text-sm font-medium bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* Upload Button */}
                <button
                  onClick={openUploadModal}
                  className="btn-primary flex items-center space-x-2 text-sm"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-2 text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-error-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Panel */}
                  <AnimatePresence>
                    {isNotificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden z-50"
                      >
                        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
                          <h3 className="font-semibold text-neutral-900">
                            Notifications
                          </h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllAsRead}
                              className="text-xs text-primary-600 hover:text-primary-700 transition-colors"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                          {isLoadingNotifications ? (
                            <div className="flex justify-center items-center py-8">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                            </div>
                          ) : notifications.length > 0 ? (
                            <div>
                              {notifications.map((notification) => (
                                <div
                                  key={notification.id}
                                  className={`p-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors cursor-pointer ${
                                    !notification.read ? "bg-primary-50" : ""
                                  }`}
                                  onClick={() =>
                                    handleNotificationClick(notification)
                                  }
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 mt-1">
                                      {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
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
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteNotification(
                                          notification.id
                                        );
                                      }}
                                      className="text-neutral-400 hover:text-neutral-600 transition-colors"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="py-12 text-center">
                              <Bell className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                              <p className="text-neutral-500">
                                No notifications yet
                              </p>
                              <p className="text-sm text-neutral-400">
                                We'll notify you when something happens
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-neutral-100 transition-colors"
                  >
                    <img
                      src={
                        user?.avatar ||
                        `https://ui-avatars.com/api/?name=${
                          user?.firstName || "/placeholder.svg"
                        }+${user?.lastName}&background=2563eb&color=ffffff`
                      }
                      alt={`${user?.firstName} ${user?.lastName}`}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </button>

                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 py-2"
                      >
                        <div className="px-4 py-3 border-b border-neutral-100">
                          <p className="text-sm font-medium text-neutral-900">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-neutral-500">
                            @{user?.username}
                          </p>
                        </div>

                        <div className="py-1">
                          <Link
                            to={`/@${user?.username}`}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                          <Link
                            to="/dashboard"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <BarChart3 className="h-4 w-4" />
                            <span>Analytics</span>
                          </Link>
                          <Link
                            to="/collections"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <Grid3X3 className="h-4 w-4" />
                            <span>Collections</span>
                          </Link>
                          <Link
                            to="/my-uploads"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <Image className="h-4 w-4" />
                            <span>My Uploads</span>
                          </Link>
                          <Link
                            to="/saved"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <Bookmark className="h-4 w-4" />
                            <span>Saved</span>
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                          </Link>

                          {/* Admin Link - Only show for admin users */}
                          {isAdmin && (
                            <Link
                              to="/admin"
                              className="flex items-center space-x-3 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              <Shield className="h-4 w-4" />
                              <span>Admin Panel</span>
                            </Link>
                          )}
                        </div>

                        <div className="border-t border-neutral-100 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-error-600 hover:bg-error-50 w-full text-left"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors"
                >
                  Log in
                </Link>
                <Link to="/signup" className="btn-primary text-sm">
                  Join free
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-neutral-600 hover:text-primary-600 transition-colors"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search photos"
              className="w-full pl-10 pr-4 py-2 bg-neutral-100 border-0 rounded-full text-sm placeholder-neutral-500 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
            />
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-neutral-200"
          >
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/explore"
                className="block py-2 text-sm font-medium text-neutral-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>
              <Link
                to="/collections"
                className="block py-2 text-sm font-medium text-neutral-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Collections
              </Link>

              {/* Admin Link - Only show for admin users */}
              {isAuthenticated && isAdmin && (
                <Link
                  to="/admin"
                  className="block py-2 text-sm font-medium text-purple-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}

              {/* Language Selector - Mobile */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="flex items-center justify-between w-full py-2 text-sm font-medium text-neutral-700"
                >
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>
                      {
                        languages.find((lang) => lang.code === selectedLanguage)
                          ?.flag
                      }
                    </span>
                    <span>Language</span>
                  </div>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {isLanguageMenuOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          handleLanguageChange(language.code);
                          setIsMenuOpen(false);
                        }}
                        className={`flex items-center space-x-3 py-1 text-sm w-full text-left ${
                          selectedLanguage === language.code
                            ? "text-primary-600 font-medium"
                            : "text-neutral-600"
                        }`}
                      >
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isAuthenticated ? (
                <div className="space-y-3 pt-3 border-t border-neutral-200">
                  <button
                    onClick={() => {
                      openUploadModal();
                      setIsMenuOpen(false);
                    }}
                    className="btn-primary w-full justify-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </button>
                  <Link
                    to={`/@${user?.username}`}
                    className="block py-2 text-sm font-medium text-neutral-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block py-2 text-sm font-medium text-neutral-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Analytics
                  </Link>
                  <Link
                    to="/my-uploads"
                    className="block py-2 text-sm font-medium text-neutral-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Uploads
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block py-2 text-sm font-medium text-error-600 text-left"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-3 border-t border-neutral-200">
                  <Link
                    to="/login"
                    className="btn-outline w-full justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary w-full justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Join free
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
