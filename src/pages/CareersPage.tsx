import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  Zap,
  Coffee,
  Laptop,
  Globe,
  Award,
  TrendingUp,
  Star,
  ArrowRight,
  Search,
  Filter
} from 'lucide-react';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  featured: boolean;
}

const CareersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const departments = ['All', 'Engineering', 'Design', 'Product', 'Marketing', 'Community', 'Operations'];
  const locations = ['All', 'Remote', 'San Francisco', 'New York', 'London', 'Berlin'];

  const positions: JobPosition[] = [
    {
      id: '1',
      title: 'Senior Frontend Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Join our engineering team to build the next generation of photography tools and experiences.',
      requirements: ['React/TypeScript expertise', 'Modern CSS/Tailwind', 'API integration', 'Performance optimization'],
      benefits: ['Competitive salary', 'Equity package', 'Health insurance', 'Flexible PTO'],
      featured: true
    },
    {
      id: '2',
      title: 'Product Designer',
      department: 'Design',
      location: 'San Francisco',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Shape the visual and interaction design of our platform used by millions of photographers.',
      requirements: ['Figma proficiency', 'User research skills', 'Design systems', 'Mobile design'],
      benefits: ['Creative freedom', 'Design budget', 'Conference attendance', 'Mentorship'],
      featured: true
    },
    {
      id: '3',
      title: 'Community Manager',
      department: 'Community',
      location: 'Remote',
      type: 'Full-time',
      experience: '2+ years',
      description: 'Build and nurture our global community of photographers and visual creators.',
      requirements: ['Community building', 'Social media', 'Content creation', 'Photography knowledge'],
      benefits: ['Travel opportunities', 'Event access', 'Photography gear', 'Flexible schedule'],
      featured: false
    },
    {
      id: '4',
      title: 'Machine Learning Engineer',
      department: 'Engineering',
      location: 'New York',
      type: 'Full-time',
      experience: '4+ years',
      description: 'Develop AI-powered features for photo discovery, tagging, and recommendation systems.',
      requirements: ['Python/TensorFlow', 'Computer vision', 'ML pipelines', 'Cloud platforms'],
      benefits: ['Research time', 'GPU access', 'Conference budget', 'Publication support'],
      featured: false
    },
    {
      id: '5',
      title: 'Marketing Intern',
      department: 'Marketing',
      location: 'London',
      type: 'Internship',
      experience: 'Entry level',
      description: 'Support our marketing team in campaigns, content creation, and growth initiatives.',
      requirements: ['Marketing studies', 'Social media savvy', 'Creative thinking', 'Analytics interest'],
      benefits: ['Mentorship program', 'Learning budget', 'Networking events', 'Full-time potential'],
      featured: false
    }
  ];

  const benefits = [
    { icon: Heart, title: 'Health & Wellness', description: 'Comprehensive health insurance and wellness programs' },
    { icon: Laptop, title: 'Remote-First', description: 'Work from anywhere with flexible hours and home office setup' },
    { icon: TrendingUp, title: 'Growth & Learning', description: 'Professional development budget and mentorship opportunities' },
    { icon: Coffee, title: 'Great Culture', description: 'Collaborative environment with regular team events and retreats' },
    { icon: Award, title: 'Competitive Package', description: 'Salary, equity, and performance bonuses' },
    { icon: Globe, title: 'Global Impact', description: 'Work on products used by millions of creators worldwide' }
  ];

  const filteredPositions = positions.filter(position => {
    const matchesSearch = position.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         position.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || position.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || position.location === selectedLocation;
    
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  const JobCard: React.FC<{ position: JobPosition; index: number }> = ({ position, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300">
        {position.featured && (
          <div className="inline-flex items-center space-x-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Star className="h-3 w-3" />
            <span>Featured</span>
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
              {position.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-neutral-600">
              <div className="flex items-center space-x-1">
                <Briefcase className="h-4 w-4" />
                <span>{position.department}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{position.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{position.type}</span>
              </div>
            </div>
          </div>
          <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
            {position.experience}
          </span>
        </div>

        <p className="text-neutral-600 mb-6 leading-relaxed">
          {position.description}
        </p>

        <div className="mb-6">
          <h4 className="font-semibold text-neutral-900 mb-3">Key Requirements</h4>
          <div className="flex flex-wrap gap-2">
            {position.requirements.slice(0, 4).map((req, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm"
              >
                {req}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-neutral-500">
            <span>Benefits include:</span>
            <span className="font-medium text-neutral-700">
              {position.benefits.slice(0, 2).join(', ')}
            </span>
          </div>
          <button className="btn-primary group">
            <span>Apply Now</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white overflow-hidden">
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
              <Zap className="h-5 w-5 text-emerald-300" />
              <span className="font-medium">Join our mission to democratize photography</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block">Build the future of</span>
              <span className="font-cursive text-6xl md:text-7xl bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                photography
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              Join our passionate team of creators, engineers, and dreamers who are building the world's 
              most inspiring photography platform. Help us empower millions of photographers worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn bg-white text-emerald-600 hover:bg-neutral-100 text-lg px-8 py-4 group">
                <Users className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                View Open Positions
              </button>
              <button className="btn-glass text-lg px-8 py-4 group">
                <span>Learn About Our Culture</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Why work at <span className="font-cursive bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Pixinity</span>?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              We believe in creating an environment where creativity thrives, innovation happens, and every team member can do their best work.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
                    <benefit.icon className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{benefit.title}</h3>
                    <p className="text-neutral-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Open <span className="font-cursive bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Positions</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Find your perfect role and help us build the future of photography together.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            className="flex flex-col lg:flex-row lg:items-center justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Search */}
            <div className="relative max-w-md mb-6 lg:mb-0">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search positions..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept === 'All' ? 'all' : dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {locations.map((location) => (
                  <option key={location} value={location === 'All' ? 'all' : location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Job Listings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {filteredPositions.length > 0 ? (
              <div className="space-y-6">
                {filteredPositions.map((position, index) => (
                  <JobCard key={position.id} position={position} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="h-32 w-32 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase className="h-16 w-16 text-neutral-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    No positions found
                  </h3>
                  <p className="text-neutral-600">
                    Try adjusting your search criteria or check back later for new openings.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Don't see the perfect <span className="font-cursive text-yellow-300">role</span>?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              We're always looking for talented individuals who share our passion for photography and innovation. 
              Send us your resume and let's start a conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn bg-white text-emerald-600 hover:bg-neutral-100 text-lg px-8 py-4 group">
                <Heart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Send General Application
              </button>
              <button className="btn-glass text-lg px-8 py-4 group">
                <span>Follow Us for Updates</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;