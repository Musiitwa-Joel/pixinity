"use client";

import type React from "react";
import { useState } from "react";
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
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../contexts/LanguageContext";

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { openUploadModal, notifications } = useApp();
  const navigate = useNavigate();
  const { language: selectedLanguage, setLanguage } = useLanguage();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as any);
    setIsLanguageMenuOpen(false);
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;

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
                {/* Upload Button */}
                <button
                  onClick={openUploadModal}
                  className="btn-primary flex items-center space-x-2 text-sm"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </button>

                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="relative p-2 text-neutral-600 hover:text-primary-600 transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-error-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </span>
                  )}
                </Link>

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
