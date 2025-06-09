import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Camera, 
  Award, 
  Clock, 
  Star,
  Target,
  Gift,
  Zap,
  Eye,
  Heart,
  Share2,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Challenge {
  id: string;
  title: string;
  description: string;
  theme: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prize: string;
  startDate: Date;
  endDate: Date;
  participants: number;
  submissions: number;
  coverImage: string;
  status: 'upcoming' | 'active' | 'ended';
  featured: boolean;
}

const PhotoChallengesPage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'upcoming' | 'ended'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const mockChallenges: Challenge[] = [
    {
      id: '1',
      title: 'Golden Hour Magic',
      description: 'Capture the perfect golden hour moment. Show us how light transforms ordinary scenes into extraordinary art.',
      theme: 'Lighting',
      difficulty: 'Intermediate',
      prize: '$2,500 + Featured Gallery',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-31'),
      participants: 1247,
      submissions: 892,
      coverImage: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      status: 'active',
      featured: true
    },
    {
      id: '2',
      title: 'Urban Geometry',
      description: 'Find geometric patterns and shapes in urban environments. Architecture, shadows, and city life.',
      theme: 'Architecture',
      difficulty: 'Advanced',
      prize: '$5,000 + Exhibition',
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-04-15'),
      participants: 892,
      submissions: 234,
      coverImage: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      status: 'active',
      featured: true
    },
    {
      id: '3',
      title: 'Minimalist Nature',
      description: 'Less is more. Capture the essence of nature through minimalist composition and clean aesthetics.',
      theme: 'Nature',
      difficulty: 'Beginner',
      prize: '$1,000 + Mentorship',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
      participants: 0,
      submissions: 0,
      coverImage: 'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      status: 'upcoming',
      featured: false
    },
    {
      id: '4',
      title: 'Street Life Chronicles',
      description: 'Document authentic moments of street life. Candid photography that tells compelling human stories.',
      theme: 'Street',
      difficulty: 'Intermediate',
      prize: '$3,000 + Publication',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-29'),
      participants: 2156,
      submissions: 1834,
      coverImage: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
      status: 'ended',
      featured: false
    }
  ];

  useEffect(() => {
    const loadChallenges = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredChallenges = [...mockChallenges];
      
      if (activeTab !== 'all') {
        filteredChallenges = filteredChallenges.filter(challenge => challenge.status === activeTab);
      }
      
      if (searchQuery) {
        filteredChallenges = filteredChallenges.filter(challenge =>
          challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          challenge.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
          challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setChallenges(filteredChallenges);
      setIsLoading(false);
    };

    loadChallenges();
  }, [activeTab, searchQuery]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'Advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 text-white';
      case 'upcoming':
        return 'bg-blue-500 text-white';
      case 'ended':
        return 'bg-neutral-500 text-white';
      default:
        return 'bg-neutral-500 text-white';
    }
  };

  const ChallengeCard: React.FC<{ challenge: Challenge; index: number }> = ({ challenge, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-200">
        {/* Cover Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={challenge.coverImage}
            alt={challenge.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(challenge.status)}`}>
              {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
            </span>
          </div>

          {/* Featured Badge */}
          {challenge.featured && (
            <div className="absolute top-4 right-4">
              <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <Star className="h-3 w-3" />
                <span>Featured</span>
              </div>
            </div>
          )}

          {/* Prize */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center space-x-2 text-sm font-medium text-neutral-900">
                <Gift className="h-4 w-4 text-yellow-500" />
                <span>{challenge.prize}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
            <span className="text-sm text-neutral-500">{challenge.theme}</span>
          </div>

          <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
            {challenge.title}
          </h3>
          
          <p className="text-neutral-600 mb-4 line-clamp-3 leading-relaxed">
            {challenge.description}
          </p>

          {/* Timeline */}
          <div className="flex items-center space-x-4 text-sm text-neutral-500 mb-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{challenge.startDate.toLocaleDateString()}</span>
            </div>
            <span>-</span>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{challenge.endDate.toLocaleDateString()}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <div className="text-lg font-bold text-neutral-900">{challenge.participants.toLocaleString()}</div>
              <div className="text-xs text-neutral-500">Participants</div>
            </div>
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <div className="text-lg font-bold text-neutral-900">{challenge.submissions.toLocaleString()}</div>
              <div className="text-xs text-neutral-500">Submissions</div>
            </div>
          </div>

          {/* Action Button */}
          <button className={`btn w-full ${
            challenge.status === 'active' ? 'btn-primary' : 
            challenge.status === 'upcoming' ? 'btn-outline' : 
            'btn-secondary'
          }`}>
            {challenge.status === 'active' && (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Join Challenge
              </>
            )}
            {challenge.status === 'upcoming' && (
              <>
                <Clock className="mr-2 h-4 w-4" />
                Notify Me
              </>
            )}
            {challenge.status === 'ended' && (
              <>
                <Eye className="mr-2 h-4 w-4" />
                View Results
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white overflow-hidden">
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
              <Trophy className="h-5 w-5 text-yellow-300" />
              <span className="font-medium">Compete and grow your skills</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block">Photography</span>
              <span className="font-cursive text-6xl md:text-7xl bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                challenges
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              Push your creative boundaries with exciting photography challenges. 
              Compete with photographers worldwide, win amazing prizes, and showcase your talent.
            </p>

            <button className="btn bg-white text-orange-600 hover:bg-neutral-100 text-lg px-8 py-4 group shadow-2xl">
              <Plus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Submit Your Photo</span>
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
              placeholder="Search challenges..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-2">
            {[
              { id: 'all', label: 'All Challenges' },
              { id: 'active', label: 'Active' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'ended', label: 'Ended' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
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
            { icon: Target, value: '24', label: 'Active Challenges', color: 'text-green-500' },
            { icon: Users, value: '45K+', label: 'Total Participants', color: 'text-blue-500' },
            { icon: Award, value: '$125K+', label: 'Prizes Awarded', color: 'text-yellow-500' },
            { icon: Camera, value: '180K+', label: 'Photos Submitted', color: 'text-purple-500' }
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

        {/* Challenges Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
                  <div className="aspect-video bg-neutral-200 animate-pulse" />
                  <div className="p-6">
                    <div className="h-6 bg-neutral-200 rounded animate-pulse mb-2" />
                    <div className="h-4 bg-neutral-200 rounded animate-pulse mb-4 w-3/4" />
                    <div className="h-4 bg-neutral-200 rounded animate-pulse mb-6" />
                    <div className="h-10 bg-neutral-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {challenges.map((challenge, index) => (
                <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Empty State */}
        {!isLoading && challenges.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-md mx-auto">
              <div className="h-32 w-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-16 w-16 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                No challenges found
              </h3>
              <p className="text-neutral-600">
                Try adjusting your search or check back later for new challenges.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PhotoChallengesPage;