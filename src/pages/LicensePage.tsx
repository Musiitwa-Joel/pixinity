import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Download, 
  Eye, 
  DollarSign, 
  Users,
  Globe,
  CheckCircle,
  XCircle,
  Info,
  Scale,
  Camera,
  Building,
  Heart,
  Share2,
  Star,
  Shield,
  Zap,
  ArrowRight
} from 'lucide-react';

const LicensePage: React.FC = () => {
  const [selectedLicense, setSelectedLicense] = useState<string>('free');

  const licenses = [
    {
      id: 'free',
      name: 'Pixinity Free',
      icon: Heart,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-500',
      description: 'Free to use for any purpose with attribution',
      price: 'Free',
      popular: false,
      permissions: [
        'Commercial use',
        'Personal use',
        'Educational use',
        'Modification allowed',
        'Distribution allowed'
      ],
      requirements: [
        'Attribution required',
        'Link back to Pixinity',
        'Credit the photographer'
      ],
      restrictions: [
        'Cannot resell as-is',
        'Cannot claim ownership',
        'Cannot use in harmful content'
      ],
      useCases: [
        'Blog posts and articles',
        'Social media content',
        'Educational materials',
        'Small business marketing',
        'Personal projects'
      ]
    },
    {
      id: 'cc0',
      name: 'CC0 Public Domain',
      icon: Globe,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-500',
      description: 'No rights reserved - use however you want',
      price: 'Free',
      popular: true,
      permissions: [
        'Commercial use',
        'Personal use',
        'Educational use',
        'Modification allowed',
        'Distribution allowed',
        'No attribution required'
      ],
      requirements: [],
      restrictions: [
        'Cannot claim ownership of original',
        'Cannot use in harmful content'
      ],
      useCases: [
        'Any commercial project',
        'Product packaging',
        'Website backgrounds',
        'App interfaces',
        'Print materials'
      ]
    },
    {
      id: 'attribution',
      name: 'Attribution Required',
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-500',
      description: 'Free with proper credit to the creator',
      price: 'Free',
      popular: false,
      permissions: [
        'Commercial use',
        'Personal use',
        'Educational use',
        'Modification allowed',
        'Distribution allowed'
      ],
      requirements: [
        'Attribution required',
        'Credit photographer name',
        'Link to original source',
        'Mention license type'
      ],
      restrictions: [
        'Cannot resell as-is',
        'Cannot claim ownership',
        'Cannot remove attribution'
      ],
      useCases: [
        'Blog posts with credits',
        'Academic publications',
        'Non-profit campaigns',
        'Creative projects',
        'Editorial content'
      ]
    },
    {
      id: 'premium',
      name: 'Premium License',
      icon: Award,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-500',
      description: 'Extended rights for commercial use',
      price: 'Paid',
      popular: false,
      permissions: [
        'Extended commercial use',
        'Unlimited distribution',
        'Exclusive usage options',
        'High-resolution access',
        'Priority support'
      ],
      requirements: [
        'Purchase license',
        'Agree to terms'
      ],
      restrictions: [
        'Cannot resell license',
        'Cannot sublicense',
        'Usage tracking required'
      ],
      useCases: [
        'Large marketing campaigns',
        'Product packaging',
        'Broadcast media',
        'Enterprise applications',
        'Exclusive projects'
      ]
    }
  ];

  const currentLicense = licenses.find(l => l.id === selectedLicense) || licenses[0];

  const comparisonFeatures = [
    { feature: 'Personal Use', free: true, cc0: true, attribution: true, premium: true },
    { feature: 'Commercial Use', free: true, cc0: true, attribution: true, premium: true },
    { feature: 'Modification', free: true, cc0: true, attribution: true, premium: true },
    { feature: 'Attribution Required', free: true, cc0: false, attribution: true, premium: false },
    { feature: 'High Resolution', free: false, cc0: true, attribution: false, premium: true },
    { feature: 'Exclusive Rights', free: false, cc0: false, attribution: false, premium: true },
    { feature: 'Priority Support', free: false, cc0: false, attribution: false, premium: true },
    { feature: 'Usage Analytics', free: false, cc0: false, attribution: false, premium: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
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
              <Scale className="h-5 w-5 text-purple-300" />
              <span className="font-medium">Clear licensing for creative freedom</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block">Photo</span>
              <span className="font-cursive text-6xl md:text-7xl bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                Licenses
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Understand the different license types available on Pixinity and choose the right one for your project. 
              From free usage to premium commercial rights, we've got you covered.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* License Types */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Choose your <span className="font-cursive bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">license</span>
            </h2>
            <p className="text-xl text-neutral-600">
              Each license type offers different rights and requirements. Select the one that best fits your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {licenses.map((license, index) => (
              <motion.div
                key={license.id}
                className={`relative bg-white rounded-2xl p-8 border-2 cursor-pointer transition-all duration-300 ${
                  selectedLicense === license.id 
                    ? `${license.borderColor} shadow-xl` 
                    : 'border-neutral-200 hover:border-neutral-300 shadow-sm hover:shadow-lg'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedLicense(license.id)}
              >
                {license.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${license.bgColor} rounded-full mb-6`}>
                    <license.icon className={`h-8 w-8 ${license.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{license.name}</h3>
                  <p className="text-neutral-600 mb-4 text-sm">{license.description}</p>
                  
                  <div className="text-3xl font-bold text-neutral-900 mb-6">{license.price}</div>
                  
                  <button className={`btn w-full ${
                    selectedLicense === license.id ? 'btn-primary' : 'btn-outline'
                  }`}>
                    {selectedLicense === license.id ? 'Selected' : 'Select License'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* License Details */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm">
            <div className="flex items-center space-x-4 mb-8">
              <div className={`p-4 ${currentLicense.bgColor} rounded-xl`}>
                <currentLicense.icon className={`h-8 w-8 ${currentLicense.color}`} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-neutral-900">{currentLicense.name}</h2>
                <p className="text-neutral-600">{currentLicense.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Permissions */}
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>What you can do</span>
                </h3>
                <ul className="space-y-3">
                  {currentLicense.permissions.map((permission, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-neutral-600">{permission}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center space-x-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  <span>Requirements</span>
                </h3>
                {currentLicense.requirements.length > 0 ? (
                  <ul className="space-y-3">
                    {currentLicense.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span className="text-neutral-600">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-neutral-500 italic">No special requirements</p>
                )}
              </div>

              {/* Restrictions */}
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center space-x-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span>Restrictions</span>
                </h3>
                <ul className="space-y-3">
                  {currentLicense.restrictions.map((restriction, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <span className="text-neutral-600">{restriction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Use Cases */}
            <div className="mt-8 pt-8 border-t border-neutral-200">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Perfect for:</h3>
              <div className="flex flex-wrap gap-3">
                {currentLicense.useCases.map((useCase, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-full text-sm"
                  >
                    {useCase}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Comparison Table */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              License <span className="font-cursive bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Comparison</span>
            </h2>
            <p className="text-xl text-neutral-600">
              Compare features across all license types to make the right choice.
            </p>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="text-left p-6 font-semibold text-neutral-900">Feature</th>
                    <th className="text-center p-6 font-semibold text-neutral-900">Free</th>
                    <th className="text-center p-6 font-semibold text-neutral-900">CC0</th>
                    <th className="text-center p-6 font-semibold text-neutral-900">Attribution</th>
                    <th className="text-center p-6 font-semibold text-neutral-900">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr key={feature.feature} className={index % 2 === 0 ? 'bg-neutral-25' : 'bg-white'}>
                      <td className="p-6 font-medium text-neutral-900">{feature.feature}</td>
                      <td className="p-6 text-center">
                        {feature.free ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {feature.cc0 ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {feature.attribution ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {feature.premium ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* Attribution Examples */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Attribution <span className="font-cursive bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Examples</span>
            </h2>
            <p className="text-xl text-neutral-600">
              When attribution is required, here's how to properly credit photographers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Online Attribution</h3>
              <div className="bg-neutral-50 rounded-lg p-4 font-mono text-sm">
                Photo by <a href="#" className="text-blue-600 underline">John Doe</a> on <a href="#" className="text-blue-600 underline">Pixinity</a>
              </div>
              <p className="text-neutral-600 text-sm mt-3">
                Include clickable links to the photographer's profile and Pixinity when possible.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">Print Attribution</h3>
              <div className="bg-neutral-50 rounded-lg p-4 font-mono text-sm">
                Photo: John Doe / Pixinity.com
              </div>
              <p className="text-neutral-600 text-sm mt-3">
                For print materials, include the photographer's name and mention Pixinity.
              </p>
            </div>
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Frequently Asked <span className="font-cursive bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: 'Can I use photos for commercial purposes?',
                answer: 'Yes! Most of our licenses allow commercial use. Check the specific license details for each photo.'
              },
              {
                question: 'Do I need to pay for attribution-required photos?',
                answer: 'No, attribution-required photos are free to use. You just need to credit the photographer properly.'
              },
              {
                question: 'What happens if I forget to add attribution?',
                answer: 'Please add the attribution as soon as possible. Repeated violations may result in account restrictions.'
              },
              {
                question: 'Can I modify photos under these licenses?',
                answer: 'Most licenses allow modifications. Check the specific permissions for each license type.'
              },
              {
                question: 'How do I upgrade to a premium license?',
                answer: 'Contact the photographer directly or reach out to our sales team for premium licensing options.'
              }
            ].map((faq, index) => (
              <motion.details
                key={index}
                className="bg-white rounded-xl border border-neutral-200 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <summary className="p-6 cursor-pointer hover:bg-neutral-50 rounded-xl transition-colors">
                  <h3 className="text-lg font-semibold text-neutral-900">{faq.question}</h3>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
                </div>
              </motion.details>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to find the perfect <span className="font-cursive text-yellow-300">photo</span>?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Browse millions of high-quality photos with clear licensing. 
              Find exactly what you need for your next project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn bg-white text-indigo-600 hover:bg-neutral-100 text-lg px-8 py-4 group">
                <Camera className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Browse Photos
              </button>
              <button className="btn-glass text-lg px-8 py-4 group">
                <span>Learn More</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default LicensePage;