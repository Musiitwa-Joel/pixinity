import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Heart, 
  Bookmark, 
  Share2, 
  Eye, 
  Calendar,
  Camera,
  MapPin,
  Tag,
  User,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const PhotoModal: React.FC = () => {
  const { isPhotoModalOpen, selectedPhoto, closePhotoModal, toggleLike, toggleSave, likedPhotos, savedPhotos } = useApp();
  const { isAuthenticated } = useAuth();

  const isLiked = selectedPhoto ? likedPhotos.has(selectedPhoto.id) : false;
  const isSaved = selectedPhoto ? savedPhotos.has(selectedPhoto.id) : false;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePhotoModal();
      }
    };

    if (isPhotoModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isPhotoModalOpen, closePhotoModal]);

  if (!selectedPhoto) return null;

  const handleLike = () => {
    if (isAuthenticated) {
      toggleLike(selectedPhoto.id);
    }
  };

  const handleSave = () => {
    if (isAuthenticated) {
      toggleSave(selectedPhoto.id);
    }
  };

  const handleDownload = () => {
    console.log('Downloading photo:', selectedPhoto.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedPhoto.title,
        text: selectedPhoto.description,
        url: window.location.origin + `/photos/${selectedPhoto.id}`
      });
    }
  };

  return (
    <AnimatePresence>
      {isPhotoModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePhotoModal}
          />

          {/* Modal Content */}
          <motion.div
            className="relative max-w-7xl max-h-full w-full flex bg-white rounded-xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Close Button */}
            <button
              onClick={closePhotoModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image Section */}
            <div className="flex-1 relative bg-neutral-100 flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Info Panel */}
            <div className="w-80 bg-white flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between mb-4">
                  <Link
                    to={`/@${selectedPhoto.photographer.username}`}
                    className="flex items-center space-x-3 group"
                  >
                    <img
                      src={selectedPhoto.photographer.avatar || `https://ui-avatars.com/api/?name=${selectedPhoto.photographer.firstName}+${selectedPhoto.photographer.lastName}&background=2563eb&color=ffffff`}
                      alt={selectedPhoto.photographer.username}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                        {selectedPhoto.photographer.firstName} {selectedPhoto.photographer.lastName}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        @{selectedPhoto.photographer.username}
                      </p>
                    </div>
                  </Link>
                  
                  <button className="btn-outline text-sm">
                    Follow
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {isAuthenticated && (
                    <>
                      <button
                        onClick={handleLike}
                        className={`flex-1 btn ${
                          isLiked 
                            ? 'bg-error-500 text-white hover:bg-error-600' 
                            : 'btn-outline'
                        }`}
                      >
                        <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                        {isLiked ? 'Liked' : 'Like'}
                      </button>
                      <button
                        onClick={handleSave}
                        className={`flex-1 btn ${
                          isSaved 
                            ? 'bg-primary-500 text-white hover:bg-primary-600' 
                            : 'btn-outline'
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                        {isSaved ? 'Saved' : 'Save'}
                      </button>
                    </>
                  )}
                </div>

                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={handleDownload}
                    className="flex-1 btn-primary"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={handleShare}
                    className="btn-outline px-3"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Photo Info */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* Title & Description */}
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                      {selectedPhoto.title}
                    </h2>
                    {selectedPhoto.description && (
                      <p className="text-neutral-600 leading-relaxed">
                        {selectedPhoto.description}
                      </p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 py-4 border-y border-neutral-200">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Eye className="h-4 w-4 text-neutral-400" />
                      </div>
                      <div className="font-semibold text-neutral-900">
                        {selectedPhoto.viewsCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-neutral-500">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Heart className="h-4 w-4 text-neutral-400" />
                      </div>
                      <div className="font-semibold text-neutral-900">
                        {selectedPhoto.likesCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-neutral-500">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Download className="h-4 w-4 text-neutral-400" />
                      </div>
                      <div className="font-semibold text-neutral-900">
                        {selectedPhoto.downloadsCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-neutral-500">Downloads</div>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedPhoto.tags.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Tag className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-700">Tags</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedPhoto.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-full text-sm text-neutral-700 cursor-pointer transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* EXIF Data */}
                  {selectedPhoto.exifData && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Camera className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-700">Camera Info</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        {selectedPhoto.exifData.camera && (
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Camera</span>
                            <span className="text-neutral-900">{selectedPhoto.exifData.camera}</span>
                          </div>
                        )}
                        {selectedPhoto.exifData.lens && (
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Lens</span>
                            <span className="text-neutral-900">{selectedPhoto.exifData.lens}</span>
                          </div>
                        )}
                        {selectedPhoto.exifData.focalLength && (
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Focal Length</span>
                            <span className="text-neutral-900">{selectedPhoto.exifData.focalLength}</span>
                          </div>
                        )}
                        {selectedPhoto.exifData.aperture && (
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Aperture</span>
                            <span className="text-neutral-900">{selectedPhoto.exifData.aperture}</span>
                          </div>
                        )}
                        {selectedPhoto.exifData.shutterSpeed && (
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Shutter</span>
                            <span className="text-neutral-900">{selectedPhoto.exifData.shutterSpeed}</span>
                          </div>
                        )}
                        {selectedPhoto.exifData.iso && (
                          <div className="flex justify-between">
                            <span className="text-neutral-500">ISO</span>
                            <span className="text-neutral-900">{selectedPhoto.exifData.iso}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Date & Location */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-neutral-400" />
                      <span className="text-sm text-neutral-600">
                        Published {new Date(selectedPhoto.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    {selectedPhoto.exifData?.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-600">
                          {selectedPhoto.exifData.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* License */}
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <div className="text-sm">
                      <span className="font-medium text-neutral-700">License: </span>
                      <span className="text-neutral-600">
                        {selectedPhoto.license === 'free' && 'Free to use'}
                        {selectedPhoto.license === 'cc0' && 'CC0 Public Domain'}
                        {selectedPhoto.license === 'attribution' && 'Attribution Required'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhotoModal;