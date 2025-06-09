import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Headphones,
  Building,
  Globe,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>();

  const categories = [
    'General Inquiry',
    'Technical Support',
    'Account Issues',
    'Business Partnership',
    'Press & Media',
    'Feature Request',
    'Bug Report',
    'Other'
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'support@pixinity.com',
      response: 'Response within 4 hours',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our team',
      contact: 'Available 24/7',
      response: 'Instant response',
      color: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak with an expert',
      contact: '+1 (555) 123-4567',
      response: 'Mon-Fri 9AM-6PM PST',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Building,
      title: 'Business Inquiries',
      description: 'Partnership opportunities',
      contact: 'business@pixinity.com',
      response: 'Response within 24 hours',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100'
    }
  ];

  const offices = [
    {
      city: 'San Francisco',
      address: '123 Photography Street, Suite 100',
      zipCode: 'San Francisco, CA 94105',
      phone: '+1 (555) 123-4567',
      email: 'sf@pixinity.com'
    },
    {
      city: 'New York',
      address: '456 Creative Avenue, Floor 15',
      zipCode: 'New York, NY 10001',
      phone: '+1 (555) 987-6543',
      email: 'ny@pixinity.com'
    },
    {
      city: 'London',
      address: '789 Innovation Lane',
      zipCode: 'London, UK EC1A 1BB',
      phone: '+44 20 7123 4567',
      email: 'london@pixinity.com'
    }
  ];

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 text-white overflow-hidden">
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
              <Headphones className="h-5 w-5 text-cyan-300" />
              <span className="font-medium">We're here to help you succeed</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block">Get in</span>
              <span className="font-cursive text-6xl md:text-7xl bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                touch
              </span>
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Have questions, feedback, or need support? Our team is ready to help you make the most of Pixinity. 
              Reach out through your preferred channel and we'll get back to you quickly.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Methods */}
        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Choose your <span className="font-cursive bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">method</span>
            </h2>
            <p className="text-xl text-neutral-600">
              Multiple ways to reach us, all designed for your convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${method.bgColor} rounded-full mb-6`}>
                    <method.icon className={`h-8 w-8 ${method.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">{method.title}</h3>
                  <p className="text-neutral-600 mb-4">{method.description}</p>
                  <div className="space-y-2">
                    <div className="font-semibold text-neutral-900">{method.contact}</div>
                    <div className="text-sm text-neutral-500">{method.response}</div>
                  </div>
                  <button className="btn-primary w-full mt-6">
                    Contact Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm">
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">
                Send us a <span className="font-cursive bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">message</span>
              </h2>
              <p className="text-neutral-600 mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type="text"
                      className="input"
                      placeholder="Your full name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      className="input"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category', { required: 'Please select a category' })}
                    className="input"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Subject *
                  </label>
                  <input
                    {...register('subject', { required: 'Subject is required' })}
                    type="text"
                    className="input"
                    placeholder="Brief description of your inquiry"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    {...register('message', { required: 'Message is required' })}
                    rows={6}
                    className="input resize-none"
                    placeholder="Please provide as much detail as possible..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.section>

          {/* Office Locations */}
          <motion.section
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-neutral-900 mb-6">
              Our <span className="font-cursive bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">offices</span>
            </h2>
            <p className="text-neutral-600 mb-8">
              Visit us at one of our global locations or reach out to your nearest office.
            </p>

            <div className="space-y-6">
              {offices.map((office, index) => (
                <motion.div
                  key={office.city}
                  className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-r from-teal-100 to-blue-100 rounded-lg">
                      <MapPin className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-neutral-900 mb-2">{office.city}</h3>
                      <div className="space-y-2 text-neutral-600">
                        <p>{office.address}</p>
                        <p>{office.zipCode}</p>
                        <div className="flex items-center space-x-4 pt-2">
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <span className="text-sm">{office.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span className="text-sm">{office.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Business Hours */}
            <motion.div
              className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="h-6 w-6 text-teal-600" />
                <h3 className="text-xl font-bold text-neutral-900">Business Hours</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-neutral-700">
                <div>
                  <div className="font-medium">Support Team</div>
                  <div className="text-sm">24/7 Live Chat & Email</div>
                </div>
                <div>
                  <div className="font-medium">Phone Support</div>
                  <div className="text-sm">Mon-Fri 9AM-6PM PST</div>
                </div>
                <div>
                  <div className="font-medium">Business Inquiries</div>
                  <div className="text-sm">Mon-Fri 9AM-5PM PST</div>
                </div>
                <div>
                  <div className="font-medium">Emergency Support</div>
                  <div className="text-sm">24/7 for Enterprise customers</div>
                </div>
              </div>
            </motion.div>
          </motion.section>
        </div>

        {/* FAQ Section */}
        <motion.section
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-6">
              Before you <span className="font-cursive bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">contact</span> us
            </h2>
            <p className="text-xl text-neutral-600">
              Check if your question is already answered in our FAQ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                question: 'How quickly do you respond?',
                answer: 'Live chat: Instant, Email: Within 4 hours, Phone: Immediate during business hours'
              },
              {
                question: 'Do you offer phone support?',
                answer: 'Yes! Phone support is available Monday-Friday 9AM-6PM PST for all users'
              },
              {
                question: 'Can I schedule a call?',
                answer: 'Absolutely! Business customers can schedule calls through our calendar booking system'
              },
              {
                question: 'What about enterprise support?',
                answer: 'Enterprise customers get dedicated support with guaranteed response times and priority handling'
              },
              {
                question: 'Do you have international support?',
                answer: 'Yes, we have offices in San Francisco, New York, and London with local support teams'
              },
              {
                question: 'Is support available in other languages?',
                answer: 'Currently we offer support in English, with Spanish and French coming soon'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-bold text-neutral-900 mb-3">{faq.question}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="btn-outline group">
              <span>View All FAQs</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ContactPage;