import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Scale, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Users,
  Camera,
  Globe,
  Mail,
  Calendar,
  Gavel,
  UserX,
  Copyright
} from 'lucide-react';

const TermsOfServicePage: React.FC = () => {
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: CheckCircle,
      content: 'By accessing or using Pixinity, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.'
    },
    {
      id: 'description',
      title: 'Description of Service',
      icon: Camera,
      content: 'Pixinity is a photography platform that allows users to upload, share, discover, and download high-quality photographs. We provide tools for photographers to showcase their work, connect with other creators, and potentially monetize their content.'
    },
    {
      id: 'user-accounts',
      title: 'User Accounts',
      icon: Users,
      content: [
        'You must provide accurate and complete information when creating an account.',
        'You are responsible for maintaining the confidentiality of your account credentials.',
        'You must be at least 13 years old to create an account.',
        'One person may not maintain more than one account.',
        'You are responsible for all activities that occur under your account.'
      ]
    },
    {
      id: 'content-guidelines',
      title: 'Content Guidelines',
      icon: Shield,
      content: [
        'You retain ownership of content you upload, but grant Pixinity certain usage rights.',
        'Content must not infringe on intellectual property rights of others.',
        'Prohibited content includes: illegal material, hate speech, harassment, spam, or explicit content.',
        'We reserve the right to remove content that violates these guidelines.',
        'Repeated violations may result in account suspension or termination.'
      ]
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: Copyright,
      content: [
        'You retain copyright ownership of your original photographs.',
        'By uploading content, you grant Pixinity a non-exclusive license to display, distribute, and promote your work.',
        'You represent that you have all necessary rights to the content you upload.',
        'Pixinity respects intellectual property rights and will respond to valid DMCA takedown notices.',
        'Our platform, design, and technology are protected by intellectual property laws.'
      ]
    },
    {
      id: 'prohibited-uses',
      title: 'Prohibited Uses',
      icon: UserX,
      content: [
        'Using the service for any unlawful purpose or to solicit unlawful activity.',
        'Attempting to interfere with, compromise, or disrupt the service.',
        'Uploading malicious code, viruses, or other harmful content.',
        'Impersonating another person or entity.',
        'Harvesting or collecting user information without consent.',
        'Using automated systems to access the service without permission.'
      ]
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: AlertTriangle,
      content: 'We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason in our sole discretion.'
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers',
      icon: Scale,
      content: 'The service is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, secure, or error-free. Your use of the service is at your own risk.'
    },
    {
      id: 'limitation-liability',
      title: 'Limitation of Liability',
      icon: Gavel,
      content: 'In no event shall Pixinity be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.'
    },
    {
      id: 'governing-law',
      title: 'Governing Law',
      icon: Globe,
      content: 'These Terms shall be interpreted and governed by the laws of the State of California, United States, without regard to conflict of law provisions. Any disputes shall be resolved in the courts of San Francisco County, California.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M50 50c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm-20 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8">
              <Scale className="h-5 w-5 text-purple-300" />
              <span className="font-medium">Legal framework for our community</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block">Terms of</span>
              <span className="font-cursive text-6xl md:text-7xl bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300 bg-clip-text text-transparent">
                Service
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              These terms govern your use of Pixinity and outline the rights and responsibilities 
              of all community members. Please read them carefully.
            </p>

            <div className="flex items-center justify-center space-x-6 text-sm text-white/80">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Effective: March 15, 2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Version 2.1</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Summary */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Terms Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Users,
                  title: 'Community Standards',
                  description: 'Respect others, share original content, and follow our community guidelines.'
                },
                {
                  icon: Copyright,
                  title: 'Your Rights',
                  description: 'You keep ownership of your photos while granting us permission to display them.'
                },
                {
                  icon: Shield,
                  title: 'Our Responsibilities',
                  description: 'We provide the platform and protect the community from harmful content.'
                },
                {
                  icon: Scale,
                  title: 'Fair Use',
                  description: 'Use our service responsibly and in accordance with applicable laws.'
                }
              ].map((item, index) => (
                <div key={item.title} className="flex items-start space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <item.icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-neutral-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Main Content */}
        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <section.icon className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-neutral-900">{section.title}</h2>
              </div>

              <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                {Array.isArray(section.content) ? (
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-600 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-neutral-600 leading-relaxed">{section.content}</p>
                )}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Important Notice */}
        <motion.section
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Important Notice</h3>
                <p className="text-amber-800 leading-relaxed mb-4">
                  These terms may be updated from time to time. We will notify users of significant changes 
                  via email or through the platform. Continued use of the service after changes constitutes 
                  acceptance of the new terms.
                </p>
                <p className="text-amber-800 leading-relaxed">
                  If you disagree with any changes, you may terminate your account. We recommend reviewing 
                  these terms periodically to stay informed of any updates.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* DMCA Notice */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-xl p-8 border border-neutral-200 shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">DMCA Copyright Policy</h2>
            <div className="space-y-4 text-neutral-600">
              <p>
                Pixinity respects the intellectual property rights of others and expects our users to do the same. 
                We will respond to clear notices of alleged copyright infringement that comply with the Digital 
                Millennium Copyright Act (DMCA).
              </p>
              <p>
                If you believe that your copyrighted work has been copied and is accessible on our platform in a way 
                that constitutes copyright infringement, please provide our DMCA agent with the following information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>A physical or electronic signature of the copyright owner or authorized agent</li>
                <li>Identification of the copyrighted work claimed to have been infringed</li>
                <li>Identification of the material that is claimed to be infringing</li>
                <li>Your contact information</li>
                <li>A statement of good faith belief that the use is not authorized</li>
                <li>A statement that the information is accurate and you are authorized to act</li>
              </ul>
              <p className="font-medium">
                DMCA Agent: legal@pixinity.com
              </p>
            </div>
          </div>
        </motion.section>

        {/* Contact Information */}
        <motion.section
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Questions About These Terms?</h2>
            <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              If you have any questions about these Terms of Service or need clarification 
              on any provisions, our legal team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn bg-white text-purple-600 hover:bg-neutral-100">
                <Mail className="mr-2 h-5 w-5" />
                legal@pixinity.com
              </button>
              <button className="btn-glass">
                <FileText className="mr-2 h-5 w-5" />
                Download PDF
              </button>
            </div>
          </div>
        </motion.section>

        {/* Last Updated */}
        <motion.div
          className="mt-12 text-center text-neutral-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p>These Terms of Service were last updated on March 15, 2024.</p>
          <p className="mt-2">Previous versions are available upon request.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;