import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Eye, 
  Download, 
  Heart, 
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Camera,
  Globe,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockPhotos } from '../data/mockData';

interface AnalyticsData {
  totalViews: number;
  totalDownloads: number;
  totalLikes: number;
  totalFollowers: number;
  viewsChange: number;
  downloadsChange: number;
  likesChange: number;
  followersChange: number;
  topPhotos: any[];
  viewsOverTime: { date: string; views: number }[];
  countriesData: { country: string; views: number; percentage: number }[];
}

const AnalyticsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadAnalytics = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock analytics data
      const mockAnalytics: AnalyticsData = {
        totalViews: 45320,
        totalDownloads: 8934,
        totalLikes: 3421,
        totalFollowers: 1250,
        viewsChange: 12.5,
        downloadsChange: -3.2,
        likesChange: 8.7,
        followersChange: 15.3,
        topPhotos: mockPhotos.slice(0, 5),
        viewsOverTime: [
          { date: '2024-01-01', views: 1200 },
          { date: '2024-01-02', views: 1350 },
          { date: '2024-01-03', views: 1100 },
          { date: '2024-01-04', views: 1450 },
          { date: '2024-01-05', views: 1600 },
          { date: '2024-01-06', views: 1300 },
          { date: '2024-01-07', views: 1750 }
        ],
        countriesData: [
          { country: 'United States', views: 15420, percentage: 34 },
          { country: 'United Kingdom', views: 8930, percentage: 20 },
          { country: 'Germany', views: 6780, percentage: 15 },
          { country: 'France', views: 4560, percentage: 10 },
          { country: 'Canada', views: 3420, percentage: 8 },
          { country: 'Others', views: 6210, percentage: 13 }
        ]
      };

      setAnalytics(mockAnalytics);
      setIsLoading(false);
    };

    loadAnalytics();
  }, [isAuthenticated, timeRange]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Access Denied</h2>
          <p className="text-neutral-600">Please log in to view your analytics</p>
        </div>
      </div>
    );
  }

  if (isLoading || !analytics) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-neutral-200 rounded animate-pulse w-48 mb-2" />
            <div className="h-4 bg-neutral-200 rounded animate-pulse w-64" />
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-neutral-200">
                <div className="h-4 bg-neutral-200 rounded animate-pulse mb-4" />
                <div className="h-8 bg-neutral-200 rounded animate-pulse mb-2" />
                <div className="h-3 bg-neutral-200 rounded animate-pulse w-20" />
              </div>
            ))}
          </div>
          
          {/* Chart Skeleton */}
          <div className="bg-white rounded-xl p-6 border border-neutral-200 mb-8">
            <div className="h-6 bg-neutral-200 rounded animate-pulse w-32 mb-6" />
            <div className="h-64 bg-neutral-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Views',
      value: analytics.totalViews,
      change: analytics.viewsChange,
      icon: Eye,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Downloads',
      value: analytics.totalDownloads,
      change: analytics.downloadsChange,
      icon: Download,
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Likes',
      value: analytics.totalLikes,
      change: analytics.likesChange,
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Followers',
      value: analytics.totalFollowers,
      change: analytics.followersChange,
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100'
    }
  ];

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
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Analytics Dashboard</h1>
              <p className="text-neutral-600">Track your photography performance and audience insights</p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change >= 0 ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-neutral-900 mb-1">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-sm text-neutral-600">{stat.title}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Views Chart */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-xl p-6 border border-neutral-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">Views Over Time</h3>
              <div className="flex items-center space-x-2 text-sm text-neutral-600">
                <Activity className="h-4 w-4" />
                <span>Daily views</span>
              </div>
            </div>
            
            {/* Simple Chart Visualization */}
            <div className="h-64 flex items-end space-x-2">
              {analytics.viewsOverTime.map((data, index) => (
                <div
                  key={data.date}
                  className="flex-1 bg-primary-500 rounded-t-md opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ 
                    height: `${(data.views / Math.max(...analytics.viewsOverTime.map(d => d.views))) * 100}%`,
                    minHeight: '20px'
                  }}
                  title={`${data.views} views on ${data.date}`}
                />
              ))}
            </div>
            
            <div className="flex justify-between mt-4 text-xs text-neutral-500">
              {analytics.viewsOverTime.map((data, index) => (
                <span key={data.date}>
                  {new Date(data.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Top Countries */}
          <motion.div
            className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <Globe className="h-5 w-5 text-neutral-400" />
              <h3 className="text-lg font-semibold text-neutral-900">Top Countries</h3>
            </div>
            
            <div className="space-y-4">
              {analytics.countriesData.map((country, index) => (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-neutral-900">{country.country}</span>
                      <span className="text-sm text-neutral-600">{country.percentage}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${country.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Performing Photos */}
        <motion.div
          className="mt-8 bg-white rounded-xl p-6 border border-neutral-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center space-x-2 mb-6">
            <Award className="h-5 w-5 text-neutral-400" />
            <h3 className="text-lg font-semibold text-neutral-900">Top Performing Photos</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {analytics.topPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center justify-between text-sm">
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
                <h4 className="font-medium text-neutral-900 mb-1 line-clamp-1">{photo.title}</h4>
                <div className="flex items-center justify-between text-sm text-neutral-600">
                  <span>{photo.viewsCount.toLocaleString()} views</span>
                  <span>#{index + 1}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Engagement Rate */}
          <motion.div
            className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-5 w-5 text-neutral-400" />
              <h3 className="text-lg font-semibold text-neutral-900">Engagement Insights</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <div className="font-medium text-neutral-900">Average Engagement Rate</div>
                  <div className="text-sm text-neutral-600">Likes + Downloads / Views</div>
                </div>
                <div className="text-2xl font-bold text-primary-600">7.2%</div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <div className="font-medium text-neutral-900">Best Performing Category</div>
                  <div className="text-sm text-neutral-600">Highest engagement rate</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-neutral-900">Nature</div>
                  <div className="text-sm text-green-600">+12.5%</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <div className="font-medium text-neutral-900">Peak Activity Time</div>
                  <div className="text-sm text-neutral-600">Most views received</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-neutral-900">2-4 PM</div>
                  <div className="text-sm text-neutral-600">UTC</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <Activity className="h-5 w-5 text-neutral-400" />
              <h3 className="text-lg font-semibold text-neutral-900">Recent Activity</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { action: 'Photo featured', photo: 'Mountain Sunrise', time: '2 hours ago', type: 'feature' },
                { action: 'New follower', photo: '@alexphoto started following you', time: '4 hours ago', type: 'follow' },
                { action: 'Photo liked', photo: 'Urban Architecture', time: '6 hours ago', type: 'like' },
                { action: 'Photo downloaded', photo: 'Forest Path', time: '8 hours ago', type: 'download' },
                { action: 'Collection created', photo: 'Nature Collection', time: '1 day ago', type: 'collection' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'feature' ? 'bg-yellow-100 text-yellow-600' :
                    activity.type === 'follow' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'like' ? 'bg-red-100 text-red-600' :
                    activity.type === 'download' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.type === 'feature' && <Award className="h-4 w-4" />}
                    {activity.type === 'follow' && <Users className="h-4 w-4" />}
                    {activity.type === 'like' && <Heart className="h-4 w-4" />}
                    {activity.type === 'download' && <Download className="h-4 w-4" />}
                    {activity.type === 'collection' && <Camera className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-neutral-900">{activity.action}</div>
                    <div className="text-sm text-neutral-600">{activity.photo}</div>
                  </div>
                  <div className="text-xs text-neutral-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;