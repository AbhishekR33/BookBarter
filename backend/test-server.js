// Test server.js - to isolate the route issue
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('📚 BookBarter API is running!');
});

// Test individual routes one by one
console.log('🔍 Testing userRoutes...');
try {
  const userRoutes = require('./routes/userRoutes');
  app.use('/api/users', userRoutes);
  console.log('✅ userRoutes loaded successfully');
} catch (error) {
  console.error('❌ Error loading userRoutes:', error.message);
}

console.log('🔍 Testing notificationRoutes...');
try {
  const notificationRoutes = require('./routes/notificationRoutes');
  app.use('/api/notifications', notificationRoutes);
  console.log('✅ notificationRoutes loaded successfully');
} catch (error) {
  console.error('❌ Error loading notificationRoutes:', error.message);
}

console.log('🔍 Testing bookRoutes...');
try {
  const bookRoutes = require('./routes/bookRoutes');
  app.use('/api/books', bookRoutes);
  console.log('✅ bookRoutes loaded successfully');
} catch (error) {
  console.error('❌ Error loading bookRoutes:', error.message);
}

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
