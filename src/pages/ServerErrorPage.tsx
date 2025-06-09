import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Mail, Settings, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServerErrorPage: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const troubleshootingSteps = [
    { icon: RefreshCw, title: 'Refresh the page', description: 'Sometimes a simple refresh fixes the issue' },
    { icon: Settings, title: 'Check your connection', description: 'Ensure you have a stable internet connection' },
    { icon: Mail, title: 'Contact support', description: 'If the problem persists, reach out to our team' },
    { icon: Home, title: 'Return home', description: 'Go back to the homepage and try again' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated Error Icon */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative">
            {/* Large 500 Text */}
            <h1 className="text-[12rem] md:text-[16rem] font-bold text-transparent bg-gradient-to-r from-red-200 to-orange-200 bg-clip-text leading-none select-none">
              500
            </h1>
            
            {/* Floating Warning Icon */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 3, -3, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-6 rounded-full shadow-2xl">
                <AlertTriangle className="h-16 w-16" />
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
            Server Error
          </h2>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Something went wrong on our end. Our team has been notified and is working to fix the issue. 
            Please try again in a few moments.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.button
              onClick={handleRefresh}
              className="btn-primary group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </motion.button>
            <Link
              to="/"
              className="btn-outline group"
            >
              <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Go Home
            </Link>
          </div>
        </motion.div>

        {/* Troubleshooting Steps */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {troubleshootingSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-gradient-to-r from-red-100 to-orange-100 rounded-full mb-4">
                  <step.icon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-600">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Error Details */}
        <motion.div
          className="bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-2xl p-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Wrench className="h-8 w-8 text-orange-200" />
          </div>
          <h3 className="text-xl font-bold mb-2">We're on it!</h3>
          <p className="text-red-100 leading-relaxed mb-4">
            Our engineering team has been automatically notified of this issue. 
            We're working hard to get everything back to normal as quickly as possible.
          </p>
          <div className="text-sm text-red-200">
            Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <p className="text-neutral-600 mb-4">
            Need immediate assistance?
          </p>
          <Link
            to="/contact"
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            Contact our support team →
          </Link>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-red-200/30 to-orange-200/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-orange-200/30 to-yellow-200/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-gradient-to-r from-red-200/30 to-pink-200/30 rounded-full blur-xl animate-pulse" />
      </div>
    </div>
  );
};

export default ServerErrorPage;