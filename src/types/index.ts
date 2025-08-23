export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin: boolean;
}

export interface Service {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
  isActive: boolean;
}

export interface Booking {
  _id: string;
  user: User;
  services: Service[];
  date: string;
  time: string;
  address: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface CartItem {
  service: Service;
  quantity: number;
}