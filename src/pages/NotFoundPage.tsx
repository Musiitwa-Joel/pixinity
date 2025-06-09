import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Home, Search, ArrowLeft, Compass, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const suggestions = [
    { icon: Home, label: 'Go Home', path: '/', description: 'Return to the homepage' },
    { icon: Search, label: 'Search Photos', path: '/search', description: 'Find amazing photography' },
    { icon: Compass, label: 'Explore', path: '/explore', description: 'Discover trending content' },
    { icon: Star, label: 'Collections', path: '/collections', description: 'Browse curated galleries' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated 404 */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative">
            {/* Large 404 Text */}
            <h1 className="text-[12rem] md:text-[16rem] font-bold text-transparent bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text leading-none select-none">
              404
            </h1>
            
            {/* Floating Camera Icon */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-full shadow-2xl">
                <Camera className="h-16 w-16" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Oops! Page not found
          </h2>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            The page you're looking for seems to have wandered off like a photographer chasing the perfect shot. 
            Let's get you back on track!
          </p>

          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            className="btn-outline mb-8 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </motion.button>
        </motion.div>

        {/* Suggestions Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Link
                to={suggestion.path}
                className="block bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <suggestion.icon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {suggestion.label}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {suggestion.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Fun Fact */}
        <motion.div
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-yellow-300" />
          </div>
          <h3 className="text-xl font-bold mb-2">Did you know?</h3>
          <p className="text-indigo-100 leading-relaxed">
            The first photograph ever taken was captured in 1826 by Nicéphore Niépce. 
            It required an 8-hour exposure time! Today, we can capture stunning images in fractions of a second.
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 rounded-full blur-xl animate-pulse" />
      </div>
    </div>
  );
};

export default NotFoundPage;