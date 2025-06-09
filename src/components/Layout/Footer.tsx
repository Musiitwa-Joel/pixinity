import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-white">Pixinity</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Discover and share beautiful photography from talented creators around the world. 
              Join our community of photographers and visual storytellers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/trending" className="text-sm hover:text-primary-500 transition-colors">
                  Trending
                </Link>
              </li>
              <li>
                <Link to="/categories/nature" className="text-sm hover:text-primary-500 transition-colors">
                  Nature
                </Link>
              </li>
              <li>
                <Link to="/categories/architecture" className="text-sm hover:text-primary-500 transition-colors">
                  Architecture
                </Link>
              </li>
              <li>
                <Link to="/categories/travel" className="text-sm hover:text-primary-500 transition-colors">
                  Travel
                </Link>
              </li>
              <li>
                <Link to="/categories/portraits" className="text-sm hover:text-primary-500 transition-colors">
                  Portraits
                </Link>
              </li>
              <li>
                <Link to="/featured" className="text-sm hover:text-primary-500 transition-colors">
                  Featured
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Community
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/photographers" className="text-sm hover:text-primary-500 transition-colors">
                  Photographers
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-sm hover:text-primary-500 transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/challenges" className="text-sm hover:text-primary-500 transition-colors">
                  Photo Challenges
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm hover:text-primary-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-sm hover:text-primary-500 transition-colors">
                  Community Forum
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm hover:text-primary-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm hover:text-primary-500 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-sm hover:text-primary-500 transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-sm hover:text-primary-500 transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-sm hover:text-primary-500 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-primary-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-neutral-400">
              © 2025 Pixinity. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">
                Terms of Service
              </Link>
              <Link to="/licenses" className="text-sm text-neutral-400 hover:text-primary-500 transition-colors">
                License
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;