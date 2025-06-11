import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Grid3X3,
  List,
  Search,
  Filter,
  Users,
  Lock,
  Globe,
  Heart,
  Eye,
  Image,
  Sparkles,
  TrendingUp,
  SlidersHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Collection } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { collectionsService } from "../../server/services/collectionsService";
import CreateCollectionModal from "../components/Collections/CreateCollectionModal";
import EditCollectionModal from "../components/Collections/EditCollectionModal";
import DeleteCollectionModal from "../components/Collections/DeleteCollectionModal";
import CollectionCard from "../components/Collections/CollectionCard";
import toast from "react-hot-toast";

const CollectionsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "public" | "private" | "mine"
  >("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "photos">(
    "newest"
  );
  const [totalCollections, setTotalCollections] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    public: 0,
    private: 0,
    mine: 0,
    trending: 0,
    collaborative: 0,
  });

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  useEffect(() => {
    loadCollections();
    loadStats();
  }, [activeFilter, searchQuery, sortBy, user]);

  const loadCollections = async () => {
    setIsLoading(true);
    try {
      const filters = {
        filter: activeFilter,
        search: searchQuery,
        sort: sortBy,
        user_id:
          activeFilter === "mine" || activeFilter === "private"
            ? user?.id
            : undefined,
        limit: 20,
        offset: 0,
      };

      const response = await collectionsService.getCollections(filters);
      setCollections(response.collections);
      setTotalCollections(response.total);
    } catch (error: any) {
      console.error("Failed to load collections:", error);
      toast.error("Failed to load collections");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Load all collections to calculate stats
      const allCollections = await collectionsService.getCollections({
        limit: 1000,
        offset: 0,
      });

      const publicCollections = await collectionsService.getCollections({
        filter: "public",
        limit: 1000,
        offset: 0,
      });

      let privateCollections = { total: 0 };
      let myCollections = { total: 0 };

      if (user) {
        privateCollections = await collectionsService.getCollections({
          filter: "private",
          user_id: user.id,
          limit: 1000,
          offset: 0,
        });

        myCollections = await collectionsService.getCollections({
          filter: "mine",
          user_id: user.id,
          limit: 1000,
          offset: 0,
        });
      }

      // Calculate collaborative collections
      const collaborativeCount = allCollections.collections.filter(
        (c) => c.isCollaborative
      ).length;

      // Calculate trending (collections created in the last week with high activity)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const trendingCount = allCollections.collections.filter((c) => {
        const createdAt = new Date(c.createdAt);
        return createdAt >= oneWeekAgo && c.photosCount > 0;
      }).length;

      setStats({
        total: allCollections.total,
        public: publicCollections.total,
        private: privateCollections.total,
        mine: myCollections.total,
        trending: trendingCount,
        collaborative: collaborativeCount,
      });
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const filters = [
    { id: "all", label: "All Collections", count: stats.total.toString() },
    { id: "public", label: "Public", count: stats.public.toString() },
    { id: "private", label: "Private", count: stats.private.toString() },
    { id: "mine", label: "My Collections", count: stats.mine.toString() },
  ];

  const handleCollectionCreated = (newCollection: Collection) => {
    setCollections((prev) => [newCollection, ...prev]);
    setTotalCollections((prev) => prev + 1);
    loadStats(); // Reload stats after creating a collection
  };

  const handleCollectionUpdated = (updatedCollection: Collection) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === updatedCollection.id ? updatedCollection : c))
    );
    loadStats(); // Reload stats after updating a collection
  };

  const handleCollectionDeleted = (collectionId: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== collectionId));
    setTotalCollections((prev) => prev - 1);
    loadStats(); // Reload stats after deleting a collection
  };

  const handleEditCollection = (collection: Collection) => {
    console.log(
      "Edit collection clicked:",
      collection.id,
      "Owner:",
      collection.creator.id,
      "Current user:",
      user?.id
    );
    setSelectedCollection(collection);
    setIsEditModalOpen(true);
  };

  const handleDeleteCollection = (collection: Collection) => {
    console.log(
      "Delete collection clicked:",
      collection.id,
      "Owner:",
      collection.creator.id,
      "Current user:",
      user?.id
    );
    setSelectedCollection(collection);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white overflow-hidden">
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
              <span className="font-medium">Curated photo collections</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block">Discover</span>
              <span className="font-cursive text-6xl md:text-7xl bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                collections
              </span>
            </h1>

            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              Explore thoughtfully curated photo collections from talented
              creators. Find inspiration, discover themes, and create your own
              visual stories.
            </p>

            {isAuthenticated && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn bg-white text-purple-600 hover:bg-neutral-100 text-lg px-8 py-4 group shadow-2xl"
              >
                <Plus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Create Collection</span>
              </button>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-center justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Search */}
          <div className="relative max-w-md mb-6 lg:mb-0">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections..."
              className="w-full sm:w-80 pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="photos">Most Photos</option>
            </select>

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

        {/* Filter Tabs */}
        <motion.div
          className="flex flex-wrap gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                activeFilter === filter.id
                  ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                  : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200"
              }`}
            >
              <span className="font-medium">{filter.label}</span>
              <span
                className={`ml-2 text-sm ${
                  activeFilter === filter.id
                    ? "text-white/80"
                    : "text-neutral-500"
                }`}
              >
                {filter.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {[
            {
              icon: Grid3X3,
              value: stats.total.toString(),
              label: "Total Collections",
              color: "text-blue-500",
            },
            {
              icon: TrendingUp,
              value: stats.trending.toString(),
              label: "Trending This Week",
              color: "text-green-500",
            },
            {
              icon: Users,
              value: stats.collaborative.toString(),
              label: "Collaborative",
              color: "text-purple-500",
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

        {/* Collections Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden border border-neutral-200"
                >
                  <div className="aspect-video bg-neutral-200 animate-pulse" />
                  <div className="p-6">
                    <div className="h-6 bg-neutral-200 rounded animate-pulse mb-2" />
                    <div className="h-4 bg-neutral-200 rounded animate-pulse mb-4 w-3/4" />
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-neutral-200 rounded-full animate-pulse" />
                      <div>
                        <div className="h-4 bg-neutral-200 rounded animate-pulse mb-1 w-24" />
                        <div className="h-3 bg-neutral-200 rounded animate-pulse w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((collection, index) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  index={index}
                  onEdit={handleEditCollection}
                  onDelete={handleDeleteCollection}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Empty State */}
        {!isLoading && collections.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-md mx-auto">
              <div className="h-32 w-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Grid3X3 className="h-16 w-16 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                No collections found
              </h3>
              <p className="text-neutral-600 mb-6">
                {searchQuery
                  ? "Try adjusting your search or explore different categories."
                  : "Be the first to create a collection!"}
              </p>
              {isAuthenticated && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn-primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Collection
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <CreateCollectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCollectionCreated={handleCollectionCreated}
      />

      <EditCollectionModal
        isOpen={isEditModalOpen}
        collection={selectedCollection}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCollection(null);
        }}
        onCollectionUpdated={handleCollectionUpdated}
      />

      <DeleteCollectionModal
        isOpen={isDeleteModalOpen}
        collection={selectedCollection}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCollection(null);
        }}
        onCollectionDeleted={handleCollectionDeleted}
      />
    </div>
  );
};

export default CollectionsPage;
