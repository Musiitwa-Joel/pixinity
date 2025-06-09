import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  MapPin, 
  Link as LinkIcon, 
  Calendar,
  Users,
  Heart,
  Download,
  Eye,
  Grid3X3,
  List,
  Settings,
  Share2,
  Plus,
  Edit3,
  Award,
  Verified,
  Shield,
  Crown
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PhotoGrid from '../components/Common/PhotoGrid';
import { mockPhotos, mockUsers, mockCollections } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { Photo, Collection, User } from '../types';

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'photos' | 'collections' | 'liked'>('photos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPhotos, setUserPhotos] = useState<Photo[]>([]);
  const [userCollections, setUserCollections] = useState<Collection[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = currentUser?.username === username?.replace('@', '');

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Clean username - remove @ if present
      const cleanUsername = username?.replace('@', '');
      
      // Find user by username
      const foundUser = mockUsers.find(u => u.username === cleanUsername);
      
      if (foundUser) {
        setProfileUser(foundUser);
        
        // Load user's photos
        const photos = mockPhotos.filter(photo => photo.photographer.id === foundUser.id);
        setUserPhotos(photos);
        
        // Load user's collections
        const collections = mockCollections.filter(collection => collection.creator.id === foundUser.id);
        setUserCollections(collections);
      } else {
        // User not found - this will show the "User not found" message
        setProfileUser(null);
      }
      
      setIsLoading(false);
    };

    if (username) {
      loadProfile();
    }
  }, [username]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 'company':
        return <Shield className="h-5 w-5 text-blue-500" />;
      default:
        return <Camera className="h-5 w-5 text-primary-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium border border-yellow-200">
            <Crown className="h-4 w-4" />
            <span>Admin</span>
          </div>
        );
      case 'company':
        return (
          <div className="inline-flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            <Shield className="h-4 w-4" />
            <span>Company</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center space-x-1 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
            <Camera className="h-4 w-4" />
            <span>Photographer</span>
          </div>
        );
    }
  };

  const stats = [
    { label: 'Photos', value: profileUser?.uploadsCount || 0, icon: Camera },
    { label: 'Followers', value: profileUser?.followersCount || 0, icon: Users },
    { label: 'Following', value: profileUser?.followingCount || 0, icon: Heart },
    { label: 'Total Views', value: profileUser?.totalViews || 0, icon: Eye }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="bg-white rounded-2xl p-8 mb-8 border border-neutral-200">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="h-32 w-32 bg-neutral-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-neutral-200 rounded animate-pulse w-48" />
                <div className="h-4 bg-neutral-200 rounded animate-pulse w-32" />
                <div className="h-4 bg-neutral-200 rounded animate-pulse w-64" />
              </div>
            </div>
          </div>
          
          {/* Content Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-neutral-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-32 w-32 bg-neutral-200 rounded-full mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">User not found</h2>
          <p className="text-neutral-600 mb-4">The profile you're looking for doesn't exist.</p>
          <p className="text-sm text-neutral-500 mb-6">
            Available profiles: @admin, @sarahchen, @alexphoto, @mayatravel
          </p>
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          className="bg-white rounded-2xl p-8 mb-8 border border-neutral-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <img
                src={profileUser.avatar || `https://ui-avatars.com/api/?name=${profileUser.firstName}+${profileUser.lastName}&background=2563eb&color=ffffff&size=128`}
                alt={`${profileUser.firstName} ${profileUser.lastName}`}
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {profileUser.verified && (
                <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white p-2 rounded-full">
                  <Verified className="h-4 w-4" />
                </div>
              )}
              {profileUser.role === 'admin' && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-2 rounded-full">
                  <Crown className="h-4 w-4" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-neutral-900">
                      {profileUser.firstName} {profileUser.lastName}
                    </h1>
                    {profileUser.verified && (
                      <Award className="h-6 w-6 text-primary-500" />
                    )}
                    {getRoleIcon(profileUser.role)}
                  </div>
                  <p className="text-lg text-neutral-600 mb-2">@{profileUser.username}</p>
                  {getRoleBadge(profileUser.role)}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                  {isOwnProfile ? (
                    <>
                      <Link to="/settings\" className="btn-outline">
                        <Settings className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Link>
                      <Link to="/dashboard" className="btn-primary">
                        <Eye className="mr-2 h-4 w-4" />
                        Analytics
                      </Link>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleFollow}
                        className={`btn ${isFollowing ? 'btn-outline' : 'btn-primary'}`}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                      <button className="btn-outline">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Bio */}
              {profileUser.bio && (
                <p className="text-neutral-700 leading-relaxed mb-4 max-w-2xl">
                  {profileUser.bio}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-600">
                {profileUser.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profileUser.location}</span>
                  </div>
                )}
                {profileUser.website && (
                  <a
                    href={profileUser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <LinkIcon className="h-4 w-4" />
                    <span>Website</span>
                  </a>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(profileUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-neutral-200">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="h-5 w-5 text-neutral-400" />
                </div>
                <div className="text-2xl font-bold text-neutral-900">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-sm text-neutral-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Content Tabs */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex space-x-1 mb-4 sm:mb-0">
            {[
              { id: 'photos', label: 'Photos', count: userPhotos.length },
              { id: 'collections', label: 'Collections', count: userCollections.length },
              ...(isOwnProfile ? [{ id: 'liked', label: 'Liked', count: 0 }] : [])
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
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
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
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {activeTab === 'photos' && (
            <PhotoGrid photos={userPhotos} loading={false} />
          )}

          {activeTab === 'collections' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCollections.map((collection, index) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    to={`/collections/${collection.id}`}
                    className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-neutral-200"
                  >
                    <div className="aspect-video bg-neutral-100">
                      {collection.coverPhoto && (
                        <img
                          src={collection.coverPhoto.url}
                          alt={collection.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-neutral-900 mb-1">{collection.title}</h3>
                      <p className="text-sm text-neutral-600">{collection.photosCount} photos</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'liked' && (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No liked photos yet</h3>
              <p className="text-neutral-600">Photos you like will appear here</p>
            </div>
          )}
        </motion.div>

        {/* Empty States */}
        {!isLoading && userPhotos.length === 0 && activeTab === 'photos' && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Camera className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              No photos yet
            </h3>
            <p className="text-neutral-600 mb-6">
              {isOwnProfile ? "Start sharing your amazing photography!" : "This user hasn't uploaded any photos yet."}
            </p>
            {isOwnProfile && (
              <button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Upload Your First Photo
              </button>
            )}
          </motion.div>
        )}

        {!isLoading && userCollections.length === 0 && activeTab === 'collections' && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Grid3X3 className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              No collections yet
            </h3>
            <p className="text-neutral-600 mb-6">
              {isOwnProfile ? "Create your first collection to organize your photos!" : "This user hasn't created any collections yet."}
            </p>
            {isOwnProfile && (
              <button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Collection
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;