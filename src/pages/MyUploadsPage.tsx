import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Grid3X3,
  List,
  Search,
  Filter,
  Plus,
  Eye,
  Heart,
  Download,
  MoreVertical,
  Edit3,
  Trash2,
  Share2,
  TrendingUp,
  Clock,
  Camera,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Photo } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";
import PhotoGrid from "../components/Common/PhotoGrid";
import toast from "react-hot-toast";

const MyUploadsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { openUploadModal } = useApp();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "popular" | "views"
  >("newest");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "live" | "draft">(
    "all"
  );
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    live: 0,
    draft: 0,
    totalViews: 0,
    totalLikes: 0,
    totalDownloads: 0,
  });

  const categories = [
    "All",
    "Nature",
    "Architecture",
    "Travel",
    "Street",
    "People",
    "Abstract",
    "Food",
    "Fashion",
    "Sports",
    "Technology",
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First", icon: Clock },
    { value: "oldest", label: "Oldest First", icon: Clock },
    { value: "popular", label: "Most Liked", icon: Heart },
    { value: "views", label: "Most Viewed", icon: Eye },
  ];

  const statusOptions = [
    { value: "all", label: "All Photos", icon: ImageIcon },
    { value: "live", label: "Published", icon: Eye },
    { value: "draft", label: "Drafts", icon: FileText },
  ];

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserPhotos();
    }
  }, [
    isAuthenticated,
    user,
    searchQuery,
    sortBy,
    selectedCategory,
    statusFilter,
  ]);

  const loadUserPhotos = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        sort: sortBy,
        limit: "50",
        offset: "0",
      });

      if (selectedCategory && selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(
        `http://localhost:5000/api/photos/user/${user.id}?${params}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }

      const data = await response.json();
      setPhotos(data.photos);
      setTotalPhotos(data.total);

      // Calculate stats
      const livePhotos = data.photos.filter((p: any) => p.status === "live");
      const draftPhotos = data.photos.filter((p: any) => p.status === "draft");

      setStats({
        total: data.photos.length,
        live: livePhotos.length,
        draft: draftPhotos.length,
        totalViews: data.photos.reduce(
          (sum: number, photo: any) => sum + photo.viewsCount,
          0
        ),
        totalLikes: data.photos.reduce(
          (sum: number, photo: any) => sum + photo.likesCount,
          0
        ),
        totalDownloads: data.photos.reduce(
          (sum: number, photo: any) => sum + photo.downloadsCount,
          0
        ),
      });
    } catch (error: any) {
      console.error("Failed to load photos:", error);
      toast.error("Failed to load your photos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this photo? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/photos/${photoId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete photo");
      }

      setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
      setTotalPhotos((prev) => prev - 1);
      toast.success("Photo deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete photo:", error);
      toast.error("Failed to delete photo");
    }
  };

  const handlePublishPhoto = async (photoId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/photos/${photoId}/publish`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to publish photo");
      }

      // Update the photo status in the list
      setPhotos((prev) =>
        prev.map((photo) =>
          photo.id === photoId
            ? { ...photo, status: "live" as any, publishedAt: new Date() }
            : photo
        )
      );

      toast.success("Photo published successfully!");
    } catch (error: any) {
      console.error("Failed to publish photo:", error);
      toast.error("Failed to publish photo");
    }
  };

  const handleShare = (photo: Photo) => {
    if (navigator.share) {
      navigator.share({
        title: photo.title,
        text: photo.description,
        url: window.location.origin + `/photos/${photo.id}`,
      });
    } else {
      navigator.clipboard.writeText(
        window.location.origin + `/photos/${photo.id}`
      );
      toast.success("Link copied to clipboard");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Camera className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Sign in to view your uploads
          </h2>
          <p className="text-neutral-600 mb-6">
            You need to be logged in to access your photo uploads.
          </p>
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M40 40c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20zm-20-20c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="font-medium">Your creative portfolio</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block">My</span>
              <span className="font-cursive text-6xl md:text-7xl bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                Uploads
              </span>
            </h1>

            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              Manage and showcase your photography portfolio. Track performance,
              organize your work, and share your creative vision with the world.
            </p>

            <button
              onClick={openUploadModal}
              className="btn bg-white text-purple-600 hover:bg-neutral-100 text-lg px-8 py-4 group shadow-2xl"
            >
              <Plus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Upload New Photos</span>
            </button>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            {
              icon: ImageIcon,
              value: stats.total.toString(),
              label: "Total Photos",
              color: "text-blue-500",
            },
            {
              icon: Eye,
              value: stats.live.toString(),
              label: "Published",
              color: "text-green-500",
            },
            {
              icon: FileText,
              value: stats.draft.toString(),
              label: "Drafts",
              color: "text-orange-500",
            },
            {
              icon: TrendingUp,
              value: stats.totalViews.toLocaleString(),
              label: "Total Views",
              color: "text-purple-500",
            },
            {
              icon: Heart,
              value: stats.totalLikes.toLocaleString(),
              label: "Total Likes",
              color: "text-red-500",
            },
            {
              icon: Download,
              value: stats.totalDownloads.toLocaleString(),
              label: "Downloads",
              color: "text-indigo-500",
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-neutral-100 ${stat.color} mb-3`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-neutral-900">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Controls */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-center justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 lg:mb-0">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your photos..."
                className="w-full sm:w-80 pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category === "All" ? "" : category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2 mb-6 lg:mb-0">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  statusFilter === option.value
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                    : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200"
                }`}
              >
                <option.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort Options */}
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    sortBy === option.value
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                      : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200"
                  }`}
                >
                  <option.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex items-center bg-white border border-neutral-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary-500 text-white"
                    : "text-neutral-500 hover:text-primary-500"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-primary-500 text-white"
                    : "text-neutral-500 hover:text-primary-500"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Photos Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-neutral-200 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : photos.length > 0 ? (
            <div className="masonry-grid">
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  className="masonry-item group cursor-pointer relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="relative bg-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <div
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                          (photo as any).status === "live"
                            ? "bg-green-500/90 text-white"
                            : "bg-orange-500/90 text-white"
                        }`}
                      >
                        {(photo as any).status === "live" ? (
                          <>
                            <Eye className="h-3 w-3" />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <FileText className="h-3 w-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Menu */}
                    <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="relative">
                        <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-neutral-700 hover:bg-white transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {/* Dropdown menu would go here */}
                      </div>
                    </div>

                    {/* Image */}
                    <div
                      className="relative"
                      style={{ aspectRatio: `${photo.width}/${photo.height}` }}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Bottom Actions */}
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex space-x-3 text-white text-sm">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{photo.viewsCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-3 w-3" />
                            <span>{photo.likesCount}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="h-3 w-3" />
                            <span>{photo.downloadsCount}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          {(photo as any).status === "draft" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePublishPhoto(photo.id);
                              }}
                              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                              title="Publish photo"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(photo);
                            }}
                            className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-neutral-700 hover:bg-white transition-colors"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePhoto(photo.id);
                            }}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Photo Info */}
                    <div className="p-4">
                      <h3 className="font-medium text-neutral-900 mb-1 line-clamp-2">
                        {photo.title}
                      </h3>
                      {photo.description && (
                        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                          {photo.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{photo.viewsCount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-3 w-3" />
                            <span>{photo.likesCount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="h-3 w-3" />
                            <span>{photo.downloadsCount.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex space-x-1">
                          {photo.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-neutral-100 rounded-full text-xs text-neutral-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="h-32 w-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Camera className="h-16 w-16 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {searchQuery || selectedCategory || statusFilter !== "all"
                    ? "No photos found"
                    : "No uploads yet"}
                </h3>
                <p className="text-neutral-600 mb-6">
                  {searchQuery || selectedCategory || statusFilter !== "all"
                    ? "Try adjusting your search criteria or explore different categories."
                    : "Start building your portfolio by uploading your first photos."}
                </p>
                {!searchQuery &&
                  !selectedCategory &&
                  statusFilter === "all" && (
                    <button onClick={openUploadModal} className="btn-primary">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Your First Photo
                    </button>
                  )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyUploadsPage;
