import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  Search,
  Grid3X3,
  List,
  Filter,
  SlidersHorizontal,
  Loader2,
  Camera,
  Clock,
  Heart,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Photo } from "../types";
import PhotoGrid from "../components/Common/PhotoGrid";
import toast from "react-hot-toast";

const SavedPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [savedPhotos, setSavedPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">(
    "newest"
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [stats, setStats] = useState({
    totalSaved: 0,
    totalCategories: 0,
    totalPhotographers: 0,
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
    { value: "newest", label: "Newest Saved", icon: Clock },
    { value: "oldest", label: "Oldest Saved", icon: Clock },
    { value: "popular", label: "Most Popular", icon: Heart },
  ];

  useEffect(() => {
    if (isAuthenticated && user) {
      loadSavedPhotos();
      loadStats();
    } else {
      // Redirect to login if not authenticated
      navigate("/login");
    }
  }, [isAuthenticated, user, searchQuery, sortBy, selectedCategory, page]);

  const loadSavedPhotos = async (reset = true) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const limit = 20;
      const offset = reset ? 0 : page * limit;

      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        sort: sortBy,
      });

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      if (selectedCategory && selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }

      const response = await fetch(
        `http://localhost:5000/api/users/${user.id}/saved-photos?${params}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch saved photos");
      }

      const data = await response.json();

      // Transform the data to match the Photo type
      const transformedPhotos = data.photos.map((photo: any) => ({
        id: photo.id,
        uuid: photo.id,
        title: photo.title,
        description: photo.description || "",
        url: photo.url,
        thumbnailUrl: photo.thumbnailUrl,
        width: photo.width,
        height: photo.height,
        orientation: photo.orientation,
        category: photo.category,
        tags: photo.tags || [],
        color: photo.color || "#000000",
        license: photo.license || "free",
        photographer: photo.photographer,
        likesCount: photo.likesCount,
        downloadsCount: photo.downloadsCount,
        viewsCount: photo.viewsCount,
        featured: photo.featured || false,
        approved: photo.approved || true,
        createdAt: new Date(photo.createdAt),
        updatedAt: new Date(photo.updatedAt),
        savedAt: new Date(photo.savedAt),
      }));

      if (reset) {
        setSavedPhotos(transformedPhotos);
        setPage(0);
      } else {
        setSavedPhotos((prev) => [...prev, ...transformedPhotos]);
      }

      setTotalPhotos(data.total);
      setHasMore(data.hasMore);
    } catch (error: any) {
      console.error("Failed to load saved photos:", error);
      toast.error(error.message || "Failed to load saved photos");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    if (!user) return;

    try {
      // Get saved photos count
      const savedResponse = await fetch(
        `http://localhost:5000/api/users/${user.id}/tab-counts`,
        {
          credentials: "include",
        }
      );

      if (savedResponse.ok) {
        const tabCounts = await savedResponse.json();

        // Get unique categories and photographers from saved photos
        const uniqueCategoriesResponse = await fetch(
          `http://localhost:5000/api/users/${user.id}/saved-stats`,
          {
            credentials: "include",
          }
        );

        if (uniqueCategoriesResponse.ok) {
          const statsData = await uniqueCategoriesResponse.json();

          setStats({
            totalSaved: tabCounts.saved || 0,
            totalCategories: statsData.uniqueCategories || 0,
            totalPhotographers: statsData.uniquePhotographers || 0,
          });
        }
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage((prev) => prev + 1);
      loadSavedPhotos(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadSavedPhotos();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Bookmark className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Sign in to view your saved photos
          </h2>
          <p className="text-neutral-600 mb-6">
            You need to be logged in to access your saved photos.
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
      <section className="relative py-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
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
              <span className="font-medium">Your personal collection</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block">Saved</span>
              <span className="font-cursive text-6xl md:text-7xl bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                Photos
              </span>
            </h1>

            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              Your curated collection of favorite photos from talented
              photographers around the world. Easily access and organize the
              images that inspire you.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            {
              icon: Bookmark,
              value: stats.totalSaved.toString(),
              label: "Saved Photos",
              color: "text-indigo-500",
            },
            {
              icon: Grid3X3,
              value: stats.totalCategories.toString(),
              label: "Categories",
              color: "text-purple-500",
            },
            {
              icon: Camera,
              value: stats.totalPhotographers.toString(),
              label: "Photographers",
              color: "text-pink-500",
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-neutral-100 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-600">{stat.label}</div>
                </div>
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
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved photos..."
                className="w-full sm:w-80 pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              />
            </form>

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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-neutral-900">
              Your Saved Photos
            </h2>
            <div className="text-neutral-600">
              {totalPhotos.toLocaleString()} photos
            </div>
          </div>

          {isLoading && savedPhotos.length === 0 ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
            </div>
          ) : savedPhotos.length > 0 ? (
            <>
              <PhotoGrid
                photos={savedPhotos}
                loading={isLoading && page > 0}
                hasMore={hasMore}
                onLoadMore={loadMore}
              />

              {isLoading && page > 0 && (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                </div>
              )}

              {!isLoading && hasMore && (
                <div className="flex justify-center mt-8">
                  <button onClick={loadMore} className="btn-outline">
                    Load More
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="h-32 w-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bookmark className="h-16 w-16 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {searchQuery || selectedCategory
                    ? "No saved photos found"
                    : "No saved photos yet"}
                </h3>
                <p className="text-neutral-600 mb-6">
                  {searchQuery || selectedCategory
                    ? "Try adjusting your search criteria or explore different categories."
                    : "Start saving photos you love by clicking the bookmark icon."}
                </p>
                <Link to="/explore" className="btn-primary">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Explore Photos
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SavedPage;
