"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  LinkIcon,
  Instagram,
  Twitter,
  Grid3X3,
  Heart,
  Bookmark,
  Users,
  Settings,
  Share2,
  BarChart3,
  ImageIcon,
  TrendingUp,
  Plus,
  Camera,
  CheckCircle,
  BadgeCheck,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";
import PhotoGrid from "../components/Common/PhotoGrid";
import type { Photo, User as UserType } from "../types";
import toast from "react-hot-toast";

type ProfileTab = "photos" | "collections" | "liked" | "saved" | "following";

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const { openUploadModal } = useApp();

  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>("photos");

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [likedPhotos, setLikedPhotos] = useState<Photo[]>([]);
  const [savedPhotos, setSavedPhotos] = useState<Photo[]>([]);
  const [followingPhotos, setFollowingPhotos] = useState<Photo[]>([]);

  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [isLoadingCollections, setIsLoadingCollections] = useState(false);
  const [isLoadingLiked, setIsLoadingLiked] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);

  const [tabCounts, setTabCounts] = useState<{
    photos: number;
    collections: number;
    liked: number;
    saved: number;
    following: number;
  } | null>(null);
  const [isLoadingTabCounts, setIsLoadingTabCounts] = useState(true);

  // Check if this is the current user's profile
  const isCurrentUser =
    currentUser?.username === username ||
    (username?.startsWith("@") &&
      currentUser?.username === username.substring(1));

  // Clean username (remove @ if present)
  const cleanUsername = username?.startsWith("@")
    ? username.substring(1)
    : username;

  useEffect(() => {
    if (cleanUsername) {
      loadUserProfile();
    }
  }, [cleanUsername]);

  useEffect(() => {
    if (user) {
      loadTabCounts();
      checkFollowStatus();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      switch (activeTab) {
        case "photos":
          loadUserPhotos();
          break;
        case "collections":
          loadUserCollections();
          break;
        case "liked":
          loadLikedPhotos();
          break;
        case "saved":
          loadSavedPhotos();
          break;
        case "following":
          loadFollowingPhotos();
          break;
      }
    }
  }, [activeTab, user]);

  const loadUserProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/username/${cleanUsername}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          navigate("/404");
          return;
        }
        throw new Error("Failed to fetch user profile");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Failed to load user profile:", error);
      toast.error("Failed to load user profile");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTabCounts = async () => {
    if (!user) return;

    setIsLoadingTabCounts(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user.id}/tab-counts`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTabCounts(data);
      }
    } catch (error) {
      console.error("Failed to load tab counts:", error);
    } finally {
      setIsLoadingTabCounts(false);
    }
  };

  const checkFollowStatus = async () => {
    if (!user || !isAuthenticated || isCurrentUser) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user.id}/follow-status`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.following);
      }
    } catch (error) {
      console.error("Failed to check follow status:", error);
    }
  };

  const handleFollow = async () => {
    if (!user || !isAuthenticated) {
      toast.error("Please sign in to follow users");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user.id}/follow`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.following);

        // Update follower count
        setUser((prev) =>
          prev
            ? {
                ...prev,
                followersCount: data.following
                  ? prev.followersCount + 1
                  : Math.max(0, prev.followersCount - 1),
              }
            : null
        );

        toast.success(data.message);
      }
    } catch (error) {
      console.error("Failed to follow/unfollow:", error);
      toast.error("Failed to follow/unfollow user");
    }
  };

  const loadUserPhotos = async () => {
    if (!user) return;

    setIsLoadingPhotos(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/photos/user/${user.id}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPhotos(data.photos);
      }
    } catch (error) {
      console.error("Failed to load user photos:", error);
      toast.error("Failed to load photos");
    } finally {
      setIsLoadingPhotos(false);
    }
  };

  const loadUserCollections = async () => {
    if (!user) return;

    setIsLoadingCollections(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/collections?user_id=${user.id}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCollections(data.collections);
      }
    } catch (error) {
      console.error("Failed to load user collections:", error);
      toast.error("Failed to load collections");
    } finally {
      setIsLoadingCollections(false);
    }
  };

  const loadLikedPhotos = async () => {
    if (!user) return;

    setIsLoadingLiked(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user.id}/liked-photos`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLikedPhotos(data.photos);
      }
    } catch (error) {
      console.error("Failed to load liked photos:", error);
      toast.error("Failed to load liked photos");
    } finally {
      setIsLoadingLiked(false);
    }
  };

  const loadSavedPhotos = async () => {
    if (!user) return;

    setIsLoadingSaved(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/photos/saved/${user.id}`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSavedPhotos(data.photos);
      }
    } catch (error) {
      console.error("Failed to load saved photos:", error);
      toast.error("Failed to load saved photos");
    } finally {
      setIsLoadingSaved(false);
    }
  };

  const loadFollowingPhotos = async () => {
    if (!user) return;

    setIsLoadingFollowing(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user.id}/following-photos`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFollowingPhotos(data.photos);
      }
    } catch (error) {
      console.error("Failed to load following photos:", error);
      toast.error("Failed to load following photos");
    } finally {
      setIsLoadingFollowing(false);
    }
  };

  const handleShare = () => {
    if (!user) return;

    if (navigator.share) {
      navigator.share({
        title: `${user.firstName} ${user.lastName} on Pixinity`,
        text: `Check out ${user.firstName} ${user.lastName}'s photography on Pixinity`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header Skeleton */}
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-neutral-200 animate-pulse mb-4 md:mb-0 md:mr-8"></div>
              <div className="flex-1">
                <div className="h-8 bg-neutral-200 rounded animate-pulse w-48 mb-4"></div>
                <div className="h-4 bg-neutral-200 rounded animate-pulse w-64 mb-6"></div>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="h-6 bg-neutral-200 rounded animate-pulse w-24"></div>
                  <div className="h-6 bg-neutral-200 rounded animate-pulse w-24"></div>
                  <div className="h-6 bg-neutral-200 rounded animate-pulse w-24"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-8">
            <div className="flex space-x-4">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-neutral-200 rounded animate-pulse w-24"
                ></div>
              ))}
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-neutral-200 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-32 w-32 bg-neutral-200 rounded-full mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            User not found
          </h2>
          <p className="text-neutral-600 mb-6">
            The user you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          className="bg-white rounded-2xl p-8 shadow-sm mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center">
            {/* Avatar */}
            <div className="mb-6 md:mb-0 md:mr-8">
              <div className="relative">
                <img
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${
                      user.firstName || "/placeholder.svg"
                    }+${user.lastName}&background=2563eb&color=ffffff&size=200`
                  }
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
                      {user.firstName} {user.lastName}
                    </h1>
                    {user.verified && (
                      <BadgeCheck className="h-6 w-6 text-primary-500" />
                    )}
                  </div>
                  <p className="text-neutral-600">@{user.username}</p>
                </div>

                <div className="flex mt-4 md:mt-0 space-x-3">
                  {isCurrentUser ? (
                    <>
                      <Link to="/settings" className="btn-outline">
                        <Settings className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Link>
                      <Link to="/analytics" className="btn-outline">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Analytics
                      </Link>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleFollow}
                        className={`btn ${
                          isFollowing ? "btn-outline" : "btn-primary"
                        }`}
                        disabled={!isAuthenticated}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                      <button onClick={handleShare} className="btn-outline">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-neutral-700 mb-6 max-w-3xl">{user.bio}</p>
              )}

              {/* User Details */}
              <div className="flex flex-wrap gap-y-4 gap-x-6 mb-6">
                {user.location && (
                  <div className="flex items-center text-neutral-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{user.location}</span>
                  </div>
                )}

                {user.website && (
                  <div className="flex items-center text-neutral-600">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    <a
                      href={
                        user.website.startsWith("http")
                          ? user.website
                          : `https://${user.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      {user.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}

                {user.socialLinks?.instagram && (
                  <div className="flex items-center text-neutral-600">
                    <Instagram className="h-4 w-4 mr-2" />
                    <a
                      href={`https://instagram.com/${user.socialLinks.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      @{user.socialLinks.instagram}
                    </a>
                  </div>
                )}

                {user.socialLinks?.twitter && (
                  <div className="flex items-center text-neutral-600">
                    <Twitter className="h-4 w-4 mr-2" />
                    <a
                      href={`https://twitter.com/${user.socialLinks.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      @{user.socialLinks.twitter}
                    </a>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-neutral-900">
                    {user.uploadsCount.toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-600">Photos</div>
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold text-neutral-900">
                    {user.followersCount.toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-600">Followers</div>
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold text-neutral-900">
                    {user.followingCount.toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-600">Following</div>
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold text-neutral-900">
                    {user.totalViews.toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-600">Views</div>
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold text-neutral-900">
                    {user.totalDownloads.toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-600">Downloads</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="bg-white rounded-2xl p-4 shadow-sm mb-8 overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex space-x-1 min-w-max">
            <button
              onClick={() => setActiveTab("photos")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "photos"
                  ? "bg-primary-500 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
              <span>Photos</span>
              {isLoadingTabCounts ? (
                <div className="w-5 h-5 rounded-full bg-neutral-200 animate-pulse"></div>
              ) : tabCounts?.photos ? (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === "photos"
                      ? "bg-white/20 text-white"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {tabCounts.photos}
                </span>
              ) : null}
            </button>

            <button
              onClick={() => setActiveTab("collections")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "collections"
                  ? "bg-primary-500 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Collections</span>
              {isLoadingTabCounts ? (
                <div className="w-5 h-5 rounded-full bg-neutral-200 animate-pulse"></div>
              ) : tabCounts?.collections ? (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === "collections"
                      ? "bg-white/20 text-white"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {tabCounts.collections}
                </span>
              ) : null}
            </button>

            <button
              onClick={() => setActiveTab("liked")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "liked"
                  ? "bg-primary-500 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <Heart className="h-4 w-4" />
              <span>Liked</span>
              {isLoadingTabCounts ? (
                <div className="w-5 h-5 rounded-full bg-neutral-200 animate-pulse"></div>
              ) : tabCounts?.liked ? (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === "liked"
                      ? "bg-white/20 text-white"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {tabCounts.liked}
                </span>
              ) : null}
            </button>

            {isCurrentUser && (
              <>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "saved"
                      ? "bg-primary-500 text-white"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                  <span>Saved</span>
                  {isLoadingTabCounts ? (
                    <div className="w-5 h-5 rounded-full bg-neutral-200 animate-pulse"></div>
                  ) : tabCounts?.saved ? (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === "saved"
                          ? "bg-white/20 text-white"
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {tabCounts.saved}
                    </span>
                  ) : null}
                </button>

                <button
                  onClick={() => setActiveTab("following")}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "following"
                      ? "bg-primary-500 text-white"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Following</span>
                  {isLoadingTabCounts ? (
                    <div className="w-5 h-5 rounded-full bg-neutral-200 animate-pulse"></div>
                  ) : tabCounts?.following ? (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === "following"
                          ? "bg-white/20 text-white"
                          : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {tabCounts.following}
                    </span>
                  ) : null}
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Photos Tab */}
          {activeTab === "photos" && (
            <>
              {isLoadingPhotos ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-neutral-200 rounded-xl animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : photos.length > 0 ? (
                <PhotoGrid photos={photos} />
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="h-32 w-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Camera className="h-16 w-16 text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      No photos yet
                    </h3>
                    <p className="text-neutral-600 mb-6">
                      {isCurrentUser
                        ? "Start building your portfolio by uploading your first photos."
                        : `${user.firstName} hasn't uploaded any photos yet.`}
                    </p>
                    {isCurrentUser && (
                      <button onClick={openUploadModal} className="btn-primary">
                        <Plus className="mr-2 h-4 w-4" />
                        Upload Your First Photo
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Collections Tab */}
          {activeTab === "collections" && (
            <>
              {isLoadingCollections ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm"
                    >
                      <div className="aspect-video bg-neutral-200 animate-pulse"></div>
                      <div className="p-6">
                        <div className="h-6 bg-neutral-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 bg-neutral-200 rounded animate-pulse mb-4 w-3/4"></div>
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-neutral-200 rounded-full animate-pulse"></div>
                          <div>
                            <div className="h-4 bg-neutral-200 rounded animate-pulse mb-1 w-24"></div>
                            <div className="h-3 bg-neutral-200 rounded animate-pulse w-16"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : collections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {collections.map((collection) => (
                    <Link
                      key={collection.id}
                      to={`/collections/${collection.id}`}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <div className="aspect-video bg-neutral-200 relative overflow-hidden">
                        {collection.coverPhoto ? (
                          <img
                            src={
                              collection.coverPhoto.url || "/placeholder.svg"
                            }
                            alt={collection.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-neutral-400" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                          {collection.photosCount} photos
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                          {collection.title}
                        </h3>
                        {collection.description && (
                          <p className="text-neutral-600 mb-4 line-clamp-2">
                            {collection.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-neutral-500">
                            Updated{" "}
                            {new Date(
                              collection.updatedAt
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="h-32 w-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Grid3X3 className="h-16 w-16 text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      No collections yet
                    </h3>
                    <p className="text-neutral-600 mb-6">
                      {isCurrentUser
                        ? "Create collections to organize your favorite photos."
                        : `${user.firstName} hasn't created any collections yet.`}
                    </p>
                    {isCurrentUser && (
                      <Link to="/collections" className="btn-primary">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Collection
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Liked Photos Tab */}
          {activeTab === "liked" && (
            <>
              {isLoadingLiked ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-neutral-200 rounded-xl animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : likedPhotos.length > 0 ? (
                <PhotoGrid photos={likedPhotos} />
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="h-32 w-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Heart className="h-16 w-16 text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      No liked photos yet
                    </h3>
                    <p className="text-neutral-600 mb-6">
                      {isCurrentUser
                        ? "Photos you like will appear here."
                        : `${user.firstName} hasn't liked any photos yet.`}
                    </p>
                    {isCurrentUser && (
                      <Link to="/explore" className="btn-primary">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Explore Photos
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Saved Photos Tab */}
          {activeTab === "saved" && isCurrentUser && (
            <>
              {isLoadingSaved ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-neutral-200 rounded-xl animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : savedPhotos.length > 0 ? (
                <PhotoGrid photos={savedPhotos} />
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="h-32 w-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Bookmark className="h-16 w-16 text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      No saved photos yet
                    </h3>
                    <p className="text-neutral-600 mb-6">
                      Photos you save will appear here for easy access.
                    </p>
                    <Link to="/explore" className="btn-primary">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Explore Photos
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Following Photos Tab */}
          {activeTab === "following" && isCurrentUser && (
            <>
              {isLoadingFollowing ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-neutral-200 rounded-xl animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : followingPhotos.length > 0 ? (
                <PhotoGrid photos={followingPhotos} />
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="h-32 w-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Users className="h-16 w-16 text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      No photos from people you follow
                    </h3>
                    <p className="text-neutral-600 mb-6">
                      Follow photographers to see their latest work here.
                    </p>
                    <Link to="/photographers" className="btn-primary">
                      <Users className="mr-2 h-4 w-4" />
                      Discover Photographers
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
