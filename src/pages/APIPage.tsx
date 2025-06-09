import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Key, 
  Book, 
  Zap, 
  Shield, 
  Globe,
  Copy,
  Check,
  ExternalLink,
  Download,
  Play,
  Terminal,
  Database,
  Layers
} from 'lucide-react';

const APIPage: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/photos',
      description: 'Retrieve a list of photos with optional filtering',
      parameters: ['page', 'limit', 'category', 'sort']
    },
    {
      method: 'GET',
      path: '/api/v1/photos/{id}',
      description: 'Get detailed information about a specific photo',
      parameters: ['include_exif', 'include_stats']
    },
    {
      method: 'POST',
      path: '/api/v1/photos',
      description: 'Upload a new photo to the platform',
      parameters: ['file', 'title', 'description', 'tags']
    },
    {
      method: 'GET',
      path: '/api/v1/users/{username}',
      description: 'Retrieve user profile information',
      parameters: ['include_stats', 'include_photos']
    }
  ];

  const codeExamples = {
    javascript: `// Initialize Pixinity API client
const pixinity = new PixinityAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.pixinity.com/v1'
});

// Fetch trending photos
const photos = await pixinity.photos.list({
  sort: 'trending',
  limit: 20,
  category: 'nature'
});

console.log(photos);`,
    
    python: `import pixinity

# Initialize client
client = pixinity.Client(api_key='your-api-key')

# Fetch trending photos
photos = client.photos.list(
    sort='trending',
    limit=20,
    category='nature'
)

print(photos)`,
    
    curl: `curl -X GET "https://api.pixinity.com/v1/photos" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -G \\
  -d "sort=trending" \\
  -d "limit=20" \\
  -d "category=nature"`
  };

  const copyToClipboard = (code: string, language: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(language);
    setTimeout(() => setCopiedCode(null), 2000);
  };

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
              <Code className="h-5 w-5 text-blue-300" />
              <span className="font-medium">Build amazing photo applications</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block">Pixinity</span>
              <span className="font-cursive text-6xl md:text-7xl bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                API
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              Access millions of high-quality photos, user data, and platform features through our powerful RESTful API. 
              Build the next generation of photography applications with Pixinity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn bg-white text-slate-900 hover:bg-neutral-100 text-lg px-8 py-4 group">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Get Started
              </button>
              <button className="btn-glass text-lg px-8 py-4 group">
                <Book className="mr-2 h-5 w-5" />
                View Documentation
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Start */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Get started in <span className="font-cursive bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">minutes</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Our API is designed to be developer-friendly with comprehensive documentation and easy authentication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Key, title: '1. Get API Key', description: 'Sign up and generate your API key from the developer dashboard' },
              { icon: Code, title: '2. Make Request', description: 'Use our RESTful endpoints to access photos, users, and collections' },
              { icon: Zap, title: '3. Build & Deploy', description: 'Create amazing applications with our powerful photo data' }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
                  <step.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">{step.title}</h3>
                <p className="text-neutral-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Code Examples */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Code <span className="font-cursive bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Examples</span>
            </h2>
            <p className="text-xl text-neutral-600">
              Get started quickly with these code examples in your favorite language.
            </p>
          </div>

          <div className="space-y-8">
            {Object.entries(codeExamples).map(([language, code]) => (
              <div key={language} className="bg-slate-900 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 bg-slate-800">
                  <div className="flex items-center space-x-3">
                    <Terminal className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-300 font-medium capitalize">{language}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(code, language)}
                    className="flex items-center space-x-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                  >
                    {copiedCode === language ? (
                      <>
                        <Check className="h-4 w-4 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-6 text-slate-300 overflow-x-auto">
                  <code>{code}</code>
                </pre>
              </div>
            ))}
          </div>
        </motion.section>

        {/* API Endpoints */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              API <span className="font-cursive bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Endpoints</span>
            </h2>
            <p className="text-xl text-neutral-600">
              Explore our comprehensive set of endpoints for accessing photos, users, and collections.
            </p>
          </div>

          <div className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <motion.div
                key={endpoint.path}
                className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                        endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                        endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-lg font-mono text-neutral-900">{endpoint.path}</code>
                    </div>
                    <p className="text-neutral-600 mb-3">{endpoint.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {endpoint.parameters.map((param) => (
                        <span
                          key={param}
                          className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-sm font-mono"
                        >
                          {param}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="btn-outline text-sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Try it
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Powerful <span className="font-cursive bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Features</span>
            </h2>
            <p className="text-xl text-neutral-600">
              Everything you need to build amazing photography applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Database, title: 'Rich Metadata', description: 'Access EXIF data, tags, categories, and detailed photo information' },
              { icon: Shield, title: 'Secure & Reliable', description: 'Enterprise-grade security with 99.9% uptime guarantee' },
              { icon: Zap, title: 'High Performance', description: 'Fast response times with global CDN and optimized endpoints' },
              { icon: Globe, title: 'Global Scale', description: 'Millions of photos from photographers worldwide' },
              { icon: Layers, title: 'Multiple Formats', description: 'Support for various image sizes and formats' },
              { icon: Book, title: 'Great Documentation', description: 'Comprehensive guides, examples, and interactive docs' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{feature.title}</h3>
                    <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Rate Limits */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Rate Limits & Pricing
              </h2>
              <p className="text-lg text-neutral-600">
                Flexible plans to suit your application's needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  name: 'Free', 
                  price: '$0', 
                  requests: '1,000/month', 
                  features: ['Basic endpoints', 'Community support', 'Standard rate limits'] 
                },
                { 
                  name: 'Pro', 
                  price: '$49', 
                  requests: '100,000/month', 
                  features: ['All endpoints', 'Priority support', 'Higher rate limits', 'Analytics'] 
                },
                { 
                  name: 'Enterprise', 
                  price: 'Custom', 
                  requests: 'Unlimited', 
                  features: ['Custom endpoints', 'Dedicated support', 'SLA guarantee', 'White-label options'] 
                }
              ].map((plan, index) => (
                <div
                  key={plan.name}
                  className={`bg-white rounded-xl p-6 border-2 ${
                    index === 1 ? 'border-blue-500 shadow-lg' : 'border-neutral-200'
                  }`}
                >
                  {index === 1 && (
                    <div className="bg-blue-500 text-white text-center py-2 px-4 rounded-lg mb-4 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-blue-600 mb-1">{plan.price}</div>
                    <div className="text-neutral-600">{plan.requests}</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-neutral-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`btn w-full ${
                    index === 1 ? 'btn-primary' : 'btn-outline'
                  }`}>
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-12">
            <h2 className="text-4xl font-bold mb-6">
              Ready to start <span className="font-cursive text-yellow-300">building</span>?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already building amazing applications with the Pixinity API.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn bg-white text-blue-600 hover:bg-neutral-100 text-lg px-8 py-4">
                <Key className="mr-2 h-5 w-5" />
                Get API Key
              </button>
              <button className="btn-glass text-lg px-8 py-4">
                <Download className="mr-2 h-5 w-5" />
                Download SDK
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default APIPage;