import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Eye, Link } from "lucide-react";
import { Photo } from "../../types";

interface FeaturedPhotoGridProps {
  photos: Photo[];
  isLoading?: boolean;
}

const FeaturedPhotoGrid: React.FC<FeaturedPhotoGridProps> = ({
  photos,
  isLoading = false,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading ? (
        // Loading skeletons
        Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="aspect-[4/5] bg-neutral-200 rounded-xl animate-pulse"
          />
        ))
      ) : photos.length > 0 ? (
        // Actual photos
        photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            className="group cursor-pointer overflow-hidden rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <a href={`/photos/${photo.id}`}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">
                    {photo.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={
                          photo.photographer.avatar ||
                          `https://ui-avatars.com/api/?name=${photo.photographer.firstName}+${photo.photographer.lastName}&background=2563eb&color=ffffff`
                        }
                        alt={photo.photographer.username}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white"
                      />
                      <span className="text-sm font-medium">
                        {photo.photographer.firstName}{" "}
                        {photo.photographer.lastName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{photo.likesCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{photo.viewsCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </motion.div>
        ))
      ) : (
        // Empty state
        <div className="col-span-3 text-center py-12">
          <div className="h-24 w-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Link className="h-12 w-12 text-neutral-400" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            No featured photos found
          </h3>
          <p className="text-neutral-600">
            Our editorial team is curating the best photos. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
};

export default FeaturedPhotoGrid;
