import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Mail,
  Phone,
  Clock,
  CheckCircle,
  ArrowRight,
  Play,
  Download,
  Users,
  Lightbulb,
  Settings,
  Camera,
  Upload,
  Shield
} from 'lucide-react';

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: Book },
    { id: 'getting-started', name: 'Getting Started', icon: Play },
    { id: 'uploading', name: 'Uploading Photos', icon: Upload },
    { id: 'account', name: 'Account & Settings', icon: Settings },
    { id: 'photography', name: 'Photography Tips', icon: Camera },
    { id: 'community', name: 'Community', icon: Users },
    { id: 'privacy', name: 'Privacy & Safety', icon: Shield }
  ];

  const faqs = [
    {
      category: 'getting-started',
      question: 'How do I create a Pixinity account?',
      answer: 'Creating an account is simple! Click the "Join free" button in the top right corner, fill out the registration form with your email and basic information, and verify your email address. You\'ll be ready to start uploading and discovering amazing photography right away.'
    },
    {
      category: 'uploading',
      question: 'What file formats are supported for uploads?',
      answer: 'We support JPEG, PNG, and WebP formats. Files should be under 50MB in size. For best quality, we recommend uploading high-resolution images with at least 1920px on the longest side.'
    },
    {
      category: 'uploading',
      question: 'How do I add tags and descriptions to my photos?',
      answer: 'When uploading a photo, you\'ll see fields for title, description, and tags. Tags help others discover your work, so use relevant keywords that describe your photo\'s subject, style, location, or technique.'
    },
    {
      category: 'account',
      question: 'How can I change my profile information?',
      answer: 'Go to Settings > Profile to update your name, bio, location, website, and profile picture. Changes are saved automatically and will be visible to other users immediately.'
    },
    {
      category: 'account',
      question: 'How do I delete my account?',
      answer: 'Account deletion can be done from Settings > Account > Danger Zone. Please note that this action is permanent and cannot be undone. All your photos and data will be permanently removed.'
    },
    {
      category: 'photography',
      question: 'What makes a photo likely to be featured?',
      answer: 'Featured photos typically have excellent technical quality, compelling composition, unique perspective, and strong visual impact. Our editorial team looks for images that inspire and showcase exceptional photography skills.'
    },
    {
      category: 'community',
      question: 'How do I report inappropriate content?',
      answer: 'Click the three dots menu on any photo or profile and select "Report". Choose the appropriate reason and provide details. Our moderation team reviews all reports within 24 hours.'
    },
    {
      category: 'privacy',
      question: 'Who can see my photos?',
      answer: 'By default, all uploaded photos are public and can be viewed by anyone. You can make individual photos private or adjust your privacy settings in your account preferences.'
    }
  ];

  const tutorials = [
    {
      title: 'Getting Started with Pixinity',
      description: 'Learn the basics of uploading, organizing, and sharing your photography',
      duration: '5 min',
      type: 'video',
      thumbnail: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      title: 'Building Your Photography Portfolio',
      description: 'Tips for creating a compelling profile that showcases your best work',
      duration: '8 min',
      type: 'video',
      thumbnail: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      title: 'Understanding Photo Licenses',
      description: 'Learn about different license types and how to choose the right one',
      duration: '3 min',
      type: 'article',
      thumbnail: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    },
    {
      title: 'Community Guidelines & Best Practices',
      description: 'How to be a positive member of the Pixinity community',
      duration: '6 min',
      type: 'article',
      thumbnail: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
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
              <Lightbulb className="h-5 w-5 text-yellow-300" />
              <span className="font-medium">We're here to help you succeed</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block">Help</span>
              <span className="font-cursive text-6xl md:text-7xl bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
                Center
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              Find answers to your questions, learn new skills, and get the most out of Pixinity. 
              Our comprehensive help center has everything you need to succeed.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help articles, tutorials, and FAQs..."
                  className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-sm border-0 rounded-2xl text-lg placeholder-neutral-500 text-neutral-900 focus:ring-4 focus:ring-white/30 focus:outline-none transition-all shadow-2xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Help */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Quick <span className="font-cursive bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Help</span>
            </h2>
            <p className="text-xl text-neutral-600">
              Get instant support through multiple channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: MessageCircle, 
                title: 'Live Chat', 
                description: 'Chat with our support team in real-time',
                action: 'Start Chat',
                available: 'Available 24/7'
              },
              { 
                icon: Mail, 
                title: 'Email Support', 
                description: 'Send us a detailed message about your issue',
                action: 'Send Email',
                available: 'Response within 4 hours'
              },
              { 
                icon: Phone, 
                title: 'Phone Support', 
                description: 'Speak directly with our support specialists',
                action: 'Call Now',
                available: 'Mon-Fri 9AM-6PM PST'
              }
            ].map((option, index) => (
              <motion.div
                key={option.title}
                className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
                    <option.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">{option.title}</h3>
                  <p className="text-neutral-600 mb-4">{option.description}</p>
                  <div className="flex items-center justify-center space-x-1 text-sm text-green-600 mb-6">
                    <Clock className="h-4 w-4" />
                    <span>{option.available}</span>
                  </div>
                  <button className="btn-primary w-full">
                    {option.action}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Categories */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Browse by <span className="font-cursive bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Category</span>
            </h2>
            <p className="text-xl text-neutral-600">
              Find help articles organized by topic.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white hover:shadow-md'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
              >
                <category.icon className={`h-8 w-8 mb-3 ${
                  selectedCategory === category.id ? 'text-blue-600' : 'text-neutral-600'
                }`} />
                <h3 className={`font-semibold ${
                  selectedCategory === category.id ? 'text-blue-900' : 'text-neutral-900'
                }`}>
                  {category.name}
                </h3>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* FAQs */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Frequently Asked <span className="font-cursive bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-xl text-neutral-600">
              Quick answers to common questions.
            </p>
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.details
                key={index}
                className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <summary className="p-6 cursor-pointer hover:bg-neutral-50 rounded-xl transition-colors">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-neutral-900 pr-4">{faq.question}</h3>
                    <HelpCircle className="h-5 w-5 text-neutral-400 flex-shrink-0" />
                  </div>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
                </div>
              </motion.details>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-16">
              <HelpCircle className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">No results found</h3>
              <p className="text-neutral-600">Try adjusting your search or browse different categories.</p>
            </div>
          )}
        </motion.section>

        {/* Tutorials */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Video <span className="font-cursive bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tutorials</span>
            </h2>
            <p className="text-xl text-neutral-600">
              Step-by-step guides to help you master Pixinity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tutorials.map((tutorial, index) => (
              <motion.div
                key={tutorial.title}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <div className="relative aspect-video">
                  <img
                    src={tutorial.thumbnail}
                    alt={tutorial.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      {tutorial.type === 'video' ? (
                        <Play className="h-8 w-8 text-white" />
                      ) : (
                        <Book className="h-8 w-8 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {tutorial.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{tutorial.title}</h3>
                  <p className="text-neutral-600 mb-4">{tutorial.description}</p>
                  <button className="btn-primary group">
                    <span>{tutorial.type === 'video' ? 'Watch Video' : 'Read Article'}</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Still need <span className="font-cursive text-yellow-300">help</span>?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Our support team is here to help you succeed. Get personalized assistance from our photography and technical experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn bg-white text-blue-600 hover:bg-neutral-100 text-lg px-8 py-4">
                <MessageCircle className="mr-2 h-5 w-5" />
                Contact Support
              </button>
              <button className="btn-glass text-lg px-8 py-4">
                <Download className="mr-2 h-5 w-5" />
                Download User Guide
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default HelpCenterPage;