import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bookmark, 
  Grid3X3, 
  List, 
  Search, 
  Filter,
  Heart,
  Download,
  Eye,
  Calendar,
  Tag,
  Trash2,
  Share2,
  Plus
} from 'lucide-react';
import PhotoGrid from '../components/Common/PhotoGrid';
import { mockPhotos } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { Photo } from '../types';

const SavedPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [savedPhotos, setSavedPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadSavedPhotos = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock saved photos (first 4 photos from mockPhotos)
      const saved = mockPhotos.slice(0, 4);
      setSavedPhotos(saved);
      setIsLoading(false);
    };

    loadSavedPhotos();
  }, [isAuthenticated]);

  const filteredPhotos = savedPhotos.filter(photo =>
    photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    photo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'popular':
        return b.likesCount - a.likesCount;
      default:
        return 0;
    }
  });

  const handleSelectPhoto = (photoId: string) => {
    setSelectedPhotos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedPhotos.size === filteredPhotos.length) {
      setSelectedPhotos(new Set());
    } else {
      setSelectedPhotos(new Set(filteredPhotos.map(photo => photo.id)));
    }
  };

  const handleRemoveSelected = () => {
    setSavedPhotos(prev => prev.filter(photo => !selectedPhotos.has(photo.id)));
    setSelectedPhotos(new Set());
    setIsSelectionMode(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Bookmark className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Access Denied</h2>
          <p className="text-neutral-600">Please log in to view your saved photos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Saved Photos</h1>
              <p className="text-neutral-600">
                {savedPhotos.length} photo{savedPhotos.length !== 1 ? 's' : ''} saved for later
              </p>
            </div>
            
            {savedPhotos.length > 0 && (
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <button
                  onClick={() => setIsSelectionMode(!isSelectionMode)}
                  className={`btn ${isSelectionMode ? 'btn-primary' : 'btn-outline'}`}
                >
                  {isSelectionMode ? 'Cancel' : 'Select'}
                </button>
                
                {isSelectionMode && selectedPhotos.size > 0 && (
                  <button
                    onClick={handleRemoveSelected}
                    className="btn bg-red-500 text-white hover:bg-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove ({selectedPhotos.size})
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {savedPhotos.length > 0 && (
          <>
            {/* Search and Filters */}
            <motion.div
              className="flex flex-col lg:flex-row lg:items-center justify-between mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Search */}
              <div className="relative max-w-md mb-4 lg:mb-0">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search saved photos..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
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
                  <option value="popular">Most Popular</option>
                </select>

                {/* View Mode */}
                <div className="flex items-center bg-white border border-neutral-200 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-primary-500 text-white' 
                        : 'text-neutral-500 hover:text-primary-500'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-primary-500 text-white' 
                        : 'text-neutral-500 hover:text-primary-500'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {isSelectionMode && (
                  <button
                    onClick={handleSelectAll}
                    className="btn-outline text-sm"
                  >
                    {selectedPhotos.size === filteredPhotos.length ? 'Deselect All' : 'Select All'}
                  </button>
                )}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {[
                { icon: Bookmark, value: savedPhotos.length, label: 'Saved Photos', color: 'text-blue-500' },
                { icon: Heart, value: savedPhotos.reduce((sum, photo) => sum + photo.likesCount, 0), label: 'Total Likes', color: 'text-red-500' },
                { icon: Eye, value: savedPhotos.reduce((sum, photo) => sum + photo.viewsCount, 0), label: 'Total Views', color: 'text-green-500' },
                { icon: Download, value: savedPhotos.reduce((sum, photo) => sum + photo.downloadsCount, 0), label: 'Total Downloads', color: 'text-purple-500' }
              ].map((stat, index) => (
                <div key={stat.label} className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg bg-neutral-100 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-neutral-900">{stat.value.toLocaleString()}</div>
                      <div className="text-sm text-neutral-600">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Photos Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {viewMode === 'grid' ? (
                <div className="masonry-grid">
                  {filteredPhotos.map((photo, index) => (
                    <motion.div
                      key={photo.id}
                      className="masonry-item group cursor-pointer relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                    >
                      {isSelectionMode && (
                        <div className="absolute top-3 left-3 z-10">
                          <input
                            type="checkbox"
                            checked={selectedPhotos.has(photo.id)}
                            onChange={() => handleSelectPhoto(photo.id)}
                            className="h-5 w-5 text-primary-600 focus:ring-primary-500 rounded border-2 border-white shadow-lg"
                          />
                        </div>
                      )}
                      
                      <div className="relative bg-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                        <div 
                          className="relative"
                          style={{ aspectRatio: `${photo.width}/${photo.height}` }}
                        >
                          <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover"
                          />
                          
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex space-x-2">
                              <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-neutral-700 hover:bg-white hover:text-red-500 transition-colors">
                                <Heart className="h-4 w-4" />
                              </button>
                              <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-neutral-700 hover:bg-white hover:text-blue-500 transition-colors">
                                <Share2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-medium text-neutral-900 mb-1 line-clamp-2">
                            {photo.title}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <Eye className="h-3 w-3" />
                                <span>{photo.viewsCount.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Heart className="h-3 w-3" />
                                <span>{photo.likesCount.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Saved {new Date(photo.createdAt).toLocaleDateString()}</span>
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
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPhotos.map((photo, index) => (
                    <motion.div
                      key={photo.id}
                      className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-lg transition-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-6">
                        {isSelectionMode && (
                          <input
                            type="checkbox"
                            checked={selectedPhotos.has(photo.id)}
                            onChange={() => handleSelectPhoto(photo.id)}
                            className="h-5 w-5 text-primary-600 focus:ring-primary-500 rounded"
                          />
                        )}
                        
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-900 mb-1">{photo.title}</h3>
                          <p className="text-neutral-600 text-sm mb-2 line-clamp-2">{photo.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-neutral-500">
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
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
                            <Heart className="h-5 w-5" />
                          </button>
                          <button className="p-2 text-neutral-400 hover:text-blue-500 transition-colors">
                            <Share2 className="h-5 w-5" />
                          </button>
                          <button className="p-2 text-neutral-400 hover:text-green-500 transition-colors">
                            <Download className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && savedPhotos.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-md mx-auto">
              <div className="h-32 w-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bookmark className="h-16 w-16 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                No saved photos yet
              </h3>
              <p className="text-neutral-600 mb-6">
                Start exploring and save photos you love to see them here.
              </p>
              <button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Explore Photos
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="masonry-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="masonry-item">
                <div className="bg-white rounded-xl overflow-hidden border border-neutral-200">
                  <div className="aspect-square bg-neutral-200 animate-pulse" />
                  <div className="p-4">
                    <div className="h-4 bg-neutral-200 rounded animate-pulse mb-2" />
                    <div className="h-3 bg-neutral-200 rounded animate-pulse w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPage;