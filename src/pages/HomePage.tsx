import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  TrendingUp,
  Camera,
  Users,
  Download,
  Eye,
  Sparkles,
  ArrowRight,
  Play,
  Star,
  Award,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import PhotoGrid from "../components/Common/PhotoGrid";
import { mockPhotos } from "../data/mockData";
import { useApp } from "../contexts/AppContext";

const HomePage: React.FC = () => {
  const { setPhotos } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate loading photos
    const loadPhotos = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPhotos(mockPhotos);
      setIsLoading(false);
    };

    loadPhotos();
  }, [setPhotos]);

  const featuredPhotos = mockPhotos.filter((photo) => photo.featured);
  const categories = [
    {
      name: "Nature",
      count: "2.4M",
      image:
        "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
      gradient: "from-green-400 to-blue-500",
    },
    {
      name: "Architecture",
      count: "1.8M",
      image:
        "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
      gradient: "from-gray-400 to-gray-600",
    },
    {
      name: "Travel",
      count: "3.1M",
      image:
        "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
      gradient: "from-blue-400 to-purple-500",
    },
    {
      name: "Street",
      count: "1.2M",
      image:
        "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      name: "Portrait",
      count: "2.7M",
      image:
        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
      gradient: "from-pink-400 to-red-500",
    },
    {
      name: "Abstract",
      count: "896K",
      image:
        "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1",
      gradient: "from-purple-400 to-indigo-500",
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(
        searchQuery.trim()
      )}`;
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-xl"
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-pink-400/30 to-red-400/30 rounded-full blur-xl"
            animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-2xl"
            animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              style={{ marginTop: "1rem" }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-white font-medium">
                Trusted by 150K+ photographers worldwide
              </span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-white leading-tight">
              <span className="block">Where</span>
              <span className="block font-cursive text-6xl md:text-8xl lg:text-9xl bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                creativity
              </span>
              <span className="block">meets the world</span>
            </h1>

            <motion.p
              className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Discover breathtaking photography from talented creators around
              the globe. Share your vision, connect with artists, and find the
              perfect image for your next project.
            </motion.p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-3xl mx-auto mb-16"
          >
            <form onSubmit={handleSearch} className="relative group">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search millions of high-quality photos..."
                  className="w-full pl-16 pr-32 py-6 bg-white/95 backdrop-blur-sm border-0 rounded-2xl text-lg placeholder-neutral-500 text-neutral-900 focus:ring-4 focus:ring-white/30 focus:outline-none transition-all shadow-2xl group-hover:shadow-3xl"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 btn-primary px-8 py-3 rounded-xl"
                >
                  <span className="hidden sm:inline">Search</span>
                  <Search className="h-5 w-5 sm:hidden" />
                </button>
              </div>
            </form>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Link to="/explore" className="btn-glass text-lg px-10 py-4 group">
              <span>Explore Gallery</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/signup" className="btn-primary text-lg px-10 py-4 group">
              <Camera className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Start Creating</span>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            style={{ marginBottom: "1rem" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                icon: Camera,
                value: "2.1M+",
                label: "Photos",
                color: "text-blue-300",
              },
              {
                icon: Users,
                value: "150K+",
                label: "Photographers",
                color: "text-green-300",
              },
              {
                icon: Download,
                value: "50M+",
                label: "Downloads",
                color: "text-yellow-300",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="glass-effect rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                  <div
                    className={`flex items-center justify-center mb-4 ${stat.color}`}
                  >
                    <stat.icon className="h-10 w-10 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white/80 text-lg">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gradient-to-b from-white to-neutral-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              Explore by{" "}
              <span className="font-cursive bg-gradient-to-r from-primary-600 via-purple-600 to-accent-500 bg-clip-text text-transparent">
                category
              </span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Dive into curated collections of stunning photography across
              diverse themes and styles
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <Link
                  to={`/categories/${category.name.toLowerCase()}`}
                  className="group block relative overflow-hidden rounded-2xl aspect-square shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60 group-hover:opacity-40 transition-opacity duration-300`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-bold text-xl mb-2 group-hover:scale-105 transition-transform duration-300">
                      {category.name}
                    </h3>
                    <p className="text-sm opacity-90">
                      {category.count} photos
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="h-6 w-6 text-white" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Photos Section */}
      <section className="py-24 bg-neutral-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-between mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center lg:text-left mb-8 lg:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                <span className="font-cursive bg-gradient-to-r from-primary-600 via-purple-600 to-accent-500 bg-clip-text text-transparent">
                  Handpicked
                </span>{" "}
                masterpieces
              </h2>
              <p className="text-xl text-neutral-600 max-w-2xl">
                Curated by our editorial team, these exceptional photographs
                showcase the finest in contemporary visual storytelling
              </p>
            </div>
            <Link
              to="/featured"
              className="btn-primary flex items-center space-x-3 group text-lg px-8 py-4"
            >
              <Award className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>View All Featured</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <PhotoGrid photos={featuredPhotos} loading={isLoading} />
        </div>
      </section>

      {/* Community Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M50 50c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm-20 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8">
              <Star className="h-5 w-5 text-yellow-300" />
              <span className="font-medium">Join the creative revolution</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Your <span className="font-cursive text-yellow-300">vision</span>{" "}
              deserves
              <br />a global audience
            </h2>

            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with fellow creators, showcase your talent, and inspire
              millions. Join our thriving community where every photograph tells
              a story.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                to="/signup"
                className="btn bg-white text-primary-600 hover:bg-neutral-100 text-lg px-10 py-4 group shadow-2xl"
              >
                <Zap className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Start Your Journey</span>
              </Link>
              <Link
                to="/explore"
                className="btn-glass text-lg px-10 py-4 group"
              >
                <Play className="mr-2 h-5 w-5" />
                <span>Watch Demo</span>
              </Link>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  title: "Global Reach",
                  desc: "Share with millions worldwide",
                  icon: "🌍",
                },
                {
                  title: "Pro Tools",
                  desc: "Advanced analytics & insights",
                  icon: "📊",
                },
                {
                  title: "Community",
                  desc: "Connect with like-minded creators",
                  icon: "🤝",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="glass-effect rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-white/80">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
