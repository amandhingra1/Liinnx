import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const whatsappNumber = '+919834828850';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}`;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-pink-600 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">
                MI
              </div>
              <span className="text-2xl font-bold">Miss Irish</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your trusted partner for premium beauty services at home. We bring professional 
              salon experience to your doorstep with certified beauticians and quality products.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-pink-400 transition-colors">Home</a></li>
              <li><a href="/services" className="text-gray-300 hover:text-pink-400 transition-colors">Services</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-pink-400 transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-pink-400 transition-colors">Contact</a></li>
              <li><a href="/privacy" className="text-gray-300 hover:text-pink-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-pink-400" />
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-pink-400 transition-colors"
                >
                  {whatsappNumber}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-pink-400" />
                <a 
                  href="mailto:info@missirishbeauty.com"
                  className="text-gray-300 hover:text-pink-400 transition-colors"
                >
                  info@missirishbeauty.com
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-pink-400 mt-1" />
                <span className="text-gray-300">
                  Available across major cities in India
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Miss Irish Beauty Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;