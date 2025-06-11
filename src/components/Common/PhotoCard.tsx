import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Download,
  Bookmark,
  Share2,
  User,
  Eye,
  MessageCircle,
} from "lucide-react";
import { Photo } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

interface PhotoCardProps {
  photo: Photo;
  showStats?: boolean;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, showStats = true }) => {
  const { isAuthenticated } = useAuth();
  const { openPhotoModal, toggleSave, savedPhotos } = useApp();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(photo.likesCount);
  const [downloadsCount, setDownloadsCount] = useState(photo.downloadsCount);
  const [viewsCount, setViewsCount] = useState(photo.viewsCount);
  const [hasTrackedHover, setHasTrackedHover] = useState(false);
  const [hasTrackedClick, setHasTrackedClick] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isSaved = savedPhotos.has(photo.id);

  // Check if user has liked this photo
  useEffect(() => {
    if (isAuthenticated) {
      checkLikeStatus();
    }
  }, [isAuthenticated, photo.id]);

  const checkLikeStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/photos/${photo.id}/like-status`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
      }
    } catch (error) {
      console.error("Failed to check like status:", error);
    }
  };

  // Track view function
  const trackView = async (interaction: string) => {
    try {
      console.log(`🔍 Tracking ${interaction} view for photo ${photo.id}`);

      const response = await fetch(
        `http://localhost:5000/api/photos/${photo.id}/view`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            interaction,
            timestamp: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setViewsCount(data.viewsCount);
        console.log(
          `✅ ${interaction} view tracked. New count: ${data.viewsCount}`
        );
      }
    } catch (error) {
      console.error(`Failed to track ${interaction} view:`, error);
    }
  };

  // Handle mouse enter with delay
  const handleMouseEnter = () => {
    setIsHovered(true);

    // Track hover view after 1 second of hovering
    if (!hasTrackedHover) {
      hoverTimeoutRef.current = setTimeout(() => {
        trackView("hover");
        setHasTrackedHover(true);
      }, 1000); // 1 second delay
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovered(false);

    // Clear hover timeout if user leaves before 1 second
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  // Handle any click on the photo card
  const handlePhotoClick = () => {
    // Track click view
    if (!hasTrackedClick) {
      trackView("click");
      setHasTrackedClick(true);
    }

    // Open photo modal
    openPhotoModal(photo);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Track interaction view
    trackView("like_interaction");

    if (!isAuthenticated) {
      toast.error("Please sign in to like photos");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/photos/${photo.id}/like`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
        setLikesCount(data.likesCount);
        toast.success(data.message);
      } else {
        throw new Error("Failed to like photo");
      }
    } catch (error) {
      console.error("Like error:", error);
      toast.error("Failed to like photo");
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Track interaction view
    trackView("save_interaction");

    if (!isAuthenticated) {
      toast.error("Please sign in to save photos");
      return;
    }
    toggleSave(photo.id);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Track interaction view
    trackView("download_interaction");

    try {
      const response = await fetch(
        `http://localhost:5000/api/photos/${photo.id}/download`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDownloadsCount(data.downloadsCount);

        // Create download link
        const link = document.createElement("a");
        link.href = photo.url;
        link.download = `${photo.title}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Photo downloaded successfully!");
      } else {
        throw new Error("Failed to track download");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download photo");
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Track interaction view
    trackView("share_interaction");

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

  const handlePhotographerClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Track interaction view
    trackView("photographer_click");
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      className="masonry-item group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handlePhotoClick}
    >
      <div className="relative bg-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
        {/* Image */}
        <div
          className="relative"
          style={{ aspectRatio: `${photo.width}/${photo.height}` }}
        >
          <img
            src={photo.url}
            alt={photo.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsLoaded(true)}
            loading="lazy"
          />

          {!isLoaded && (
            <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
          )}

          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
          />

          {/* Action Buttons */}
          <motion.div
            className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            {isAuthenticated && (
              <>
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                    isLiked
                      ? "bg-error-500 text-white"
                      : "bg-white/80 text-neutral-700 hover:bg-white hover:text-error-500"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                  />
                </button>
                <button
                  onClick={handleSave}
                  className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                    isSaved
                      ? "bg-primary-500 text-white"
                      : "bg-white/80 text-neutral-700 hover:bg-white hover:text-primary-500"
                  }`}
                >
                  <Bookmark
                    className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
                  />
                </button>
              </>
            )}
          </motion.div>

          {/* Bottom Actions */}
          <motion.div
            className="absolute bottom-3 left-3 right-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <Link
              to={`/@${photo.photographer.username}`}
              onClick={handlePhotographerClick}
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 hover:bg-white transition-colors"
            >
              <img
                src={
                  photo.photographer.avatar ||
                  `https://ui-avatars.com/api/?name=${photo.photographer.firstName}+${photo.photographer.lastName}&background=2563eb&color=ffffff`
                }
                alt={photo.photographer.username}
                className="h-6 w-6 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-neutral-900">
                {photo.photographer.firstName} {photo.photographer.lastName}
              </span>
            </Link>

            <div className="flex space-x-2">
              <button
                onClick={handleShare}
                className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-neutral-700 hover:bg-white hover:text-primary-500 transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-neutral-700 hover:bg-white hover:text-success-500 transition-colors"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Photo Info */}
        {showStats && (
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
                  <span>{viewsCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart
                    className={`h-3 w-3 ${
                      isLiked ? "text-error-500 fill-current" : ""
                    }`}
                  />
                  <span>{likesCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="h-3 w-3" />
                  <span>{downloadsCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>0</span>
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
        )}
      </div>
    </motion.div>
  );
};

export default PhotoCard;
