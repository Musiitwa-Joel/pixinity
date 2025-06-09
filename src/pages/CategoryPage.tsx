import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { 
  Filter, 
  Grid3X3, 
  List, 
  TrendingUp, 
  Clock, 
  Heart, 
  Download,
  Eye,
  Camera,
  Sparkles,
  Award,
  Users
} from 'lucide-react';
import PhotoGrid from '../components/Common/PhotoGrid';
import { mockPhotos } from '../data/mockData';
import { Photo } from '../types';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'popular' | 'downloads'>('trending');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categoryInfo = {
    nature: {
      title: 'Nature Photography',
      description: 'Breathtaking landscapes, wildlife, and natural wonders captured by talented photographers',
      gradient: 'from-green-600 via-emerald-600 to-teal-600',
      icon: '🌿',
      stats: { photos: '450K', photographers: '12K', downloads: '2.1M' }
    },
    architecture: {
      title: 'Architecture',
      description: 'Modern buildings, historic structures, and architectural marvels from around the world',
      gradient: 'from-gray-600 via-slate-600 to-zinc-600',
      icon: '🏗️',
      stats: { photos: '320K', photographers: '8.5K', downloads: '1.8M' }
    },
    travel: {
      title: 'Travel Photography',
      description: 'Stunning destinations, cultural experiences, and wanderlust-inspiring imagery',
      gradient: 'from-blue-600 via-indigo-600 to-purple-600',
      icon: '✈️',
      stats: { photos: '680K', photographers: '15K', downloads: '3.2M' }
    },
    portraits: {
      title: 'Portrait Photography',
      description: 'Captivating portraits showcasing human emotion, beauty, and storytelling',
      gradient: 'from-pink-600 via-rose-600 to-red-600',
      icon: '👤',
      stats: { photos: '540K', photographers: '18K', downloads: '2.8M' }
    },
    street: {
      title: 'Street Photography',
      description: 'Urban life, candid moments, and the raw energy of city streets',
      gradient: 'from-orange-600 via-amber-600 to-yellow-600',
      icon: '🏙️',
      stats: { photos: '290K', photographers: '9.2K', downloads: '1.5M' }
    },
    abstract: {
      title: 'Abstract Art',
      description: 'Creative compositions, patterns, and artistic interpretations',
      gradient: 'from-purple-600 via-violet-600 to-indigo-600',
      icon: '🎨',
      stats: { photos: '180K', photographers: '6.8K', downloads: '950K' }
    }
  };

  const currentCategory = categoryInfo[category as keyof typeof categoryInfo] || categoryInfo.nature;

  useEffect(() => {
    const loadCategoryPhotos = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter photos by category
      let filteredPhotos = mockPhotos.filter(photo => 
        photo.category.toLowerCase() === category?.toLowerCase() ||
        photo.tags.some(tag => tag.toLowerCase().includes(category?.toLowerCase() || ''))
      );

      // If no specific category photos, show all photos
      if (filteredPhotos.length === 0) {
        filteredPhotos = mockPhotos;
      }

      // Sort photos
      switch (sortBy) {
        case 'newest':
          filteredPhotos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'popular':
          filteredPhotos.sort((a, b) => b.likesCount - a.likesCount);
          break;
        case 'downloads':
          filteredPhotos.sort((a, b) => b.downloadsCount - a.downloadsCount);
          break;
        default: // trending
          filteredPhotos.sort((a, b) => (b.viewsCount + b.likesCount) - (a.viewsCount + a.likesCount));
      }
      
      setPhotos(filteredPhotos);
      setIsLoading(false);
    };

    loadCategoryPhotos();
  }, [category, sortBy]);

  const sortOptions = [
    { value: 'trending', label: 'Trending', icon: TrendingUp },
    { value: 'newest', label: 'Newest', icon: Clock },
    { value: 'popular', label: 'Most Liked', icon: Heart },
    { value: 'downloads', label: 'Most Downloaded', icon: Download }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className={`relative py-20 bg-gradient-to-br ${currentCategory.gradient} text-white overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M50 50c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm-20 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8">
              <span className="text-2xl">{currentCategory.icon}</span>
              <span className="font-medium">Explore {category}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {currentCategory.title}
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-12">
              {currentCategory.description}
            </p>

            {/* Category Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              {[
                { icon: Camera, label: 'Photos', value: currentCategory.stats.photos },
                { icon: Users, label: 'Photographers', value: currentCategory.stats.photographers },
                { icon: Download, label: 'Downloads', value: currentCategory.stats.downloads }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex items-center justify-center mb-3">
                    <stat.icon className="h-8 w-8 text-white/80" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-center justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Sort Options */}
          <div className="flex flex-wrap gap-2 mb-6 lg:mb-0">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  sortBy === option.value
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200'
                }`}
              >
                <option.icon className="h-4 w-4" />
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-4">
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
            
            <button className="btn-outline flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
          </div>
        </motion.div>

        {/* Featured Section */}
        <motion.div
          className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <Award className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-neutral-900">Featured in {currentCategory.title}</h2>
          </div>
          <p className="text-neutral-600 mb-6">
            Handpicked by our editorial team for exceptional quality and creativity
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {photos.slice(0, 3).map((photo, index) => (
              <motion.div
                key={photo.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-semibold mb-1">{photo.title}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span>by {photo.photographer.firstName} {photo.photographer.lastName}</span>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{photo.viewsCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{photo.likesCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Photo Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-neutral-900">
              All {currentCategory.title}
            </h2>
            <div className="text-neutral-600">
              {photos.length.toLocaleString()} photos
            </div>
          </div>
          
          <PhotoGrid 
            photos={photos}
            loading={isLoading}
            hasMore={true}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryPage;