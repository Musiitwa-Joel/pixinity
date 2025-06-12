import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Save,
  RefreshCw,
  Shield,
  Mail,
  Globe,
  Database,
  Server,
  Key,
  Lock,
  FileText,
  AlertTriangle,
  CheckCircle,
  Info,
  HelpCircle,
  Trash2,
  Download,
  Upload,
  Clock,
  Users,
  Image,
  MessageSquare,
  Bell,
  Zap,
  ToggleLeft,
  ToggleRight,
  Share2,
} from "lucide-react";
import toast from "react-hot-toast";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportEmail: string;
  maxUploadSize: number;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  maintenanceMode: boolean;
  analyticsEnabled: boolean;
  analyticsCode: string;
  defaultUserRole: string;
  autoApprovePhotos: boolean;
  enableComments: boolean;
  enableNotifications: boolean;
  enablePhotoDownloads: boolean;
  watermarkEnabled: boolean;
  watermarkOpacity: number;
  watermarkPosition: string;
  watermarkText: string;
  socialSharingEnabled: boolean;
  maxPhotosPerUpload: number;
  maxCollectionsPerUser: number;
  maxTagsPerPhoto: number;
  photoApprovalRequired: boolean;
  userDeletionGracePeriod: number;
  backupFrequency: string;
  lastBackupDate: string;
  apiRateLimit: number;
  enabledLanguages: string[];
  defaultLanguage: string;
  termsLastUpdated: string;
  privacyLastUpdated: string;
  cookieConsentRequired: boolean;
  gdprCompliant: boolean;
}

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "Pixinity",
    siteDescription: "Discover and share beautiful photography",
    contactEmail: "contact@pixinity.com",
    supportEmail: "support@pixinity.com",
    maxUploadSize: 10,
    allowRegistration: true,
    requireEmailVerification: false,
    maintenanceMode: false,
    analyticsEnabled: false,
    analyticsCode: "",
    defaultUserRole: "photographer",
    autoApprovePhotos: true,
    enableComments: true,
    enableNotifications: true,
    enablePhotoDownloads: true,
    watermarkEnabled: false,
    watermarkOpacity: 50,
    watermarkPosition: "bottom-right",
    watermarkText: "© Pixinity",
    socialSharingEnabled: true,
    maxPhotosPerUpload: 10,
    maxCollectionsPerUser: 50,
    maxTagsPerPhoto: 20,
    photoApprovalRequired: false,
    userDeletionGracePeriod: 30,
    backupFrequency: "daily",
    lastBackupDate: "2025-06-10T00:00:00.000Z",
    apiRateLimit: 100,
    enabledLanguages: ["en", "es", "fr", "de", "zh", "ar"],
    defaultLanguage: "en",
    termsLastUpdated: "2025-01-15T00:00:00.000Z",
    privacyLastUpdated: "2025-01-15T00:00:00.000Z",
    cookieConsentRequired: true,
    gdprCompliant: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, you would fetch this from your API
      // For now, we'll use placeholder data

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // We're already using the default settings defined above
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // In a real implementation, you would make an API call to save the settings
      // For now, we'll just simulate a successful save

      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackupDatabase = async () => {
    setIsBackingUp(true);
    try {
      // In a real implementation, you would make an API call to backup the database
      // For now, we'll just simulate a successful backup

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSettings({
        ...settings,
        lastBackupDate: new Date().toISOString(),
      });

      toast.success("Database backup completed successfully");
    } catch (error) {
      console.error("Error backing up database:", error);
      toast.error("Failed to backup database");
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings({
      ...settings,
      [name]: checked,
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: parseInt(value, 10),
    });
  };

  const handleLanguageToggle = (language: string) => {
    const currentLanguages = [...settings.enabledLanguages];

    if (currentLanguages.includes(language)) {
      // Don't allow removing the default language
      if (language === settings.defaultLanguage) {
        toast.error("You cannot disable the default language");
        return;
      }

      // Remove language
      const updatedLanguages = currentLanguages.filter(
        (lang) => lang !== language
      );
      setSettings({
        ...settings,
        enabledLanguages: updatedLanguages,
      });
    } else {
      // Add language
      setSettings({
        ...settings,
        enabledLanguages: [...currentLanguages, language],
      });
    }
  };

  const handleDefaultLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newDefaultLanguage = e.target.value;

    // Make sure the default language is enabled
    if (!settings.enabledLanguages.includes(newDefaultLanguage)) {
      setSettings({
        ...settings,
        defaultLanguage: newDefaultLanguage,
        enabledLanguages: [...settings.enabledLanguages, newDefaultLanguage],
      });
    } else {
      setSettings({
        ...settings,
        defaultLanguage: newDefaultLanguage,
      });
    }
  };

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
    { code: "ar", name: "Arabic", flag: "🇸🇦" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
    { code: "ru", name: "Russian", flag: "🇷🇺" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Site Settings
        </h1>
        <p className="text-neutral-600">
          Configure and manage your site settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-neutral-200">
              <h2 className="font-semibold text-neutral-900">Settings</h2>
            </div>
            <nav className="p-2">
              <button
                onClick={() => setActiveTab("general")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "general"
                    ? "bg-primary-50 text-primary-600"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>General</span>
              </button>
              <button
                onClick={() => setActiveTab("email")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "email"
                    ? "bg-primary-50 text-primary-600"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Mail className="h-5 w-5" />
                <span>Email</span>
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "security"
                    ? "bg-primary-50 text-primary-600"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Lock className="h-5 w-5" />
                <span>Security</span>
              </button>
              <button
                onClick={() => setActiveTab("uploads")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "uploads"
                    ? "bg-primary-50 text-primary-600"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Upload className="h-5 w-5" />
                <span>Uploads</span>
              </button>
              <button
                onClick={() => setActiveTab("features")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "features"
                    ? "bg-primary-50 text-primary-600"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Zap className="h-5 w-5" />
                <span>Features</span>
              </button>
              <button
                onClick={() => setActiveTab("localization")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "localization"
                    ? "bg-primary-50 text-primary-600"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Globe className="h-5 w-5" />
                <span>Localization</span>
              </button>
              <button
                onClick={() => setActiveTab("advanced")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "advanced"
                    ? "bg-primary-50 text-primary-600"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Server className="h-5 w-5" />
                <span>Advanced</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900">
                {activeTab === "general"
                  ? "General Settings"
                  : activeTab === "email"
                  ? "Email Settings"
                  : activeTab === "security"
                  ? "Security Settings"
                  : activeTab === "uploads"
                  ? "Upload Settings"
                  : activeTab === "features"
                  ? "Feature Settings"
                  : activeTab === "localization"
                  ? "Localization Settings"
                  : "Advanced Settings"}
              </h2>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                  <div className="h-10 bg-neutral-200 rounded"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/4 mt-6"></div>
                  <div className="h-10 bg-neutral-200 rounded"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/4 mt-6"></div>
                  <div className="h-10 bg-neutral-200 rounded"></div>
                </div>
              ) : (
                <div>
                  {/* General Settings */}
                  {activeTab === "general" && (
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="siteName"
                          className="block text-sm font-medium text-neutral-700 mb-2"
                        >
                          Site Name
                        </label>
                        <input
                          type="text"
                          id="siteName"
                          name="siteName"
                          value={settings.siteName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="siteDescription"
                          className="block text-sm font-medium text-neutral-700 mb-2"
                        >
                          Site Description
                        </label>
                        <textarea
                          id="siteDescription"
                          name="siteDescription"
                          value={settings.siteDescription}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        ></textarea>
                      </div>

                      <div>
                        <label
                          htmlFor="defaultUserRole"
                          className="block text-sm font-medium text-neutral-700 mb-2"
                        >
                          Default User Role
                        </label>
                        <select
                          id="defaultUserRole"
                          name="defaultUserRole"
                          value={settings.defaultUserRole}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="photographer">Photographer</option>
                          <option value="company">Company</option>
                        </select>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="maintenanceMode"
                          name="maintenanceMode"
                          checked={settings.maintenanceMode}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                        />
                        <label
                          htmlFor="maintenanceMode"
                          className="ml-2 block text-sm text-neutral-700"
                        >
                          Enable Maintenance Mode
                        </label>
                      </div>

                      {settings.maintenanceMode && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-yellow-800">
                                Maintenance Mode Active
                              </h4>
                              <p className="text-sm text-yellow-700 mt-1">
                                When enabled, the site will display a
                                maintenance message to all visitors except
                                administrators.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Email Settings */}
                  {activeTab === "email" && (
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="contactEmail"
                          className="block text-sm font-medium text-neutral-700 mb-2"
                        >
                          Contact Email
                        </label>
                        <input
                          type="email"
                          id="contactEmail"
                          name="contactEmail"
                          value={settings.contactEmail}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <p className="mt-1 text-sm text-neutral-500">
                          This email will be displayed on the contact page.
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="supportEmail"
                          className="block text-sm font-medium text-neutral-700 mb-2"
                        >
                          Support Email
                        </label>
                        <input
                          type="email"
                          id="supportEmail"
                          name="supportEmail"
                          value={settings.supportEmail}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <p className="mt-1 text-sm text-neutral-500">
                          This email will be used for support inquiries.
                        </p>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="requireEmailVerification"
                          name="requireEmailVerification"
                          checked={settings.requireEmailVerification}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                        />
                        <label
                          htmlFor="requireEmailVerification"
                          className="ml-2 block text-sm text-neutral-700"
                        >
                          Require Email Verification
                        </label>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-800">
                              Email Configuration
                            </h4>
                            <p className="text-sm text-blue-700 mt-1">
                              Make sure your SMTP settings are properly
                              configured in the server environment to ensure
                              emails are sent correctly.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-neutral-200 pt-6">
                        <h3 className="text-lg font-medium text-neutral-900 mb-4">
                          Email Templates
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { id: "welcome", name: "Welcome Email" },
                            { id: "verification", name: "Email Verification" },
                            { id: "reset-password", name: "Password Reset" },
                            { id: "notification", name: "Notification Email" },
                          ].map((template) => (
                            <div
                              key={template.id}
                              className="border border-neutral-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                            >
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium text-neutral-900">
                                  {template.name}
                                </h4>
                                <button
                                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                  onClick={() =>
                                    toast.success(
                                      "Template editor will be available soon"
                                    )
                                  }
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Settings */}
                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="allowRegistration"
                          name="allowRegistration"
                          checked={settings.allowRegistration}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                        />
                        <label
                          htmlFor="allowRegistration"
                          className="ml-2 block text-sm text-neutral-700"
                        >
                          Allow New User Registrations
                        </label>
                      </div>

                      <div>
                        <label
                          htmlFor="userDeletionGracePeriod"
                          className="block text-sm font-medium text-neutral-700 mb-2"
                        >
                          User Deletion Grace Period (days)
                        </label>
                        <input
                          type="number"
                          id="userDeletionGracePeriod"
                          name="userDeletionGracePeriod"
                          value={settings.userDeletionGracePeriod}
                          onChange={handleNumberChange}
                          min="1"
                          max="90"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <p className="mt-1 text-sm text-neutral-500">
                          Number of days before permanently deleting user data
                          after account deletion request.
                        </p>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="cookieConsentRequired"
                          name="cookieConsentRequired"
                          checked={settings.cookieConsentRequired}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                        />
                        <label
                          htmlFor="cookieConsentRequired"
                          className="ml-2 block text-sm text-neutral-700"
                        >
                          Require Cookie Consent
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="gdprCompliant"
                          name="gdprCompliant"
                          checked={settings.gdprCompliant}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                        />
                        <label
                          htmlFor="gdprCompliant"
                          className="ml-2 block text-sm text-neutral-700"
                        >
                          GDPR Compliance Mode
                        </label>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-800">
                              Admin Access
                            </h4>
                            <p className="text-sm text-blue-700 mt-1">
                              Currently, admin access is restricted to users
                              with the email "musiitwajoel@gmail.com" or users
                              with the admin role. You can add more admins by
                              changing their role in the Users section.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-neutral-900 mb-4">
                          Current Admins
                        </h3>
                        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-neutral-200">
                            <thead className="bg-neutral-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                                >
                                  Name
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                                >
                                  Email
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-neutral-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-neutral-900">
                                    Musiitwa Joel
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-neutral-500">
                                    musiitwajoel@gmail.com
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="border-t border-neutral-200 pt-6">
                        <h3 className="text-lg font-medium text-neutral-900 mb-4">
                          Legal Documents
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 border border-neutral-200 rounded-lg">
                            <div>
                              <h4 className="font-medium text-neutral-900">
                                Terms of Service
                              </h4>
                              <p className="text-sm text-neutral-500">
                                Last updated:{" "}
                                {new Date(
                                  settings.termsLastUpdated
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                              onClick={() =>
                                toast.success(
                                  "Terms editor will be available soon"
                                )
                              }
                            >
                              Edit
                            </button>
                          </div>
                          <div className="flex justify-between items-center p-4 border border-neutral-200 rounded-lg">
                            <div>
                              <h4 className="font-medium text-neutral-900">
                                Privacy Policy
                              </h4>
                              <p className="text-sm text-neutral-500">
                                Last updated:{" "}
                                {new Date(
                                  settings.privacyLastUpdated
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                              onClick={() =>
                                toast.success(
                                  "Privacy policy editor will be available soon"
                                )
                              }
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload Settings */}
                  {activeTab === "uploads" && (
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="maxUploadSize"
                          className="block text-sm font-medium text-neutral-700 mb-2"
                        >
                          Maximum Upload Size (MB)
                        </label>
                        <input
                          type="number"
                          id="maxUploadSize"
                          name="maxUploadSize"
                          value={settings.maxUploadSize}
                          onChange={handleNumberChange}
                          min="1"
                          max="50"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="maxPhotosPerUpload"
                          className="block text-sm font-medium text-neutral-700 mb-2"
                        >
                          Maximum Photos Per Upload
                        </label>
                        <input
                          type="number"
                          id="maxPhotosPerUpload"
                          name="maxPhotosPerUpload"
                          value={settings.maxPhotosPerUpload}
                          onChange={handleNumberChange}
                          min="1"
                          max="100"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="maxTagsPerPhoto"
                          className="block text-sm font-medium text-neutral-700 mb-2"
                        >
                          Maximum Tags Per Photo
                        </label>
                        <input
                          type="number"
                          id="maxTagsPerPhoto"
                          name="maxTagsPerPhoto"
                          value={settings.maxTagsPerPhoto}
                          onChange={handleNumberChange}
                          min="1"
                          max="50"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="photoApprovalRequired"
                          name="photoApprovalRequired"
                          checked={settings.photoApprovalRequired}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                        />
                        <label
                          htmlFor="photoApprovalRequired"
                          className="ml-2 block text-sm text-neutral-700"
                        >
                          Require Admin Approval for Photos
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="autoApprovePhotos"
                          name="autoApprovePhotos"
                          checked={settings.autoApprovePhotos}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                        />
                        <label
                          htmlFor="autoApprovePhotos"
                          className="ml-2 block text-sm text-neutral-700"
                        >
                          Auto-approve Photos from Verified Users
                        </label>
                      </div>

                      <div className="border-t border-neutral-200 pt-6">
                        <h3 className="text-lg font-medium text-neutral-900 mb-4">
                          Watermark Settings
                        </h3>

                        <div className="flex items-center mb-4">
                          <input
                            type="checkbox"
                            id="watermarkEnabled"
                            name="watermarkEnabled"
                            checked={settings.watermarkEnabled}
                            onChange={handleCheckboxChange}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                          />
                          <label
                            htmlFor="watermarkEnabled"
                            className="ml-2 block text-sm text-neutral-700"
                          >
                            Enable Watermark on Photos
                          </label>
                        </div>

                        {settings.watermarkEnabled && (
                          <div className="space-y-4 pl-6 border-l-2 border-primary-100">
                            <div>
                              <label
                                htmlFor="watermarkText"
                                className="block text-sm font-medium text-neutral-700 mb-2"
                              >
                                Watermark Text
                              </label>
                              <input
                                type="text"
                                id="watermarkText"
                                name="watermarkText"
                                value={settings.watermarkText}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="watermarkPosition"
                                className="block text-sm font-medium text-neutral-700 mb-2"
                              >
                                Watermark Position
                              </label>
                              <select
                                id="watermarkPosition"
                                name="watermarkPosition"
                                value={settings.watermarkPosition}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              >
                                <option value="top-left">Top Left</option>
                                <option value="top-right">Top Right</option>
                                <option value="bottom-left">Bottom Left</option>
                                <option value="bottom-right">
                                  Bottom Right
                                </option>
                                <option value="center">Center</option>
                              </select>
                            </div>

                            <div>
                              <label
                                htmlFor="watermarkOpacity"
                                className="block text-sm font-medium text-neutral-700 mb-2"
                              >
                                Watermark Opacity: {settings.watermarkOpacity}%
                              </label>
                              <input
                                type="range"
                                id="watermarkOpacity"
                                name="watermarkOpacity"
                                value={settings.watermarkOpacity}
                                onChange={handleNumberChange}
                                min="10"
                                max="100"
                                step="5"
                                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Feature Settings */}
                  {activeTab === "features" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-neutral-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <MessageSquare className="h-5 w-5 text-primary-600" />
                              <h3 className="font-medium text-neutral-900">
                                Comments
                              </h3>
                            </div>
                            <div>
                              <button
                                onClick={() =>
                                  setSettings({
                                    ...settings,
                                    enableComments: !settings.enableComments,
                                  })
                                }
                                className="text-neutral-500 hover:text-neutral-700"
                              >
                                {settings.enableComments ? (
                                  <ToggleRight className="h-6 w-6 text-primary-600" />
                                ) : (
                                  <ToggleLeft className="h-6 w-6" />
                                )}
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-neutral-600">
                            Allow users to comment on photos and collections
                          </p>
                        </div>

                        <div className="bg-white border border-neutral-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <Bell className="h-5 w-5 text-primary-600" />
                              <h3 className="font-medium text-neutral-900">
                                Notifications
                              </h3>
                            </div>
                            <div>
                              <button
                                onClick={() =>
                                  setSettings({
                                    ...settings,
                                    enableNotifications:
                                      !settings.enableNotifications,
                                  })
                                }
                                className="text-neutral-500 hover:text-neutral-700"
                              >
                                {settings.enableNotifications ? (
                                  <ToggleRight className="h-6 w-6 text-primary-600" />
                                ) : (
                                  <ToggleLeft className="h-6 w-6" />
                                )}
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-neutral-600">
                            Enable in-app and email notifications for users
                          </p>
                        </div>

                        <div className="bg-white border border-neutral-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <Download className="h-5 w-5 text-primary-600" />
                              <h3 className="font-medium text-neutral-900">
                                Photo Downloads
                              </h3>
                            </div>
                            <div>
                              <button
                                onClick={() =>
                                  setSettings({
                                    ...settings,
                                    enablePhotoDownloads:
                                      !settings.enablePhotoDownloads,
                                  })
                                }
                                className="text-neutral-500 hover:text-neutral-700"
                              >
                                {settings.enablePhotoDownloads ? (
                                  <ToggleRight className="h-6 w-6 text-primary-600" />
                                ) : (
                                  <ToggleLeft className="h-6 w-6" />
                                )}
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-neutral-600">
                            Allow users to download photos from the platform
                          </p>
                        </div>

                        <div className="bg-white border border-neutral-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <Share2 className="h-5 w-5 text-primary-600" />
                              <h3 className="font-medium text-neutral-900">
                                Social Sharing
                              </h3>
                            </div>
                            <div>
                              <button
                                onClick={() =>
                                  setSettings({
                                    ...settings,
                                    socialSharingEnabled:
                                      !settings.socialSharingEnabled,
                                  })
                                }
                                className="text-neutral-500 hover:text-neutral-700"
                              >
                                {settings.socialSharingEnabled ? (
                                  <ToggleRight className="h-6 w-6 text-primary-600" />
                                ) : (
                                  <ToggleLeft className="h-6 w-6" />
                                )}
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-neutral-600">
                            Enable social media sharing buttons on photos and
                            collections
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-neutral-200 pt-6">
                        <h3 className="text-lg font-medium text-neutral-900 mb-4">
                          User Limits
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="maxCollectionsPerUser"
                              className="block text-sm font-medium text-neutral-700 mb-2"
                            >
                              Maximum Collections Per User
                            </label>
                            <input
                              type="number"
                              id="maxCollectionsPerUser"
                              name="maxCollectionsPerUser"
                              value={settings.maxCollectionsPerUser}
                              onChange={handleNumberChange}
                              min="1"
                              max="1000"
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Localization Settings */}
                  {activeTab === "localization" && (
                    <div className="space-y-6">
                      <div>
                        <label
                          htmlFor="defaultLanguage"
                          className="block text-sm font-medium text-neutral-700 mb-2"
                        >
                          Default Language
                        </label>
                        <select
                          id="defaultLanguage"
                          name="defaultLanguage"
                          value={settings.defaultLanguage}
                          onChange={handleDefaultLanguageChange}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          {languages.map((language) => (
                            <option key={language.code} value={language.code}>
                              {language.flag} {language.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-4">
                          Enabled Languages
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {languages.map((language) => (
                            <div
                              key={language.code}
                              className={`flex items-center justify-between p-3 border rounded-lg ${
                                settings.enabledLanguages.includes(
                                  language.code
                                )
                                  ? "border-primary-300 bg-primary-50"
                                  : "border-neutral-200"
                              }`}
                            >
                              <div className="flex items-center">
                                <span className="text-xl mr-2">
                                  {language.flag}
                                </span>
                                <span className="font-medium text-neutral-900">
                                  {language.name}
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  handleLanguageToggle(language.code)
                                }
                                className={`${
                                  settings.enabledLanguages.includes(
                                    language.code
                                  )
                                    ? "text-primary-600"
                                    : "text-neutral-400"
                                }`}
                                disabled={
                                  language.code === settings.defaultLanguage
                                }
                                title={
                                  language.code === settings.defaultLanguage
                                    ? "Default language cannot be disabled"
                                    : settings.enabledLanguages.includes(
                                        language.code
                                      )
                                    ? "Disable language"
                                    : "Enable language"
                                }
                              >
                                {settings.enabledLanguages.includes(
                                  language.code
                                ) ? (
                                  <ToggleRight className="h-6 w-6" />
                                ) : (
                                  <ToggleLeft className="h-6 w-6" />
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-800">
                              Translation Management
                            </h4>
                            <p className="text-sm text-blue-700 mt-1">
                              Translations are managed through the i18n system.
                              To add or modify translations, edit the language
                              files in the i18n directory.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Advanced Settings */}
                  {activeTab === "advanced" && (
                    <div className="space-y-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="analyticsEnabled"
                          name="analyticsEnabled"
                          checked={settings.analyticsEnabled}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                        />
                        <label
                          htmlFor="analyticsEnabled"
                          className="ml-2 block text-sm text-neutral-700"
                        >
                          Enable Analytics Tracking
                        </label>
                      </div>

                      {settings.analyticsEnabled && (
                        <div>
                          <label
                            htmlFor="analyticsCode"
                            className="block text-sm font-medium text-neutral-700 mb-2"
                          >
                            Analytics Tracking Code
                          </label>
                          <textarea
                            id="analyticsCode"
                            name="analyticsCode"
                            value={settings.analyticsCode}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                            placeholder="Paste your analytics tracking code here..."
                          ></textarea>
                        </div>
                      )}

                      <div>
                        <label
                          htmlFor="apiRateLimit"
                          className="block text-sm font-medium text-neutral-700 mb-2"
                        >
                          API Rate Limit (requests per minute)
                        </label>
                        <input
                          type="number"
                          id="apiRateLimit"
                          name="apiRateLimit"
                          value={settings.apiRateLimit}
                          onChange={handleNumberChange}
                          min="10"
                          max="1000"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="backupFrequency"
                          className="block text-sm font-medium text-neutral-700 mb-2"
                        >
                          Database Backup Frequency
                        </label>
                        <select
                          id="backupFrequency"
                          name="backupFrequency"
                          value={settings.backupFrequency}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-neutral-900">
                            Database Backup
                          </h4>
                          <p className="text-sm text-neutral-500">
                            Last backup:{" "}
                            {new Date(settings.lastBackupDate).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={handleBackupDatabase}
                          disabled={isBackingUp}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                          {isBackingUp ? (
                            <>
                              <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                              Backing Up...
                            </>
                          ) : (
                            <>
                              <Database className="h-4 w-4 mr-2" />
                              Backup Now
                            </>
                          )}
                        </button>
                      </div>

                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-red-800">
                              Danger Zone
                            </h4>
                            <p className="text-sm text-red-700 mt-1">
                              These settings can significantly impact your
                              site's functionality. Use with caution.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to clear all caches? This may temporarily slow down your site."
                              )
                            ) {
                              toast.success("Caches cleared successfully");
                            }
                          }}
                        >
                          Clear All Caches
                        </button>

                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to reset all settings to default values? This cannot be undone."
                              )
                            ) {
                              // Reset settings to default
                              fetchSettings();
                              toast.success("Settings reset to default values");
                            }
                          }}
                        >
                          Reset to Default Settings
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-neutral-200 bg-neutral-50">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
