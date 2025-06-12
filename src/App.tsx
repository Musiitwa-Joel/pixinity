import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import CollectionsPage from "./pages/CollectionsPage";
import CollectionDetailPage from "./pages/CollectionDetailPage";
import SearchPage from "./pages/SearchPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SavedPage from "./pages/SavedPage";
import SettingsPage from "./pages/SettingsPage";
import CategoryPage from "./pages/CategoryPage";
import PhotographersPage from "./pages/PhotographersPage";
import PhotoChallengesPage from "./pages/PhotoChallengesPage";
import BlogPage from "./pages/BlogPage";
import CommunityForumPage from "./pages/CommunityForumPage";
import NotFoundPage from "./pages/NotFoundPage";
import ServerErrorPage from "./pages/ServerErrorPage";
import AboutPage from "./pages/AboutPage";
import CareersPage from "./pages/CareersPage";
import APIPage from "./pages/APIPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import LicensePage from "./pages/LicensePage";
import MyUploadsPage from "./pages/MyUploadsPage";
import PhotoModal from "./components/Modals/PhotoModal";
import UploadModal from "./components/Modals/UploadModal";
import NotificationsPage from "./pages/NotificationsPage";
import { LanguageProvider } from "./contexts/LanguageContext";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  {/* Home */}
                  <Route path="/" element={<HomePage />} />

                  {/* Core App Routes */}
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/collections" element={<CollectionsPage />} />
                  <Route
                    path="/collections/:id"
                    element={<CollectionDetailPage />}
                  />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/trending" element={<ExplorePage />} />
                  <Route path="/featured" element={<ExplorePage />} />

                  {/* Auth Routes */}
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/signup" element={<AuthPage />} />
                  <Route path="/forgot-password" element={<AuthPage />} />

                  {/* User Dashboard Routes */}
                  <Route path="/dashboard" element={<AnalyticsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route
                    path="/notifications"
                    element={<NotificationsPage />}
                  />
                  <Route path="/saved" element={<SavedPage />} />
                  <Route path="/my-uploads" element={<MyUploadsPage />} />

                  {/* Admin Routes */}
                  <Route path="/admin/*" element={<AdminPage />} />

                  {/* Category Routes */}
                  <Route
                    path="/categories/:category"
                    element={<CategoryPage />}
                  />
                  <Route path="/nature" element={<CategoryPage />} />
                  <Route path="/architecture" element={<CategoryPage />} />
                  <Route path="/travel" element={<CategoryPage />} />
                  <Route path="/portraits" element={<CategoryPage />} />
                  <Route path="/street" element={<CategoryPage />} />
                  <Route path="/abstract" element={<CategoryPage />} />

                  {/* Photo Routes */}
                  <Route path="/photos/:id" element={<HomePage />} />

                  {/* Community Pages */}
                  <Route
                    path="/photographers"
                    element={<PhotographersPage />}
                  />
                  <Route path="/challenges" element={<PhotoChallengesPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/forum" element={<CommunityForumPage />} />

                  {/* Company Pages */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/careers" element={<CareersPage />} />
                  <Route path="/press" element={<AboutPage />} />

                  {/* Support & Legal Pages */}
                  <Route path="/api" element={<APIPage />} />
                  <Route path="/help" element={<HelpCenterPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsOfServicePage />} />
                  <Route path="/licenses" element={<LicensePage />} />

                  {/* Error Pages */}
                  <Route path="/500" element={<ServerErrorPage />} />

                  {/* Profile Routes - MUST BE LAST to avoid conflicts */}
                  <Route path="/@:username" element={<ProfilePage />} />
                  <Route path="/:username" element={<ProfilePage />} />

                  {/* 404 - Catch all unmatched routes */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
              <PhotoModal />
              <UploadModal />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                    borderRadius: "12px",
                    padding: "16px",
                    fontSize: "14px",
                    fontWeight: "500",
                  },
                  success: {
                    iconTheme: {
                      primary: "#22c55e",
                      secondary: "#fff",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#ef4444",
                      secondary: "#fff",
                    },
                  },
                }}
              />
            </div>
          </Router>
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
