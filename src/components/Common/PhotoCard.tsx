import React, { useState } from 'react';
import { Heart, Download, Bookmark, Share2, User, Eye } from 'lucide-react';
import { Photo } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface PhotoCardProps {
  photo: Photo;
  showStats?: boolean;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, showStats = true }) => {
  const { isAuthenticated } = useAuth();
  const { openPhotoModal, toggleLike, toggleSave, likedPhotos, savedPhotos } = useApp();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isLiked = likedPhotos.has(photo.id);
  const isSaved = savedPhotos.has(photo.id);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAuthenticated) {
      toggleLike(photo.id);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAuthenticated) {
      toggleSave(photo.id);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would trigger the download
    console.log('Downloading photo:', photo.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: photo.title,
        text: photo.description,
        url: window.location.origin + `/photos/${photo.id}`
      });
    }
  };

  return (
    <motion.div
      className="masonry-item group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => openPhotoModal(photo)}
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
              isLoaded ? 'opacity-100' : 'opacity-0'
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
                      ? 'bg-error-500 text-white' 
                      : 'bg-white/80 text-neutral-700 hover:bg-white hover:text-error-500'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleSave}
                  className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                    isSaved 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-white/80 text-neutral-700 hover:bg-white hover:text-primary-500'
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
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
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 hover:bg-white transition-colors"
            >
              <img
                src={photo.photographer.avatar || `https://ui-avatars.com/api/?name=${photo.photographer.firstName}+${photo.photographer.lastName}&background=2563eb&color=ffffff`}
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
        )}
      </div>
    </motion.div>
  );
};

export default PhotoCard;