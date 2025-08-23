import React from 'react';
import { Star, Users, Award, Heart, Shield, Clock } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Miss Irish</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Bringing professional beauty services to your doorstep with care, quality, and convenience.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Miss Irish was founded with a simple yet powerful vision: to make professional beauty 
                services accessible to everyone in the comfort of their own homes. We understand that 
                in today's busy world, finding time for self-care can be challenging.
              </p>
              <p className="text-gray-600 mb-4">
                Our team of certified beauticians brings years of experience and expertise directly 
                to your doorstep. We use only premium products and maintain the highest standards 
                of hygiene and safety in all our services.
              </p>
              <p className="text-gray-600">
                From manicures and pedicures to facials and hair treatments, we offer a comprehensive 
                range of beauty services designed to help you look and feel your best.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3997991/pexels-photo-3997991.jpeg"
                alt="Beauty services"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">What makes Miss Irish special</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Care & Compassion</h3>
              <p className="text-gray-600">
                We treat every client with genuine care and attention, ensuring a personalized 
                experience that makes you feel valued and pampered.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every service we provide, using premium products 
                and the latest techniques to deliver outstanding results.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Safety & Hygiene</h3>
              <p className="text-gray-600">
                Your safety is our priority. We follow strict hygiene protocols and use 
                sanitized tools and equipment for every service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-pink-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-pink-100">Expert Beauticians</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-pink-100">Beauty Services</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5★</div>
              <div className="text-pink-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Miss Irish?</h2>
            <p className="text-xl text-gray-600">Experience the difference with our premium services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-pink-100 rounded-full p-2 flex-shrink-0">
                <Users className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Certified Professionals</h3>
                <p className="text-gray-600">
                  All our beauticians are trained, certified, and experienced professionals who 
                  stay updated with the latest beauty trends and techniques.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-pink-100 rounded-full p-2 flex-shrink-0">
                <Clock className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Flexible Scheduling</h3>
                <p className="text-gray-600">
                  Book services at your convenience with flexible timing options. We're available 
                  7 days a week to fit your busy schedule.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-pink-100 rounded-full p-2 flex-shrink-0">
                <Star className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Premium Products</h3>
                <p className="text-gray-600">
                  We use only high-quality, branded products that are safe for all skin types 
                  and deliver exceptional results.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-pink-100 rounded-full p-2 flex-shrink-0">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Personalized Care</h3>
                <p className="text-gray-600">
                  Every service is tailored to your specific needs and preferences, ensuring 
                  a personalized beauty experience every time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;