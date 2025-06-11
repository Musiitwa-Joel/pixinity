import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MoreVertical,
  Edit3,
  Trash2,
  Share2,
  Copy,
  Eye,
  Lock,
  Globe,
  Users,
  Image,
  Heart,
  Download,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Collection } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

interface CollectionCardProps {
  collection: Collection;
  index: number;
  onEdit: (collection: Collection) => void;
  onDelete: (collection: Collection) => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  index,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [viewsCount, setViewsCount] = useState(collection.viewsCount || 0);
  const [likesCount, setLikesCount] = useState(collection.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState(
    collection.commentsCount || 0
  );

  // Check if current user is the owner - ensure both IDs are strings
  const currentUserId = user?.id?.toString();
  const creatorId = collection.creator.id?.toString();
  const isOwner = currentUserId === creatorId;

  // Track view when card is hovered for more than 1 second
  useEffect(() => {
    let hoverTimeout: NodeJS.Timeout;

    if (isHovered && !hasTrackedView) {
      hoverTimeout = setTimeout(() => {
        trackView();
        setHasTrackedView(true);
      }, 1000);
    }

    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [isHovered, hasTrackedView]);

  const trackView = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/collections/${collection.id}/view`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            interaction: "card_hover",
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setViewsCount(data.viewsCount);
      }
    } catch (error) {
      console.error("Failed to track view:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: collection.title,
        text: collection.description,
        url: window.location.origin + `/collections/${collection.id}`,
      });
    } else {
      navigator.clipboard.writeText(
        window.location.origin + `/collections/${collection.id}`
      );
      toast.success("Link copied to clipboard");
    }
    setIsMenuOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      window.location.origin + `/collections/${collection.id}`
    );
    toast.success("Link copied to clipboard");
    setIsMenuOpen(false);
  };

  const handleEdit = () => {
    console.log("Edit button clicked for collection:", collection.id);
    onEdit(collection);
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    console.log("Delete button clicked for collection:", collection.id);
    onDelete(collection);
    setIsMenuOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsMenuOpen(false);
      }}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-200">
        {/* Cover Image */}
        <div className="relative aspect-video overflow-hidden">
          {collection.coverPhoto ? (
            <img
              src={collection.coverPhoto.url}
              alt={collection.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
              <Image className="h-12 w-12 text-neutral-400" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Type Badge */}
          <div className="absolute top-4 left-4">
            <div
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                collection.isPrivate
                  ? "bg-red-500/90 text-white"
                  : collection.isCollaborative
                  ? "bg-purple-500/90 text-white"
                  : "bg-green-500/90 text-white"
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

          {/* Photo Count */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            {collection.photosCount} photos
          </div>

          {/* Menu Button */}
          <div className="absolute bottom-4 right-4">
            <div
              className={`transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                  }}
                  className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-neutral-700 hover:bg-white transition-colors"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleShare();
                      }}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 w-full text-left"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCopyLink();
                      }}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 w-full text-left"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy Link</span>
                    </button>

                    {/* Owner Actions */}
                    {isOwner && (
                      <>
                        <div className="border-t border-neutral-100 my-1" />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEdit();
                          }}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 w-full text-left"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span>Edit Collection</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete();
                          }}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete Collection</span>
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Overlay */}
          <motion.div
            className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <div className="flex space-x-4 text-white text-sm">
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{viewsCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>{likesCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-3 w-3" />
                <span>{commentsCount}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <Link to={`/collections/${collection.id}`} className="block p-6">
          <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {collection.title}
          </h3>

          {collection.description && (
            <p className="text-neutral-600 mb-4 line-clamp-3 leading-relaxed">
              {collection.description}
            </p>
          )}

          {/* Creator Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={
                  collection.creator.avatar ||
                  `https://ui-avatars.com/api/?name=${collection.creator.firstName}+${collection.creator.lastName}&background=2563eb&color=ffffff`
                }
                alt={collection.creator.username}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-neutral-900">
                  {collection.creator.firstName} {collection.creator.lastName}
                </p>
                <p className="text-sm text-neutral-500">
                  @{collection.creator.username}
                </p>
              </div>
            </div>

            {collection.isCollaborative &&
              collection.collaborators &&
              collection.collaborators.length > 0 && (
                <div className="flex -space-x-2">
                  {collection.collaborators
                    .slice(0, 3)
                    .map((collaborator, idx) => (
                      <img
                        key={collaborator.id}
                        src={
                          collaborator.avatar ||
                          `https://ui-avatars.com/api/?name=${collaborator.firstName}+${collaborator.lastName}&background=2563eb&color=ffffff`
                        }
                        alt={collaborator.username}
                        className="h-8 w-8 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                  {collection.collaborators.length > 3 && (
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-neutral-200 flex items-center justify-center text-xs font-medium text-neutral-600">
                      +{collection.collaborators.length - 3}
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100 text-xs text-neutral-500">
            <span>
              Updated {new Date(collection.updatedAt).toLocaleDateString()}
            </span>
            <div className="flex items-center space-x-3">
              <span>{collection.photosCount} photos</span>
              {collection.isCollaborative && (
                <span className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>Collaborative</span>
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default CollectionCard;
