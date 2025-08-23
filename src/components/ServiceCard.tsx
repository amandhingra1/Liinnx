import React from 'react';
import { Clock, Plus } from 'lucide-react';
import { Service } from '../types';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(service);
    toast.success(`${service.name} added to cart!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={service.image || 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg'}
          alt={service.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-pink-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
          ₹{service.price}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>{service.duration} mins</span>
          </div>
          <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">
            {service.category}
          </span>
        </div>
        
        <button
          onClick={handleAddToCart}
          className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;