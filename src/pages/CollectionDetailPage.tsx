import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Share2,
  Download,
  Plus,
  Edit3,
  Trash2,
  Users,
  Lock,
  Globe,
  Calendar,
  Eye,
  MoreVertical,
  Grid3X3,
  List,
  Filter,
} from "lucide-react";
import { Collection, Photo } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { collectionsService } from "../../server/services/collectionsService";
import PhotoGrid from "../components/Common/PhotoGrid";
import EditCollectionModal from "../components/Collections/EditCollectionModal";
import DeleteCollectionModal from "../components/Collections/DeleteCollectionModal";
import toast from "react-hot-toast";

const CollectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">(
    "newest"
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (id) {
      loadCollection();
    }
  }, [id]);

  const loadCollection = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const collectionData = await collectionsService.getCollection(id);
      setCollection(collectionData);
    } catch (error: any) {
      console.error("Failed to load collection:", error);
      toast.error("Failed to load collection");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-neutral-200 rounded animate-pulse w-32 mb-4" />
            <div className="h-12 bg-neutral-200 rounded animate-pulse w-96 mb-4" />
            <div className="h-4 bg-neutral-200 rounded animate-pulse w-64" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-neutral-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-32 w-32 bg-neutral-200 rounded-full mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            Collection not found
          </h2>
          <p className="text-neutral-600 mb-4">
            The collection you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/collections")}
            className="btn-primary"
          >
            Back to Collections
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === collection.creator.id;
  const canEdit = isOwner;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: collection.title,
        text: collection.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  const handleCollectionUpdated = (updatedCollection: Collection) => {
    setCollection(updatedCollection);
  };

  const handleCollectionDeleted = () => {
    navigate("/collections");
  };

  const sortedPhotos = [...collection.photos].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "popular":
        return b.likesCount - a.likesCount;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate("/collections")}
          className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Collections</span>
        </motion.button>

        {/* Collection Header */}
        <motion.div
          className="bg-white rounded-2xl p-8 mb-8 border border-neutral-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1 mb-6 lg:mb-0">
              {/* Title and Type */}
              <div className="flex items-center space-x-3 mb-4">
                <h1 className="text-4xl font-bold text-neutral-900">
                  {collection.title}
                </h1>
                <div
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                    collection.isPrivate
                      ? "bg-red-100 text-red-700"
                      : collection.isCollaborative
                      ? "bg-purple-100 text-purple-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {collection.isPrivate ? (
                    <>
                      <Lock className="h-3 w-3" />
                      <span>Private</span>
                    </>
                  ) : collection.isCollaborative ? (
                    <>
                      <Users className="h-3 w-3" />
                      <span>Collaborative</span>
                    </>
                  ) : (
                    <>
                      <Globe className="h-3 w-3" />
                      <span>Public</span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              {collection.description && (
                <p className="text-lg text-neutral-600 leading-relaxed mb-6 max-w-3xl">
                  {collection.description}
                </p>
              )}

              {/* Creator Info */}
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={
                    collection.creator.avatar ||
                    `https://ui-avatars.com/api/?name=${collection.creator.firstName}+${collection.creator.lastName}&background=2563eb&color=ffffff`
                  }
                  alt={collection.creator.username}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-neutral-900">
                    {collection.creator.firstName} {collection.creator.lastName}
                  </p>
                  <p className="text-neutral-600">
                    @{collection.creator.username}
                  </p>
                </div>
                {!isOwner && (
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`btn ${
                      isFollowing ? "btn-outline" : "btn-primary"
                    }`}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 text-sm text-neutral-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Created{" "}
                    {new Date(collection.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{(Math.random() * 1000).toFixed(0)} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{(Math.random() * 100).toFixed(0)} likes</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button onClick={handleShare} className="btn-outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </button>

              {canEdit && (
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="btn-outline p-3"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-10"
                    >
                      <button
                        onClick={() => {
                          setIsEditModalOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 w-full text-left"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit Collection</span>
                      </button>

                      {isOwner && (
                        <button
                          onClick={() => {
                            setIsDeleteModalOpen(true);
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Collection</span>
                        </button>
                      )}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Photos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Photos Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Photos ({collection.photosCount})
              </h2>
              <p className="text-neutral-600">
                {collection.photosCount === 0
                  ? "No photos in this collection yet"
                  : `Explore ${collection.photosCount} amazing photos`}
              </p>
            </div>

            {collection.photosCount > 0 && (
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
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
            )}
          </div>

          {/* Photos Grid */}
          {collection.photosCount > 0 ? (
            <PhotoGrid photos={sortedPhotos} loading={false} />
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="h-32 w-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="h-16 w-16 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  No photos yet
                </h3>
                <p className="text-neutral-600 mb-6">
                  {canEdit
                    ? "Start adding photos to this collection to bring it to life."
                    : "This collection doesn't have any photos yet."}
                </p>
                {canEdit && (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="btn-primary"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Photos
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <EditCollectionModal
        isOpen={isEditModalOpen}
        collection={collection}
        onClose={() => setIsEditModalOpen(false)}
        onCollectionUpdated={handleCollectionUpdated}
      />

      <DeleteCollectionModal
        isOpen={isDeleteModalOpen}
        collection={collection}
        onClose={() => setIsDeleteModalOpen(false)}
        onCollectionDeleted={handleCollectionDeleted}
      />
    </div>
  );
};

export default CollectionDetailPage;
