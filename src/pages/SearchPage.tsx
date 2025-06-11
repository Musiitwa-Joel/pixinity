import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PhotoGrid from "../components/Common/PhotoGrid";
import { SearchFilters, Photo } from "../types";
import toast from "react-hot-toast";

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get("q") || "",
    sortBy: "trending",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

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
  const orientations = ["All", "Landscape", "Portrait", "Square"];
  const colors = [
    { name: "All", value: "" },
    { name: "Red", value: "red", color: "#ef4444" },
    { name: "Orange", value: "orange", color: "#f97316" },
    { name: "Yellow", value: "yellow", color: "#eab308" },
    { name: "Green", value: "green", color: "#22c55e" },
    { name: "Blue", value: "blue", color: "#3b82f6" },
    { name: "Purple", value: "purple", color: "#a855f7" },
    { name: "Pink", value: "pink", color: "#ec4899" },
    { name: "Gray", value: "gray", color: "#6b7280" },
    { name: "Black", value: "black", color: "#000000" },
  ];

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
    setFilters((prev) => ({ ...prev, query }));
  }, [searchParams]);

  useEffect(() => {
    searchPhotos();
  }, [filters]);

  const searchPhotos = async () => {
    setIsLoading(true);
    try {
      console.log("🔍 Searching photos with filters:", filters);

      // Build query parameters
      const params = new URLSearchParams();

      if (filters.query) {
        params.append("search", filters.query);
      }

      if (filters.category && filters.category !== "All") {
        params.append("category", filters.category);
      }

      if (filters.sortBy) {
        params.append("sort", filters.sortBy);
      }

      params.append("limit", "50");
      params.append("offset", "0");

      console.log(
        "📡 API request URL:",
        `http://localhost:5000/api/photos?${params.toString()}`
      );

      const response = await fetch(
        `http://localhost:5000/api/photos?${params.toString()}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch photos`);
      }

      const data = await response.json();
      console.log("✅ Search results received:", data);

      // Transform the API response to match our Photo interface
      const transformedPhotos: Photo[] = data.photos.map((photo: any) => ({
        id: photo.id,
        title: photo.title,
        description: photo.description,
        url: photo.url,
        thumbnailUrl: photo.thumbnailUrl,
        width: photo.width,
        height: photo.height,
        orientation: photo.orientation,
        category: photo.category,
        tags: photo.tags,
        color: photo.color,
        exifData: photo.exifData,
        license: photo.license,
        photographer: {
          id: photo.photographer.id,
          username: photo.photographer.username,
          firstName: photo.photographer.firstName,
          lastName: photo.photographer.lastName,
          avatar: photo.photographer.avatar,
          verified: photo.photographer.verified,
          role: photo.photographer.role,
          bio: "",
          website: "",
          location: "",
          socialLinks: {},
          followersCount: 0,
          followingCount: 0,
          uploadsCount: 0,
          totalViews: 0,
          totalDownloads: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        likesCount: photo.likesCount,
        downloadsCount: photo.downloadsCount,
        viewsCount: photo.viewsCount,
        featured: photo.featured,
        approved: photo.approved,
        createdAt: new Date(photo.createdAt),
        updatedAt: new Date(photo.updatedAt),
      }));

      setFilteredPhotos(transformedPhotos);
      setTotalResults(data.total || transformedPhotos.length);

      console.log(
        `🎯 Search complete: ${transformedPhotos.length} photos found`
      );
    } catch (error: any) {
      console.error("❌ Search error:", error);
      toast.error("Failed to search photos. Please try again.");
      setFilteredPhotos([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    } else {
      params.delete("q");
    }
    setSearchParams(params);
  };

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    console.log(`🔧 Updating filter ${key} to:`, value);
    setFilters((prev) => ({
      ...prev,
      [key]: value === "All" ? undefined : value,
    }));
  };

  const clearFilters = () => {
    console.log("🧹 Clearing all filters");
    setFilters({
      query: filters.query,
      sortBy: "trending",
    });
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value && value !== "trending" && value !== filters.query
  ).length;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for photos, photographers, or keywords..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-200 rounded-xl text-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors shadow-sm"
              />
            </div>
          </form>

          {/* Results Info & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {filters.query && (
                <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                  Search results for "{filters.query}"
                </h1>
              )}
              <p className="text-neutral-600">
                {isLoading
                  ? "Searching..."
                  : `${totalResults.toLocaleString()} photos found`}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Sort Dropdown */}
              <select
                value={filters.sortBy || "trending"}
                onChange={(e) => updateFilter("sortBy", e.target.value)}
                className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="trending">Trending</option>
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="views">Most Viewed</option>
                <option value="downloads">Most Downloaded</option>
              </select>

              {/* Filter Button */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`btn-outline flex items-center space-x-2 relative ${
                  activeFiltersCount > 0
                    ? "bg-primary-50 border-primary-300 text-primary-700"
                    : ""
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl border border-neutral-200 p-6 mb-8 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Filters
                </h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-neutral-600 hover:text-primary-600 transition-colors"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <h4 className="font-medium text-neutral-900 mb-3">
                    Category
                  </h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={(filters.category || "All") === category}
                          onChange={(e) =>
                            updateFilter("category", e.target.value)
                          }
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Orientation Filter */}
                <div>
                  <h4 className="font-medium text-neutral-900 mb-3">
                    Orientation
                  </h4>
                  <div className="space-y-2">
                    {orientations.map((orientation) => (
                      <label key={orientation} className="flex items-center">
                        <input
                          type="radio"
                          name="orientation"
                          value={orientation}
                          checked={
                            (filters.orientation || "All") === orientation
                          }
                          onChange={(e) =>
                            updateFilter("orientation", e.target.value)
                          }
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700">
                          {orientation}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                <div>
                  <h4 className="font-medium text-neutral-900 mb-3">Color</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => updateFilter("color", color.value)}
                        className={`aspect-square rounded-lg border-2 transition-all ${
                          (filters.color || "") === color.value
                            ? "border-primary-500 ring-2 ring-primary-200"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                        style={{
                          backgroundColor: color.color || "#f5f5f5",
                          ...(color.name === "All" && {
                            background:
                              "linear-gradient(45deg, #ff0000 0%, #ff8000 14%, #ffff00 28%, #80ff00 42%, #00ff00 57%, #00ff80 71%, #0080ff 85%, #8000ff 100%)",
                          }),
                        }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results Summary */}
        {!isLoading && filters.query && (
          <motion.div
            className="bg-white rounded-xl border border-neutral-200 p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 mb-1">
                  Search Results
                </h2>
                <p className="text-neutral-600">
                  Found {totalResults.toLocaleString()} photos matching "
                  {filters.query}"
                  {filters.category &&
                    filters.category !== "All" &&
                    ` in ${filters.category}`}
                </p>
              </div>
              {totalResults > 0 && (
                <div className="text-sm text-neutral-500">
                  Sorted by{" "}
                  {filters.sortBy === "trending"
                    ? "Trending"
                    : filters.sortBy === "newest"
                    ? "Newest"
                    : filters.sortBy === "popular"
                    ? "Most Popular"
                    : filters.sortBy === "views"
                    ? "Most Viewed"
                    : "Most Downloaded"}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Photo Grid */}
        <PhotoGrid photos={filteredPhotos} loading={isLoading} />

        {/* No Results Message */}
        {!isLoading && filteredPhotos.length === 0 && filters.query && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="max-w-md mx-auto">
              <div className="h-32 w-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-16 w-16 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                No photos found
              </h3>
              <p className="text-neutral-600 mb-6">
                We couldn't find any photos matching "{filters.query}". Try
                adjusting your search terms or browse our categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({ sortBy: "trending" });
                    setSearchParams(new URLSearchParams());
                  }}
                  className="btn-outline"
                >
                  Clear Search
                </button>
                <button
                  onClick={() => (window.location.href = "/explore")}
                  className="btn-primary"
                >
                  Explore All Photos
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
