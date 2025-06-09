import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  Globe,
  UserCheck,
  Settings,
  AlertTriangle,
  CheckCircle,
  Mail,
  Calendar
} from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: Database,
      content: [
        {
          subtitle: 'Account Information',
          text: 'When you create an account, we collect your name, email address, username, and profile information you choose to provide.'
        },
        {
          subtitle: 'Content You Share',
          text: 'Photos, descriptions, comments, and other content you upload or share on our platform.'
        },
        {
          subtitle: 'Usage Data',
          text: 'Information about how you use our service, including pages visited, features used, and interaction patterns.'
        },
        {
          subtitle: 'Device Information',
          text: 'Technical information about your device, browser, IP address, and operating system.'
        }
      ]
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: Settings,
      content: [
        {
          subtitle: 'Service Provision',
          text: 'To provide, maintain, and improve our photography platform and related services.'
        },
        {
          subtitle: 'Communication',
          text: 'To send you important updates, notifications, and respond to your inquiries.'
        },
        {
          subtitle: 'Personalization',
          text: 'To customize your experience and show you relevant content and recommendations.'
        },
        {
          subtitle: 'Safety & Security',
          text: 'To protect our community, prevent abuse, and maintain the security of our platform.'
        }
      ]
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing',
      icon: Globe,
      content: [
        {
          subtitle: 'Public Content',
          text: 'Photos and profile information you choose to make public are visible to other users and may appear in search results.'
        },
        {
          subtitle: 'Service Providers',
          text: 'We may share information with trusted third-party service providers who help us operate our platform.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose information when required by law or to protect our rights and the safety of our users.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger or acquisition, user information may be transferred as part of the business assets.'
        }
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: Lock,
      content: [
        {
          subtitle: 'Encryption',
          text: 'We use industry-standard encryption to protect your data both in transit and at rest.'
        },
        {
          subtitle: 'Access Controls',
          text: 'Strict access controls ensure only authorized personnel can access user data when necessary.'
        },
        {
          subtitle: 'Regular Audits',
          text: 'We conduct regular security audits and assessments to identify and address potential vulnerabilities.'
        },
        {
          subtitle: 'Incident Response',
          text: 'We have comprehensive incident response procedures to quickly address any security issues.'
        }
      ]
    },
    {
      id: 'user-rights',
      title: 'Your Rights and Controls',
      icon: UserCheck,
      content: [
        {
          subtitle: 'Access & Portability',
          text: 'You can access, download, and export your personal data at any time through your account settings.'
        },
        {
          subtitle: 'Correction & Updates',
          text: 'You can update or correct your personal information directly in your profile settings.'
        },
        {
          subtitle: 'Deletion',
          text: 'You can delete your account and associated data at any time. Some information may be retained for legal purposes.'
        },
        {
          subtitle: 'Privacy Controls',
          text: 'Granular privacy settings allow you to control who can see your content and contact you.'
        }
      ]
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking',
      icon: Eye,
      content: [
        {
          subtitle: 'Essential Cookies',
          text: 'Necessary for the platform to function properly, including authentication and security features.'
        },
        {
          subtitle: 'Analytics Cookies',
          text: 'Help us understand how users interact with our platform to improve the user experience.'
        },
        {
          subtitle: 'Preference Cookies',
          text: 'Remember your settings and preferences to provide a personalized experience.'
        },
        {
          subtitle: 'Cookie Management',
          text: 'You can manage cookie preferences through your browser settings or our cookie preference center.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
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
              <Shield className="h-5 w-5 text-blue-300" />
              <span className="font-medium">Your privacy is our priority</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block">Privacy</span>
              <span className="font-cursive text-6xl md:text-7xl bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              We believe in transparency about how we collect, use, and protect your personal information. 
              This policy explains our privacy practices in clear, understandable terms.
            </p>

            <div className="flex items-center justify-center space-x-6 text-sm text-white/80">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Last updated: March 15, 2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>GDPR Compliant</span>
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Privacy at a Glance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Lock,
                  title: 'Data Protection',
                  description: 'Your data is encrypted and securely stored with industry-leading security measures.'
                },
                {
                  icon: UserCheck,
                  title: 'Your Control',
                  description: 'You have full control over your data with easy access, correction, and deletion options.'
                },
                {
                  icon: Eye,
                  title: 'Transparency',
                  description: 'We clearly explain what data we collect, how we use it, and who we share it with.'
                }
              ].map((item, index) => (
                <div key={item.title} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                    <item.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-neutral-600">{item.description}</p>
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
                <div className="p-3 bg-blue-100 rounded-lg">
                  <section.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-neutral-900">{section.title}</h2>
              </div>

              <div className="space-y-6">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex} className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-3">{item.subtitle}</h3>
                    <p className="text-neutral-600 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* International Transfers */}
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
                <h3 className="text-lg font-semibold text-amber-900 mb-2">International Data Transfers</h3>
                <p className="text-amber-800 leading-relaxed">
                  Pixinity operates globally, and your information may be transferred to and processed in countries 
                  other than your own. We ensure appropriate safeguards are in place to protect your data in accordance 
                  with this privacy policy and applicable laws, including GDPR for EU residents.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Data Retention */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-xl p-8 border border-neutral-200 shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Data Retention</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-neutral-900">Account Data</h3>
                  <p className="text-neutral-600">Retained while your account is active and for a reasonable period after deletion for legal purposes.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-neutral-900">Content</h3>
                  <p className="text-neutral-600">Photos and content are deleted when you delete them or close your account, except where retention is required by law.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-neutral-900">Analytics Data</h3>
                  <p className="text-neutral-600">Aggregated and anonymized usage data may be retained longer for service improvement purposes.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Children's Privacy */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">Children's Privacy</h2>
            <p className="text-purple-800 leading-relaxed">
              Pixinity is not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children under 13. If you are a parent or guardian and believe your child has 
              provided us with personal information, please contact us immediately so we can delete such information.
            </p>
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
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              If you have any questions about this privacy policy or our data practices, 
              we're here to help. Contact our privacy team directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn bg-white text-blue-600 hover:bg-neutral-100">
                <Mail className="mr-2 h-5 w-5" />
                privacy@pixinity.com
              </button>
              <button className="btn-glass">
                <Shield className="mr-2 h-5 w-5" />
                Data Protection Officer
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
          <p>This privacy policy was last updated on March 15, 2024.</p>
          <p className="mt-2">We may update this policy from time to time. We'll notify you of any significant changes.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;