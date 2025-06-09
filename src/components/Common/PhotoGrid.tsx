import React, { useEffect, useState } from 'react';
import { Photo } from '../../types';
import PhotoCard from './PhotoCard';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface PhotoGridProps {
  photos: Photo[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ 
  photos, 
  loading = false, 
  hasMore = false, 
  onLoadMore 
}) => {
  const [visiblePhotos, setVisiblePhotos] = useState<Photo[]>([]);

  useEffect(() => {
    // Animate photos in batches
    const animatePhotos = async () => {
      for (let i = 0; i < photos.length; i += 6) {
        const batch = photos.slice(i, i + 6);
        setVisiblePhotos(prev => [...prev, ...batch]);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    };

    setVisiblePhotos([]);
    animatePhotos();
  }, [photos]);

  useEffect(() => {
    if (!hasMore || !onLoadMore) return;

    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop 
          >= document.documentElement.offsetHeight - 1000) {
        onLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, onLoadMore]);

  if (photos.length === 0 && !loading) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="h-32 w-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="h-16 w-16 bg-neutral-200 rounded-full" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            No photos found
          </h3>
          <p className="text-neutral-600">
            Try adjusting your search criteria or explore different categories.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="masonry-grid">
        {visiblePhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: (index % 6) * 0.1 
            }}
          >
            <PhotoCard photo={photo} />
          </motion.div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;