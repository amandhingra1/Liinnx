const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/miss-irish', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Service Schema
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // in minutes
  image: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
  date: { type: Date, required: true },
  time: { type: String, required: true },
  address: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  whatsappSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Service = mongoose.model('Service', serviceSchema);
const Booking = mongoose.model('Booking', bookingSchema);

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin middleware
const adminAuth = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Routes

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();
    
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
    res.status(201).json({ token, user: { id: user._id, name, email, phone, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email, phone: user.phone, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Service Routes
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/services/categories', async (req, res) => {
  try {
    const categories = await Service.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Routes
app.get('/api/admin/services', auth, adminAuth, async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/admin/services', auth, adminAuth, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/admin/services/:id', auth, adminAuth, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/admin/services/:id', auth, adminAuth, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Booking Routes
app.post('/api/bookings', auth, async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      user: req.user.userId
    });
    await booking.save();
    await booking.populate('services user');
    
    // Generate WhatsApp message
    const whatsappMessage = generateWhatsAppMessage(booking);
    
    res.status(201).json({ booking, whatsappMessage });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/bookings', auth, adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user services').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate WhatsApp message
function generateWhatsAppMessage(booking) {
  const serviceNames = booking.services.map(s => s.name).join(', ');
  return `New booking from Miss Irish!\n\nCustomer: ${booking.user.name}\nPhone: ${booking.user.phone}\nServices: ${serviceNames}\nDate: ${new Date(booking.date).toLocaleDateString()}\nTime: ${booking.time}\nAddress: ${booking.address}\nTotal: ₹${booking.totalAmount}`;
}

// Initialize default admin and services
async function initializeData() {
  try {
    // Create default admin
    const adminExists = await User.findOne({ isAdmin: true });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        name: 'Admin',
        email: 'admin@missirishbeauty.com',
        phone: '+919834828850',
        password: hashedPassword,
        isAdmin: true
      });
      await admin.save();
      console.log('Default admin created');
    }

    // Create default services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      const defaultServices = [
        {
          name: 'Classic Pedicure',
          category: 'Pedicure',
          description: 'Complete foot care with nail trimming, cuticle care, and moisturizing',
          price: 599,
          duration: 45,
          image: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg'
        },
        {
          name: 'Classic Manicure',
          category: 'Manicure',
          description: 'Professional nail care with shaping, cuticle treatment, and polish',
          price: 499,
          duration: 30,
          image: 'https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg'
        },
        {
          name: 'Facial Cleanup',
          category: 'Facial',
          description: 'Deep cleansing facial for glowing and refreshed skin',
          price: 799,
          duration: 60,
          image: 'https://images.pexels.com/photos/3985360/pexels-photo-3985360.jpeg'
        },
        {
          name: 'Hair Spa',
          category: 'Hair Care',
          description: 'Nourishing hair treatment for healthy and shiny hair',
          price: 1299,
          duration: 90,
          image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg'
        },
        {
          name: 'Eyebrow Threading',
          category: 'Threading',
          description: 'Precise eyebrow shaping with threading technique',
          price: 199,
          duration: 15,
          image: 'https://images.pexels.com/photos/3997991/pexels-photo-3997991.jpeg'
        },
        {
          name: 'Full Body Massage',
          category: 'Massage',
          description: 'Relaxing full body massage for stress relief',
          price: 1599,
          duration: 60,
          image: 'https://images.pexels.com/photos/3997996/pexels-photo-3997996.jpeg'
        }
      ];

      await Service.insertMany(defaultServices);
      console.log('Default services created');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeData();
});