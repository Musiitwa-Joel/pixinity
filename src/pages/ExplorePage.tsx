import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  Heart, 
  Download, 
  Filter, 
  Grid3X3, 
  List,
  Sparkles,
  Award,
  Eye,
  Users
} from 'lucide-react';
import PhotoGrid from '../components/Common/PhotoGrid';
import { mockPhotos } from '../data/mockData';
import { Photo } from '../types';

const ExplorePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'popular' | 'featured'>('trending');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp, description: 'Most viewed this week' },
    { id: 'new', label: 'Fresh', icon: Clock, description: 'Latest uploads' },
    { id: 'popular', label: 'Popular', icon: Heart, description: 'Most liked' },
    { id: 'featured', label: 'Featured', icon: Award, description: 'Editor\'s choice' }
  ];

  const categories = [
    { name: 'All', count: '2.1M', active: true },
    { name: 'Nature', count: '450K' },
    { name: 'Architecture', count: '320K' },
    { name: 'Travel', count: '680K' },
    { name: 'Street', count: '290K' },
    { name: 'Portrait', count: '540K' },
    { name: 'Abstract', count: '180K' },
    { name: 'Food', count: '220K' }
  ];

  useEffect(() => {
    const loadPhotos = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredPhotos = [...mockPhotos];
      
      switch (activeTab) {
        case 'trending':
          filteredPhotos.sort((a, b) => (b.viewsCount + b.likesCount) - (a.viewsCount + a.likesCount));
          break;
        case 'new':
          filteredPhotos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'popular':
          filteredPhotos.sort((a, b) => b.likesCount - a.likesCount);
          break;
        case 'featured':
          filteredPhotos = filteredPhotos.filter(photo => photo.featured);
          break;
      }
      
      setPhotos(filteredPhotos);
      setIsLoading(false);
    };

    loadPhotos();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 text-white overflow-hidden">
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
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="font-medium">Discover amazing photography</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block">Explore the</span>
              <span className="font-cursive text-6xl md:text-7xl bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                extraordinary
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Browse millions of high-quality photos from talented creators worldwide. 
              Find inspiration, discover new perspectives, and download stunning visuals for your projects.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-center justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-wrap gap-2 mb-6 lg:mb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`group flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200'
                }`}
              >
                <tab.icon className={`h-5 w-5 ${
                  activeTab === tab.id ? 'text-white' : 'text-neutral-500 group-hover:text-primary-500'
                } transition-colors`} />
                <div className="text-left">
                  <div className="font-semibold">{tab.label}</div>
                  <div className={`text-xs ${
                    activeTab === tab.id ? 'text-white/80' : 'text-neutral-500'
                  }`}>
                    {tab.description}
                  </div>
                </div>
              </button>
            ))}
          </div>

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
              <span>Filters</span>
            </button>
          </div>
        </motion.div>

        {/* Category Pills */}
        <motion.div
          className="flex flex-wrap gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {categories.map((category, index) => (
            <button
              key={category.name}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                category.active
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200'
              }`}
            >
              <span className="font-medium">{category.name}</span>
              <span className={`ml-2 text-sm ${
                category.active ? 'text-white/80' : 'text-neutral-500'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {[
            { icon: Eye, value: '2.1M', label: 'Photos viewed today', color: 'text-blue-500' },
            { icon: Download, value: '450K', label: 'Downloads this week', color: 'text-green-500' },
            { icon: Heart, value: '89K', label: 'Likes in 24h', color: 'text-red-500' },
            { icon: Users, value: '12K', label: 'Active photographers', color: 'text-purple-500' }
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

        {/* Photo Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
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

export default ExplorePage;