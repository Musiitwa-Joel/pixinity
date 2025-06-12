import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Routes, Route } from "react-router-dom";
import {
  Users,
  Home,
  Mail,
  FileText,
  Settings,
  Shield,
  LogOut,
  BarChart2,
  CameraIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

// Admin components
import AdminDashboard from "../components/Admin/AdminDashboard";
import AdminUsers from "../components/Admin/AdminUsers";
import AdminHomepage from "../components/Admin/AdminHomepage";
import AdminContact from "../components/Admin/AdminContact";
import AdminBlog from "../components/Admin/AdminBlog";
import AdminPhotographers from "../components/Admin/AdminPhotographers";
import AdminSettings from "../components/Admin/AdminSettings";
import AdminChallenges from "../components/Admin/AdminChallenges";
import AdminCommunity from "../components/Admin/AdminCommunity";
import AdminAbout from "../components/Admin/AdminAbout";
import AdminCareers from "../components/Admin/AdminCareers";
import AdminPress from "../components/Admin/AdminPress";
import AdminAPI from "../components/Admin/AdminAPI";
import AdminHelpCenter from "../components/Admin/AdminHelpCenter";

const AdminPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Check if user is an admin
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);

        // Check if the user is an admin - either by email or role
        // The super admin is musiitwajoel@gmail.com
        // Other admins have the role "admin"
        console.log(
          "Checking admin status for:",
          user?.email,
          "with role:",
          user?.role
        );

        if (
          user?.email === "musiitwajoel@gmail.com" ||
          user?.role === "admin"
        ) {
          console.log(
            "Admin access granted for:",
            user?.email,
            "with role:",
            user?.role
          );
          setIsAdmin(true);
        } else {
          console.log(
            "Admin access denied for:",
            user?.email,
            "with role:",
            user?.role
          );
          toast.error("You don't have permission to access the admin panel");
          navigate("/");
        }
      } catch (error) {
        console.error("Admin check error:", error);
        toast.error("You don't have permission to access the admin panel");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, navigate, user]);

  // Admin navigation items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart2, path: "" },
    { id: "users", label: "Users", icon: Users, path: "users" },
    { id: "homepage", label: "Homepage", icon: Home, path: "homepage" },
    { id: "contact", label: "Contact", icon: Mail, path: "contact" },
    { id: "blog", label: "Blog", icon: FileText, path: "blog" },
    {
      id: "photographers",
      label: "Photographers",
      icon: CameraIcon,
      path: "photographers",
    },
    {
      id: "challenges",
      label: "Challenges",
      icon: CameraIcon,
      path: "challenges",
    },

    {
      id: "admin_community",
      label: "Community",
      icon: CameraIcon,
      path: "admin_community",
    },
    {
      id: "admin_about",
      label: "About Page",
      icon: CameraIcon,
      path: "admin_about",
    },
    {
      id: "admin_careers",
      label: "Careers",
      icon: CameraIcon,
      path: "admin_careers",
    },
    {
      id: "press",
      label: "Press",
      icon: CameraIcon,
      path: "press",
    },
    {
      id: "api",
      label: "API",
      icon: CameraIcon,
      path: "api",
    },
    {
      id: "help",
      label: "Help Center",
      icon: CameraIcon,
      path: "help",
    },

    { id: "settings", label: "Settings", icon: Settings, path: "settings" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-neutral-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-neutral-200 flex flex-col">
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Shield className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="font-bold text-neutral-900">Admin Panel</h2>
              <p className="text-sm text-neutral-500">Pixinity Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    navigate(`/admin/${item.path}`);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-primary-50 text-primary-600"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      activeTab === item.id
                        ? "text-primary-600"
                        : "text-neutral-400"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-lg">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=2563eb&color=ffffff`
              }
              alt={`${user?.firstName} ${user?.lastName}`}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-neutral-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Exit Admin</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/homepage" element={<AdminHomepage />} />
            <Route path="/contact" element={<AdminContact />} />
            <Route path="/blog" element={<AdminBlog />} />
            <Route path="/photographers" element={<AdminPhotographers />} />
            <Route path="/challenges" element={<AdminChallenges />} />
            <Route path="/admin_community" element={<AdminCommunity />} />
            <Route path="/admin_about" element={<AdminAbout />} />
            <Route path="/admin_careers" element={<AdminCareers />} />
            <Route path="/press" element={<AdminPress />} />
            <Route path="/api" element={<AdminAPI />} />
            <Route path="/help" element={<AdminHelpCenter />} />
            <Route path="/settings" element={<AdminSettings />} />
            <Route path="*" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
