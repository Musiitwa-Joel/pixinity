import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Home,
  Mail,
  FileText,
  Settings,
  Shield,
  LogOut,
  BarChart2,
  Heart,
  Download,
  Eye,
  Calendar,
  Camera,
  MessageCircle,
  Send,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Image,
  RefreshCw,
  Briefcase,
  Award,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPhotos: 0,
    totalCollections: 0,
    totalViews: 0,
    totalLikes: 0,
    totalDownloads: 0,
    newUsersToday: 0,
    newPhotosToday: 0,
    pendingReports: 0,
    activeUsers: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentPhotos, setRecentPhotos] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching dashboard data...");

      // Fetch dashboard stats
      const statsResponse = await fetch(
        "http://localhost:5000/api/admin/stats",
        {
          credentials: "include",
        }
      );

      if (!statsResponse.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const statsData = await statsResponse.json();
      console.log("Stats data:", statsData);
      setStats(statsData);

      // Fetch recent users
      const usersResponse = await fetch(
        "http://localhost:5000/api/admin/recent-users",
        {
          credentials: "include",
        }
      );

      if (!usersResponse.ok) {
        throw new Error("Failed to fetch recent users");
      }

      const usersData = await usersResponse.json();
      console.log("Recent users:", usersData);
      setRecentUsers(usersData);

      // Fetch recent photos
      const photosResponse = await fetch(
        "http://localhost:5000/api/admin/recent-photos",
        {
          credentials: "include",
        }
      );

      if (!photosResponse.ok) {
        throw new Error("Failed to fetch recent photos");
      }

      const photosData = await photosResponse.json();
      console.log("Recent photos:", photosData);
      setRecentPhotos(photosData);

      // Fetch recent activity
      const activityResponse = await fetch(
        "http://localhost:5000/api/admin/recent-activity",
        {
          credentials: "include",
        }
      );

      if (!activityResponse.ok) {
        throw new Error("Failed to fetch recent activity");
      }

      const activityData = await activityResponse.json();
      console.log("Recent activity:", activityData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      // Fallback to using the database information to create realistic stats
      fallbackToLocalData();
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fallbackToLocalData = async () => {
    try {
      console.log("Using fallback method to fetch data...");

      // Fetch users count from database
      const usersResponse = await fetch(
        "http://localhost:5000/api/admin/users/count",
        {
          credentials: "include",
        }
      );

      let totalUsers = 0;
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        totalUsers = usersData.count;
      }

      // Fetch photos count from database
      const photosResponse = await fetch(
        "http://localhost:5000/api/admin/photos/count",
        {
          credentials: "include",
        }
      );

      let totalPhotos = 0;
      if (photosResponse.ok) {
        const photosData = await photosResponse.json();
        totalPhotos = photosData.count;
      }

      // Fetch collections count from database
      const collectionsResponse = await fetch(
        "http://localhost:5000/api/admin/collections/count",
        {
          credentials: "include",
        }
      );

      let totalCollections = 0;
      if (collectionsResponse.ok) {
        const collectionsData = await collectionsResponse.json();
        totalCollections = collectionsData.count;
      }

      // Fetch views, likes, and downloads counts
      const statsResponse = await fetch(
        "http://localhost:5000/api/admin/photos/stats",
        {
          credentials: "include",
        }
      );

      let totalViews = 0;
      let totalLikes = 0;
      let totalDownloads = 0;

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        totalViews = statsData.totalViews;
        totalLikes = statsData.totalLikes;
        totalDownloads = statsData.totalDownloads;
      }

      // Calculate new users today
      const newUsersResponse = await fetch(
        "http://localhost:5000/api/admin/users/new-today",
        {
          credentials: "include",
        }
      );

      let newUsersToday = 0;
      if (newUsersResponse.ok) {
        const newUsersData = await newUsersResponse.json();
        newUsersToday = newUsersData.count;
      }

      // Calculate new photos today
      const newPhotosResponse = await fetch(
        "http://localhost:5000/api/admin/photos/new-today",
        {
          credentials: "include",
        }
      );

      let newPhotosToday = 0;
      if (newPhotosResponse.ok) {
        const newPhotosData = await newPhotosResponse.json();
        newPhotosToday = newPhotosData.count;
      }

      // Calculate active users
      const activeUsersResponse = await fetch(
        "http://localhost:5000/api/admin/users/active",
        {
          credentials: "include",
        }
      );

      let activeUsers = 0;
      if (activeUsersResponse.ok) {
        const activeUsersData = await activeUsersResponse.json();
        activeUsers = activeUsersData.count;
      }

      setStats({
        totalUsers,
        totalPhotos,
        totalCollections,
        totalViews,
        totalLikes,
        totalDownloads,
        newUsersToday,
        newPhotosToday,
        pendingReports: 0,
        activeUsers,
      });

      // Fetch recent users
      const recentUsersResponse = await fetch(
        "http://localhost:5000/api/admin/users/recent",
        {
          credentials: "include",
        }
      );

      if (recentUsersResponse.ok) {
        const recentUsersData = await recentUsersResponse.json();
        setRecentUsers(recentUsersData);
      }

      // Fetch recent photos
      const recentPhotosResponse = await fetch(
        "http://localhost:5000/api/admin/photos/recent",
        {
          credentials: "include",
        }
      );

      if (recentPhotosResponse.ok) {
        const recentPhotosData = await recentPhotosResponse.json();
        setRecentPhotos(recentPhotosData);
      }

      // Fetch recent activity
      const recentActivityResponse = await fetch(
        "http://localhost:5000/api/admin/activity/recent",
        {
          credentials: "include",
        }
      );

      if (recentActivityResponse.ok) {
        const recentActivityData = await recentActivityResponse.json();
        setRecentActivity(recentActivityData);
      }
    } catch (error) {
      console.error("Fallback data loading failed:", error);
      toast.error("Failed to load dashboard data");
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
  };

  const displayStats = isLoading
    ? {
        totalUsers: 0,
        totalPhotos: 0,
        totalCollections: 0,
        totalViews: 0,
        totalLikes: 0,
        totalDownloads: 0,
        newUsersToday: 0,
        newPhotosToday: 0,
        pendingReports: 0,
        activeUsers: 0,
      }
    : stats;

  const displayUsers = recentUsers;
  const displayPhotos = recentPhotos;

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-neutral-600">
            Overview of your platform's performance and activity
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="btn-outline flex items-center space-x-2"
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span>{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Users",
            value: displayStats.totalUsers,
            icon: Users,
            color: "text-blue-500",
            bgColor: "bg-blue-100",
          },
          {
            title: "Total Photos",
            value: displayStats.totalPhotos,
            icon: Image,
            color: "text-purple-500",
            bgColor: "bg-purple-100",
          },
          {
            title: "Total Collections",
            value: displayStats.totalCollections,
            icon: FileText,
            color: "text-indigo-500",
            bgColor: "bg-indigo-100",
          },
          {
            title: "Total Views",
            value: displayStats.totalViews,
            icon: Eye,
            color: "text-green-500",
            bgColor: "bg-green-100",
          },
          {
            title: "Total Likes",
            value: displayStats.totalLikes,
            icon: Heart,
            color: "text-red-500",
            bgColor: "bg-red-100",
          },
          {
            title: "Total Downloads",
            value: displayStats.totalDownloads,
            icon: Download,
            color: "text-amber-500",
            bgColor: "bg-amber-100",
          },
          {
            title: "New Users Today",
            value: displayStats.newUsersToday,
            icon: User,
            color: "text-cyan-500",
            bgColor: "bg-cyan-100",
          },
          {
            title: "New Photos Today",
            value: displayStats.newPhotosToday,
            icon: Image,
            color: "text-emerald-500",
            bgColor: "bg-emerald-100",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-900">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-sm text-neutral-600">{stat.title}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity and Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Users */}
        <motion.div
          className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-neutral-900">
                Recent Users
              </h2>
              <button
                onClick={() => navigate("/admin/users")}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-neutral-200"></div>
                          <div className="ml-4">
                            <div className="h-4 w-24 bg-neutral-200 rounded"></div>
                            <div className="h-3 w-16 bg-neutral-200 rounded mt-2"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-16 bg-neutral-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-20 bg-neutral-200 rounded"></div>
                      </td>
                    </tr>
                  ))
                ) : displayUsers.length > 0 ? (
                  displayUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={
                                user.avatar ||
                                `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=2563eb&color=ffffff`
                              }
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-neutral-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-neutral-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "company"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-4 text-center text-neutral-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Photos */}
        <motion.div
          className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-neutral-900">
                Recent Photos
              </h2>
              <button
                onClick={() => navigate("/admin/photos")}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 animate-pulse"
                  >
                    <div className="h-16 w-16 bg-neutral-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 w-3/4 bg-neutral-200 rounded mb-2"></div>
                      <div className="h-3 w-1/2 bg-neutral-200 rounded"></div>
                    </div>
                  </div>
                ))
              ) : displayPhotos.length > 0 ? (
                displayPhotos.map((photo) => (
                  <div key={photo.id} className="flex items-center space-x-4">
                    <div className="h-16 w-16 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                      <img
                        src={photo.thumbnailUrl}
                        alt={photo.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/150";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {photo.title}
                      </p>
                      <p className="text-sm text-neutral-500">
                        by {photo.photographer.firstName}{" "}
                        {photo.photographer.lastName}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {new Date(photo.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          window.open(`/photos/${photo.id}`, "_blank")
                        }
                        className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-neutral-500">
                  No photos found
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <h2 className="text-xl font-bold text-neutral-900 mb-6">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Manage Users",
              description: "Add, edit or remove users",
              icon: Users,
              color: "text-blue-500",
              bgColor: "bg-blue-100",
              action: () => navigate("/admin/users"),
            },
            {
              title: "Edit Homepage",
              description: "Update homepage content",
              icon: Home,
              color: "text-purple-500",
              bgColor: "bg-purple-100",
              action: () => navigate("/admin/homepage"),
            },
            {
              title: "Manage Blog",
              description: "Create and edit blog posts",
              icon: FileText,
              color: "text-green-500",
              bgColor: "bg-green-100",
              action: () => navigate("/admin/blog"),
            },
            {
              title: "Contact Messages",
              description: "View and respond to messages",
              icon: Mail,
              color: "text-amber-500",
              bgColor: "bg-amber-100",
              action: () => navigate("/admin/contact"),
            },
            {
              title: "Manage Photographers",
              description: "Feature and verify photographers",
              icon: Camera,
              color: "text-indigo-500",
              bgColor: "bg-indigo-100",
              action: () => navigate("/admin/photographers"),
            },
            {
              title: "Photo Challenges",
              description: "Create and manage challenges",
              icon: Award,
              color: "text-pink-500",
              bgColor: "bg-pink-100",
              action: () => navigate("/admin/challenges"),
            },
            {
              title: "Career Postings",
              description: "Manage job listings",
              icon: Briefcase,
              color: "text-teal-500",
              bgColor: "bg-teal-100",
              action: () => navigate("/admin/careers"),
            },
            {
              title: "System Settings",
              description: "Configure system preferences",
              icon: Settings,
              color: "text-gray-500",
              bgColor: "bg-gray-100",
              action: () => navigate("/admin/settings"),
            },
          ].map((action, index) => (
            <motion.button
              key={action.title}
              onClick={action.action}
              className="flex flex-col items-start p-6 bg-white border border-neutral-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <div className={`p-3 rounded-lg ${action.bgColor} mb-4`}>
                <action.icon className={`h-6 w-6 ${action.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-neutral-600">{action.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* System Status */}
      <motion.div
        className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <h2 className="text-xl font-bold text-neutral-900 mb-6">
          System Status
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold text-green-800">
                All Systems Operational
              </h3>
            </div>
            <p className="text-sm text-green-700">
              All services are running normally.
            </p>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <RefreshCw className="h-5 w-5 text-neutral-500" />
              <h3 className="font-semibold text-neutral-800">Last Backup</h3>
            </div>
            <p className="text-sm text-neutral-700">
              {new Date().toLocaleDateString()} at{" "}
              {new Date().toLocaleTimeString()}
            </p>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Users className="h-5 w-5 text-neutral-500" />
              <h3 className="font-semibold text-neutral-800">Active Users</h3>
            </div>
            <p className="text-sm text-neutral-700">
              {displayStats.activeUsers} users online now
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
