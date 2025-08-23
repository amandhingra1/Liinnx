import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate WhatsApp message
    const whatsappMessage = `Hi! I'm ${formData.name}.\n\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage: ${formData.message}`;
    const whatsappUrl = `https://wa.me/919834828850?text=${encodeURIComponent(whatsappMessage)}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success('Redirecting to WhatsApp...');
    
    // Reset form
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const whatsappUrl = 'https://wa.me/919834828850?text=Hi! I would like to know more about Miss Irish beauty services.';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Get in touch with us for bookings, inquiries, or any questions about our services.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-pink-100 rounded-full p-3">
                  <Phone className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Phone & WhatsApp</h3>
                  <p className="text-gray-600 mb-2">Call or message us anytime</p>
                  <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-700 font-medium"
                  >
                    +91 98348 28850
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-pink-100 rounded-full p-3">
                  <Mail className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Email</h3>
                  <p className="text-gray-600 mb-2">Send us an email</p>
                  <a 
                    href="mailto:info@missirishbeauty.com"
                    className="text-pink-600 hover:text-pink-700 font-medium"
                  >
                    info@missirishbeauty.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-pink-100 rounded-full p-3">
                  <MapPin className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Service Areas</h3>
                  <p className="text-gray-600">
                    We provide home beauty services across major cities in India. 
                    Contact us to check availability in your area.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-pink-100 rounded-full p-3">
                  <Clock className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Working Hours</h3>
                  <div className="text-gray-600 space-y-1">
                    <p>Monday - Sunday: 9:00 AM - 9:00 PM</p>
                    <p className="text-sm">Flexible timing available on request</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Button */}
            <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3 mb-3">
                <MessageCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">Quick Contact</h3>
              </div>
              <p className="text-gray-600 mb-4">
                For immediate assistance and bookings, contact us directly on WhatsApp.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors inline-flex items-center space-x-2"
              >
                <Phone className="h-5 w-5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Tell us about your requirements or any questions you have..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-3 px-6 rounded-md hover:bg-pink-700 transition-colors font-medium"
              >
                Send Message via WhatsApp
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-4 text-center">
              * This form will redirect you to WhatsApp with your message pre-filled
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;