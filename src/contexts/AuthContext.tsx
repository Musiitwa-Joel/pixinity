"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "../types";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = "http://localhost:5000/api";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add a small delay to ensure server is ready
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      console.log("Checking auth status...");

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include", // This is crucial for cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Auth check response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("User authenticated:", data.user.email);
        setUser({
          ...data.user,
          createdAt: new Date(data.user.createdAt),
          updatedAt: new Date(data.user.updatedAt),
        });
      } else {
        console.log("Not authenticated");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting login with:", { email, password: "***" });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This is crucial for cookies
        body: JSON.stringify({ email, password }),
      });

      console.log("Login response status:", response.status);

      const data = await response.json();

      if (!response.ok) {
        console.error("Login failed:", data.error);
        throw new Error(data.error || "Login failed");
      }

      console.log("Login successful:", data.user.email);

      setUser({
        ...data.user,
        createdAt: new Date(data.user.createdAt),
        updatedAt: new Date(data.user.updatedAt),
      });

      toast.success("Welcome back!");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting registration...");

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // This is crucial for cookies
        body: JSON.stringify({
          email: userData.email,
          username: userData.username,
          password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role || "photographer",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      console.log("Registration successful:", data.user.email);

      setUser({
        ...data.user,
        createdAt: new Date(data.user.createdAt),
        updatedAt: new Date(data.user.updatedAt),
      });

      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      // Update local user state
      const updatedUser = { ...user, ...userData, updatedAt: new Date() };
      setUser(updatedUser);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast.error(error.message || "Failed to update profile");
      throw error;
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      toast.success("Password updated successfully");
    } catch (error: any) {
      console.error("Change password error:", error);
      toast.error(error.message || "Failed to change password");
      throw error;
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(`${API_BASE_URL}/users/${user.id}/avatar`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload avatar");
      }

      // Update user avatar in local state
      setUser((prev) => (prev ? { ...prev, avatar: data.avatarUrl } : null));

      toast.success("Avatar updated successfully");
      return data.avatarUrl;
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      toast.error(error.message || "Failed to upload avatar");
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    uploadAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
