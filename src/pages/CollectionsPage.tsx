import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockCollections, mockUsers } from '../data/mockData';
import { Collection } from '../types';
import { useAuth } from '../contexts/AuthContext';

const CollectionsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'public' | 'collaborative'>('all');

  const filters = [
    { id: 'all', label: 'All Collections', count: '2.4K' },
    { id: 'public', label: 'Public', count: '1.8K' },
    { id: 'collaborative', label: 'Collaborative', count: '640' }
  ];

  useEffect(() => {
    const loadCollections = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredCollections = [...mockCollections];
      
      if (activeFilter === 'public') {
        filteredCollections = filteredCollections.filter(c => !c.isPrivate);
      } else if (activeFilter === 'collaborative') {
        filteredCollections = filteredCollections.filter(c => c.isCollaborative);
      }
      
      if (searchQuery) {
        filteredCollections = filteredCollections.filter(c =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setCollections(filteredCollections);
      setIsLoading(false);
    };

    loadCollections();
  }, [activeFilter, searchQuery]);

  const CollectionCard: React.FC<{ collection: Collection; index: number }> = ({ collection, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link
        to={`/collections/${collection.id}`}
        className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-200"
      >
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
          
          {/* Collection Type Badge */}
          <div className="absolute top-4 left-4">
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
              collection.isPrivate 
                ? 'bg-red-500/90 text-white' 
                : collection.isCollaborative 
                ? 'bg-purple-500/90 text-white'
                : 'bg-green-500/90 text-white'
            }`}>
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
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
            {collection.title}
          </h3>
          
          {collection.description && (
            <p className="text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
              {collection.description}
            </p>
          )}

          {/* Creator Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={collection.creator.avatar || `https://ui-avatars.com/api/?name=${collection.creator.firstName}+${collection.creator.lastName}&background=2563eb&color=ffffff`}
                alt={collection.creator.username}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-neutral-900">
                  {collection.creator.firstName} {collection.creator.lastName}
                </p>
                <p className="text-sm text-neutral-500">@{collection.creator.username}</p>
              </div>
            </div>

            {collection.isCollaborative && collection.collaborators && (
              <div className="flex -space-x-2">
                {collection.collaborators.slice(0, 3).map((collaborator, idx) => (
                  <img
                    key={collaborator.id}
                    src={collaborator.avatar || `https://ui-avatars.com/api/?name=${collaborator.firstName}+${collaborator.lastName}&background=2563eb&color=ffffff`}
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
        </div>
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M40 40c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20zm-20-20c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
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
              Explore thoughtfully curated photo collections from talented creators. 
              Find inspiration, discover themes, and create your own visual stories.
            </p>

            {isAuthenticated && (
              <button className="btn bg-white text-purple-600 hover:bg-neutral-100 text-lg px-8 py-4 group shadow-2xl">
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
              className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          {/* View Mode & Filter */}
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
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200'
              }`}
            >
              <span className="font-medium">{filter.label}</span>
              <span className={`ml-2 text-sm ${
                activeFilter === filter.id ? 'text-white/80' : 'text-neutral-500'
              }`}>
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
            { icon: Grid3X3, value: '2.4K', label: 'Total Collections', color: 'text-blue-500' },
            { icon: TrendingUp, value: '89', label: 'Trending This Week', color: 'text-green-500' },
            { icon: Users, value: '640', label: 'Collaborative', color: 'text-purple-500' }
          ].map((stat, index) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-neutral-100 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
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
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
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
                <CollectionCard key={collection.id} collection={collection} index={index} />
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
                Try adjusting your search or explore different categories.
              </p>
              {isAuthenticated && (
                <button className="btn-primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Collection
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;