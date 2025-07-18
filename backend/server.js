const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const userRoutes = require('./routes/userRoutes');  // ✅ User routes
const bookRoutes = require('./routes/bookRoutes');  // ✅ Book routes
const notificationRoutes = require('./routes/notificationRoutes');  // 🔔 Notification routes

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);   // 🧑‍💻 Auth routes
app.use('/api/books', bookRoutes);   // 📚 Book upload/fetch routes
app.use('/api/notifications', notificationRoutes);   // 🔔 Notification routes

// Test route
app.get('/', (req, res) => {
  res.send('📚 BookBarter API is running!');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
