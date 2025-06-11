import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Eye,
  Download,
  Heart,
  Camera,
  Sparkles,
  Filter,
  Grid3X3,
  List,
  Search,
  Clock,
  Award,
} from "lucide-react";
import PhotoGrid from "../components/Common/PhotoGrid";
import { Photo } from "../types";
import { useApp } from "../contexts/AppContext";

const ExplorePage: React.FC = () => {
  const { setPhotos } = useApp();
  const [photos, setLocalPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "trending" | "newest" | "popular" | "downloads"
  >("trending");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stats, setStats] = useState({
    totalViews: 0,
    totalDownloads: 0,
    totalLikes: 0,
    activePhotographers: 0,
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
    { value: "trending", label: "Trending", icon: TrendingUp },
    { value: "newest", label: "Newest", icon: Clock },
    { value: "popular", label: "Most Liked", icon: Heart },
    { value: "downloads", label: "Most Downloaded", icon: Download },
  ];

  useEffect(() => {
    loadPhotos();
    loadStats();
  }, [searchQuery, sortBy, selectedCategory]);

  const loadStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/photos/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const loadPhotos = async () => {
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

      const response = await fetch(
        `http://localhost:5000/api/photos?${params}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }

      const data = await response.json();
      setLocalPhotos(data.photos);
      setPhotos(data.photos);
    } catch (error) {
      console.error("Failed to load photos:", error);
      // Fallback to empty array
      setLocalPhotos([]);
      setPhotos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadPhotos();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M50 50c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm-20 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
              <span className="font-medium">Discover amazing photography</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block">Explore</span>
              <span className="font-cursive text-6xl md:text-7xl bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                creativity
              </span>
            </h1>

            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Discover breathtaking photography from talented creators around
              the world. Find inspiration, explore different styles, and connect
              with the global photography community.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            {
              icon: Eye,
              value: stats.totalViews.toLocaleString(),
              label: "Total Views",
              color: "text-blue-500",
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
              color: "text-green-500",
            },
            {
              icon: Users,
              value: stats.activePhotographers.toLocaleString(),
              label: "Photographers",
              color: "text-purple-500",
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

        {/* Search and Filters */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-center justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 lg:mb-0">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search amazing photos..."
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

        {/* Featured Section */}
        <motion.div
          className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <Award className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-neutral-900">
              Featured Photography
            </h2>
          </div>
          <p className="text-neutral-600 mb-6">
            Handpicked by our editorial team for exceptional quality and
            creativity
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {photos.slice(0, 3).map((photo, index) => (
              <motion.div
                key={photo.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-semibold mb-1">{photo.title}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        by {photo.photographer.firstName}{" "}
                        {photo.photographer.lastName}
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{photo.viewsCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{photo.likesCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Photo Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-neutral-900">
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : "Discover Photography"}
            </h2>
            <div className="text-neutral-600">
              {photos.length.toLocaleString()} photos
            </div>
          </div>

          <PhotoGrid photos={photos} loading={isLoading} hasMore={true} />
        </motion.div>
      </div>
    </div>
  );
};

export default ExplorePage;
