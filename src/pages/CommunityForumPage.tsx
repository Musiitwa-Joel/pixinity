import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Users, 
  Pin, 
  Clock, 
  Eye, 
  Heart, 
  Reply,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Award,
  Star,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Camera,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    verified: boolean;
  };
  category: string;
  tags: string[];
  createdAt: Date;
  lastActivity: Date;
  views: number;
  replies: number;
  likes: number;
  pinned: boolean;
  solved: boolean;
  type: 'discussion' | 'question' | 'showcase' | 'feedback';
}

const CommunityForumPage: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');

  const categories = [
    'All', 'General Discussion', 'Photography Tips', 'Gear Talk', 
    'Critique & Feedback', 'Challenges', 'Showcase', 'Technical Help'
  ];

  const mockPosts: ForumPost[] = [
    {
      id: '1',
      title: 'Best camera settings for night photography?',
      content: 'I\'m struggling with night photography and getting a lot of noise. What settings do you recommend for shooting in low light conditions?',
      author: {
        name: 'Alex Johnson',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        role: 'Enthusiast',
        verified: false
      },
      category: 'Photography Tips',
      tags: ['night photography', 'camera settings', 'low light'],
      createdAt: new Date('2024-03-15T10:30:00'),
      lastActivity: new Date('2024-03-15T14:20:00'),
      views: 234,
      replies: 12,
      likes: 8,
      pinned: false,
      solved: true,
      type: 'question'
    },
    {
      id: '2',
      title: 'Sony A7R V vs Canon R5 - Real world comparison',
      content: 'After using both cameras for 6 months, here\'s my detailed comparison for landscape and portrait photography...',
      author: {
        name: 'Sarah Chen',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        role: 'Pro Photographer',
        verified: true
      },
      category: 'Gear Talk',
      tags: ['sony', 'canon', 'camera comparison', 'review'],
      createdAt: new Date('2024-03-14T16:45:00'),
      lastActivity: new Date('2024-03-15T12:10:00'),
      views: 892,
      replies: 34,
      likes: 67,
      pinned: true,
      solved: false,
      type: 'discussion'
    },
    {
      id: '3',
      title: 'My latest landscape series from Iceland',
      content: 'Just returned from a 2-week photography trip to Iceland. Here are some of my favorite shots from the journey...',
      author: {
        name: 'Maya Patel',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        role: 'Travel Photographer',
        verified: true
      },
      category: 'Showcase',
      tags: ['landscape', 'iceland', 'travel', 'nature'],
      createdAt: new Date('2024-03-13T09:15:00'),
      lastActivity: new Date('2024-03-15T11:30:00'),
      views: 1456,
      replies: 28,
      likes: 156,
      pinned: false,
      solved: false,
      type: 'showcase'
    },
    {
      id: '4',
      title: 'Weekly Photography Challenge: Street Portraits',
      content: 'This week\'s challenge focuses on capturing compelling street portraits. Share your best shots and techniques!',
      author: {
        name: 'Pixinity Team',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        role: 'Moderator',
        verified: true
      },
      category: 'Challenges',
      tags: ['challenge', 'street photography', 'portraits', 'weekly'],
      createdAt: new Date('2024-03-11T08:00:00'),
      lastActivity: new Date('2024-03-15T13:45:00'),
      views: 567,
      replies: 45,
      likes: 89,
      pinned: true,
      solved: false,
      type: 'discussion'
    }
  ];

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredPosts = [...mockPosts];
      
      if (selectedCategory !== 'all') {
        filteredPosts = filteredPosts.filter(post => 
          post.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
      
      if (searchQuery) {
        filteredPosts = filteredPosts.filter(post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      // Sort posts
      filteredPosts.sort((a, b) => {
        switch (sortBy) {
          case 'popular':
            return (b.likes + b.replies) - (a.likes + a.replies);
          case 'trending':
            return b.views - a.views;
          default: // latest
            return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
        }
      });
      
      // Pinned posts first
      filteredPosts.sort((a, b) => Number(b.pinned) - Number(a.pinned));
      
      setPosts(filteredPosts);
      setIsLoading(false);
    };

    loadPosts();
  }, [selectedCategory, searchQuery, sortBy]);

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'question':
        return <HelpCircle className="h-5 w-5 text-blue-500" />;
      case 'showcase':
        return <Camera className="h-5 w-5 text-purple-500" />;
      case 'feedback':
        return <MessageCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <MessageCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const ForumPostCard: React.FC<{ post: ForumPost; index: number }> = ({ post, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <Link
        to={`/forum/${post.id}`}
        className="block bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300"
      >
        <div className="flex items-start space-x-4">
          {/* Author Avatar */}
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="h-12 w-12 rounded-full object-cover flex-shrink-0"
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center space-x-2 mb-2">
              {post.pinned && <Pin className="h-4 w-4 text-yellow-500" />}
              {getPostIcon(post.type)}
              {post.solved && <CheckCircle className="h-4 w-4 text-green-500" />}
              <span className="text-sm text-primary-600 font-medium">{post.category}</span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
              {post.title}
            </h3>

            {/* Content Preview */}
            <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
              {post.content}
            </p>

            {/* Author Info */}
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-sm font-medium text-neutral-900">{post.author.name}</span>
              {post.author.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
              <span className="text-sm text-neutral-500">•</span>
              <span className="text-sm text-neutral-500">{post.author.role}</span>
              <span className="text-sm text-neutral-500">•</span>
              <span className="text-sm text-neutral-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-neutral-500">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Reply className="h-4 w-4" />
                  <span>{post.replies}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </div>
              </div>

              <div className="text-sm text-neutral-500">
                Last activity: {new Date(post.lastActivity).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white overflow-hidden">
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
              <Users className="h-5 w-5 text-violet-300" />
              <span className="font-medium">Connect with photographers worldwide</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block">Community</span>
              <span className="font-cursive text-6xl md:text-7xl bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                forum
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              Join discussions, ask questions, share your work, and learn from fellow photographers. 
              Our community is here to help you grow and succeed.
            </p>

            <button className="btn bg-white text-violet-600 hover:bg-neutral-100 text-lg px-8 py-4 group shadow-2xl">
              <Plus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Start a Discussion</span>
            </button>
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
              placeholder="Search discussions..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map((category) => (
                <option key={category} value={category === 'All' ? 'all' : category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="latest">Latest Activity</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            { icon: MessageCircle, value: '12.5K+', label: 'Discussions', color: 'text-violet-500' },
            { icon: Users, value: '45K+', label: 'Active Members', color: 'text-blue-500' },
            { icon: CheckCircle, value: '8.9K+', label: 'Solved Questions', color: 'text-green-500' },
            { icon: Award, value: '2.1K+', label: 'Expert Contributors', color: 'text-yellow-500' }
          ].map((stat, index) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-lg transition-shadow">
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

        {/* Forum Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-neutral-200">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 bg-neutral-200 rounded-full animate-pulse" />
                    <div className="flex-1">
                      <div className="h-6 bg-neutral-200 rounded animate-pulse mb-2" />
                      <div className="h-4 bg-neutral-200 rounded animate-pulse mb-4 w-3/4" />
                      <div className="h-4 bg-neutral-200 rounded animate-pulse mb-6" />
                      <div className="flex space-x-4">
                        <div className="h-4 bg-neutral-200 rounded animate-pulse w-16" />
                        <div className="h-4 bg-neutral-200 rounded animate-pulse w-16" />
                        <div className="h-4 bg-neutral-200 rounded animate-pulse w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post, index) => (
                <ForumPostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Empty State */}
        {!isLoading && posts.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-md mx-auto">
              <div className="h-32 w-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-16 w-16 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                No discussions found
              </h3>
              <p className="text-neutral-600 mb-6">
                Try adjusting your search or browse different categories.
              </p>
              <button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Start a New Discussion
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CommunityForumPage;