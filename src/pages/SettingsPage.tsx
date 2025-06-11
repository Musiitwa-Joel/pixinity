import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Bell,
  Eye,
  Shield,
  Camera,
  Globe,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Save,
  Edit3,
  Trash2,
  AlertTriangle,
  Check,
  X,
  Upload,
  MapPin,
  Link as LinkIcon,
  Instagram,
  Twitter,
  Dribbble,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ProfileForm {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string;
  website: string;
  location: string;
  instagram: string;
  twitter: string;
  behance: string;
  dribbble: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SettingsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "profile" | "account" | "privacy" | "notifications" | "preferences"
  >("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<ProfileForm>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
      website: user?.website || "",
      location: user?.location || "",
      instagram: user?.socialLinks?.instagram || "",
      twitter: user?.socialLinks?.twitter || "",
      behance: user?.socialLinks?.behance || "",
      dribbble: user?.socialLinks?.dribbble || "",
    },
  });

  const passwordForm = useForm<PasswordForm>();

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: Shield },
    { id: "privacy", label: "Privacy", icon: Eye },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Monitor },
  ];

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formData = new FormData();
      formData.append("avatar", file);

      console.log("🚀 Uploading avatar for user:", user.id);

      const response = await fetch(
        `http://localhost:5000/api/users/${user.id}/avatar`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload avatar");
      }

      const data = await response.json();
      console.log("✅ Avatar upload successful:", data);

      toast.success("Avatar updated successfully!");

      // Refresh the page to show the new avatar
      window.location.reload();
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      toast.error(error.message || "Failed to upload avatar");
      setAvatarPreview(null);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleProfileUpdate = async (data: ProfileForm) => {
    if (!user) return;

    setIsUpdatingProfile(true);
    try {
      console.log("🔄 Updating profile for user:", user.id);

      const response = await fetch(
        `http://localhost:5000/api/users/${user.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            bio: data.bio,
            website: data.website,
            location: data.location,
            instagram: data.instagram,
            twitter: data.twitter,
            behance: data.behance,
            dribbble: data.dribbble,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      console.log("✅ Profile updated successfully");
      toast.success("Profile updated successfully!");
      setIsEditing(false);

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      console.log("🔐 Changing password...");

      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to change password");
      }

      console.log("✅ Password changed successfully");
      toast.success("Password updated successfully!");
      passwordForm.reset();
    } catch (error: any) {
      console.error("Password change error:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Access Denied
          </h2>
          <p className="text-neutral-600">Please log in to access settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Settings</h1>
          <p className="text-neutral-600">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            className="lg:w-64"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl border border-neutral-200 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-xl border border-neutral-200 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                      Profile Information
                    </h2>
                    <p className="text-neutral-600">
                      Update your personal information and profile details
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`btn ${
                      isEditing ? "btn-outline" : "btn-primary"
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit Profile
                      </>
                    )}
                  </button>
                </div>

                <form
                  onSubmit={profileForm.handleSubmit(handleProfileUpdate)}
                  className="space-y-6"
                >
                  {/* Avatar */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img
                        src={
                          avatarPreview ||
                          user?.avatar ||
                          `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=2563eb&color=ffffff&size=80`
                        }
                        alt="Profile"
                        className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      {isUploadingAvatar && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        className="btn-outline text-sm disabled:opacity-50"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        {isUploadingAvatar ? "Uploading..." : "Change Photo"}
                      </button>
                      <p className="text-xs text-neutral-500 mt-1">
                        JPG, PNG up to 5MB
                      </p>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        First Name
                      </label>
                      <input
                        {...profileForm.register("firstName", {
                          required: "First name is required",
                        })}
                        type="text"
                        disabled={!isEditing}
                        className={`input ${
                          !isEditing ? "bg-neutral-50 cursor-not-allowed" : ""
                        }`}
                      />
                      {profileForm.formState.errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileForm.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Last Name
                      </label>
                      <input
                        {...profileForm.register("lastName", {
                          required: "Last name is required",
                        })}
                        type="text"
                        disabled={!isEditing}
                        className={`input ${
                          !isEditing ? "bg-neutral-50 cursor-not-allowed" : ""
                        }`}
                      />
                      {profileForm.formState.errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileForm.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Username & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                          @
                        </span>
                        <input
                          {...profileForm.register("username", {
                            required: "Username is required",
                          })}
                          type="text"
                          disabled={true} // Username should not be editable
                          className="input pl-8 bg-neutral-50 cursor-not-allowed"
                        />
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        Username cannot be changed
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Email
                      </label>
                      <input
                        {...profileForm.register("email", {
                          required: "Email is required",
                        })}
                        type="email"
                        disabled={true} // Email should not be editable
                        className="input bg-neutral-50 cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-neutral-500">
                        Email cannot be changed
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      {...profileForm.register("bio")}
                      rows={4}
                      disabled={!isEditing}
                      className={`input resize-none ${
                        !isEditing ? "bg-neutral-50 cursor-not-allowed" : ""
                      }`}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Website & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        <LinkIcon className="inline h-4 w-4 mr-1" />
                        Website
                      </label>
                      <input
                        {...profileForm.register("website")}
                        type="url"
                        disabled={!isEditing}
                        className={`input ${
                          !isEditing ? "bg-neutral-50 cursor-not-allowed" : ""
                        }`}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        <MapPin className="inline h-4 w-4 mr-1" />
                        Location
                      </label>
                      <input
                        {...profileForm.register("location")}
                        type="text"
                        disabled={!isEditing}
                        className={`input ${
                          !isEditing ? "bg-neutral-50 cursor-not-allowed" : ""
                        }`}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                      Social Media
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          <Instagram className="inline h-4 w-4 mr-1" />
                          Instagram
                        </label>
                        <input
                          {...profileForm.register("instagram")}
                          type="text"
                          disabled={!isEditing}
                          className={`input ${
                            !isEditing ? "bg-neutral-50 cursor-not-allowed" : ""
                          }`}
                          placeholder="@username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          <Twitter className="inline h-4 w-4 mr-1" />
                          Twitter
                        </label>
                        <input
                          {...profileForm.register("twitter")}
                          type="text"
                          disabled={!isEditing}
                          className={`input ${
                            !isEditing ? "bg-neutral-50 cursor-not-allowed" : ""
                          }`}
                          placeholder="@username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Behance
                        </label>
                        <input
                          {...profileForm.register("behance")}
                          type="text"
                          disabled={!isEditing}
                          className={`input ${
                            !isEditing ? "bg-neutral-50 cursor-not-allowed" : ""
                          }`}
                          placeholder="username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          <Dribbble className="inline h-4 w-4 mr-1" />
                          Dribbble
                        </label>
                        <input
                          {...profileForm.register("dribbble")}
                          type="text"
                          disabled={!isEditing}
                          className={`input ${
                            !isEditing ? "bg-neutral-50 cursor-not-allowed" : ""
                          }`}
                          placeholder="username"
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="btn-primary disabled:opacity-50"
                      >
                        {isUpdatingProfile ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="space-y-8">
                {/* Password Change */}
                <div className="bg-white rounded-xl border border-neutral-200 p-8">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                    Change Password
                  </h2>
                  <p className="text-neutral-600 mb-6">
                    Update your password to keep your account secure
                  </p>

                  <form
                    onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Current Password
                      </label>
                      <input
                        {...passwordForm.register("currentPassword", {
                          required: "Current password is required",
                        })}
                        type="password"
                        className="input"
                        placeholder="Enter current password"
                      />
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {
                            passwordForm.formState.errors.currentPassword
                              .message
                          }
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          New Password
                        </label>
                        <input
                          {...passwordForm.register("newPassword", {
                            required: "New password is required",
                            minLength: {
                              value: 8,
                              message: "Password must be at least 8 characters",
                            },
                          })}
                          type="password"
                          className="input"
                          placeholder="Enter new password"
                        />
                        {passwordForm.formState.errors.newPassword && (
                          <p className="mt-1 text-sm text-red-600">
                            {passwordForm.formState.errors.newPassword.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          {...passwordForm.register("confirmPassword", {
                            required: "Please confirm your password",
                          })}
                          type="password"
                          className="input"
                          placeholder="Confirm new password"
                        />
                        {passwordForm.formState.errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">
                            {
                              passwordForm.formState.errors.confirmPassword
                                .message
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="btn-primary disabled:opacity-50"
                    >
                      {isChangingPassword ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Update Password
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-white rounded-xl border border-red-200 p-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                    <h2 className="text-2xl font-bold text-red-900">
                      Danger Zone
                    </h2>
                  </div>
                  <p className="text-red-600 mb-6">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>

                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="btn bg-red-500 text-white hover:bg-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </button>
                  ) : (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 mb-4 font-medium">
                        Are you absolutely sure? This action cannot be undone.
                      </p>
                      <div className="flex space-x-3">
                        <button className="btn bg-red-500 text-white hover:bg-red-600">
                          Yes, Delete My Account
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="btn-outline"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="bg-white rounded-xl border border-neutral-200 p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Privacy Settings
                </h2>
                <p className="text-neutral-600 mb-8">
                  Control who can see your content and profile information
                </p>

                <div className="space-y-6">
                  {[
                    {
                      title: "Profile Visibility",
                      description: "Make your profile visible to everyone",
                      enabled: true,
                    },
                    {
                      title: "Show in Search Results",
                      description:
                        "Allow your profile to appear in search results",
                      enabled: true,
                    },
                    {
                      title: "Allow Downloads",
                      description: "Let others download your photos",
                      enabled: false,
                    },
                    {
                      title: "Show View Count",
                      description: "Display view counts on your photos",
                      enabled: true,
                    },
                    {
                      title: "Allow Comments",
                      description: "Let others comment on your photos",
                      enabled: true,
                    },
                  ].map((setting, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium text-neutral-900">
                          {setting.title}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          {setting.description}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={setting.enabled}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-xl border border-neutral-200 p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Notification Preferences
                </h2>
                <p className="text-neutral-600 mb-8">
                  Choose what notifications you want to receive
                </p>

                <div className="space-y-8">
                  {[
                    {
                      category: "Activity",
                      settings: [
                        { name: "New likes on your photos", enabled: true },
                        { name: "New comments on your photos", enabled: true },
                        { name: "New followers", enabled: true },
                        { name: "Photo downloads", enabled: false },
                      ],
                    },
                    {
                      category: "Marketing",
                      settings: [
                        { name: "Weekly newsletter", enabled: true },
                        { name: "Feature announcements", enabled: true },
                        { name: "Photography tips", enabled: false },
                        { name: "Community highlights", enabled: true },
                      ],
                    },
                    {
                      category: "Security",
                      settings: [
                        { name: "Login alerts", enabled: true },
                        { name: "Password changes", enabled: true },
                        { name: "Account changes", enabled: true },
                      ],
                    },
                  ].map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                        {category.category}
                      </h3>
                      <div className="space-y-4">
                        {category.settings.map((setting, settingIndex) => (
                          <div
                            key={settingIndex}
                            className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                          >
                            <span className="text-neutral-900">
                              {setting.name}
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                defaultChecked={setting.enabled}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="bg-white rounded-xl border border-neutral-200 p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  App Preferences
                </h2>
                <p className="text-neutral-600 mb-8">
                  Customize your app experience
                </p>

                <div className="space-y-8">
                  {/* Theme */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                      Theme
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        {
                          id: "light",
                          label: "Light",
                          icon: Sun,
                          active: true,
                        },
                        {
                          id: "dark",
                          label: "Dark",
                          icon: Moon,
                          active: false,
                        },
                        {
                          id: "system",
                          label: "System",
                          icon: Monitor,
                          active: false,
                        },
                      ].map((theme) => (
                        <label key={theme.id} className="relative">
                          <input
                            type="radio"
                            name="theme"
                            value={theme.id}
                            defaultChecked={theme.active}
                            className="sr-only"
                          />
                          <div
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                              theme.active
                                ? "border-primary-500 bg-primary-50"
                                : "border-neutral-200 hover:border-neutral-300"
                            }`}
                          >
                            <theme.icon className="h-6 w-6 text-primary-600 mb-2" />
                            <div className="font-medium text-neutral-900">
                              {theme.label}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                      Language
                    </h3>
                    <select className="input max-w-xs">
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="ja">日本語</option>
                    </select>
                  </div>

                  {/* Other Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                      Display
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          name: "Show photo metadata by default",
                          enabled: true,
                        },
                        { name: "Auto-play videos", enabled: false },
                        { name: "High quality image previews", enabled: true },
                        { name: "Infinite scroll", enabled: true },
                      ].map((setting, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                        >
                          <span className="text-neutral-900">
                            {setting.name}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked={setting.enabled}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
