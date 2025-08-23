import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getTotalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuantityChange = (serviceId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(serviceId, newQuantity);
  };

  const handleRemoveItem = (serviceId: string) => {
    removeFromCart(serviceId);
    toast.success('Item removed from cart');
  };

  const handleProceedToBooking = () => {
    if (!user) {
      toast.error('Please login to proceed with booking');
      navigate('/login');
      return;
    }
    navigate('/booking');
  };

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;

    const servicesList = items.map(item => 
      `${item.service.name} (Qty: ${item.quantity}) - ₹${item.service.price * item.quantity}`
    ).join('\n');

    const totalAmount = getTotalAmount();
    const whatsappNumber = '+919834828850';
    const message = `Hi! I want to book the following services from Miss Irish:\n\n${servicesList}\n\nTotal Amount: ₹${totalAmount}\n\nPlease confirm my booking.`;
    
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some services to get started</p>
            <button
              onClick={() => navigate('/services')}
              className="bg-pink-600 text-white px-8 py-3 rounded-md hover:bg-pink-700 transition-colors"
            >
              Browse Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Cart Items */}
          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item.service._id} className="p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.service.image || 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg'}
                    alt={item.service.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{item.service.name}</h3>
                    <p className="text-gray-600 text-sm">{item.service.category}</p>
                    <p className="text-pink-600 font-semibold">₹{item.service.price}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item.service._id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4 text-gray-600" />
                    </button>
                    
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    
                    <button
                      onClick={() => handleQuantityChange(item.service._id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-800">
                      ₹{item.service.price * item.quantity}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.service._id)}
                      className="text-red-500 hover:text-red-700 transition-colors mt-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
              <span className="text-2xl font-bold text-pink-600">₹{getTotalAmount()}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleWhatsAppOrder}
                className="flex-1 bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Phone className="h-5 w-5" />
                <span>Order via WhatsApp</span>
              </button>
              
              <button
                onClick={handleProceedToBooking}
                disabled={isProcessing}
                className="flex-1 bg-pink-600 text-white py-3 px-6 rounded-md hover:bg-pink-700 transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Proceed to Booking'}
              </button>
            </div>

            <button
              onClick={clearCart}
              className="w-full mt-4 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;