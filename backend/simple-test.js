// Simple test to check if Express works
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  // Simple test to check notification system
// Run this in backend: node simple-test.js

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Notification = require('./models/Notification');

async function simpleTest() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Find users
    const abhishek = await User.findOne({ name: /abhishek/i });
    const prashant = await User.findOne({ name: /prashant/i });
    
    if (!abhishek || !prashant) {
      console.log('❌ Users not found:');
      console.log('Abhishek:', abhishek ? '✅ Found' : '❌ Not found');
      console.log('Prashant:', prashant ? '✅ Found' : '❌ Not found');
      return;
    }
    
    console.log('👥 Users found:');
    console.log(`Abhishek: ${abhishek.name} (${abhishek.email}) - ID: ${abhishek._id}`);
    console.log(`Prashant: ${prashant.name} (${prashant.email}) - ID: ${prashant._id}`);
    
    // Check notifications for abhishek
    const abhishekNotifications = await Notification.find({ recipient: abhishek._id });
    console.log(`📨 Abhishek notifications: ${abhishekNotifications.length}`);
    
    // Check notifications for prashant
    const prashantNotifications = await Notification.find({ recipient: prashant._id });
    console.log(`📨 Prashant notifications: ${prashantNotifications.length}`);
    
    // Show all notifications with details
    const allNotifications = await Notification.find()
      .populate('sender', 'name')
      .populate('recipient', 'name')
      .sort({ createdAt: -1 });
      
    console.log('🔔 All notifications:');
    if (allNotifications.length === 0) {
      console.log('  No notifications found');
    } else {
      allNotifications.forEach((notif, index) => {
        console.log(`  ${index + 1}. From: ${notif.sender?.name} → To: ${notif.recipient?.name}`);
        console.log(`     Type: ${notif.type}, Status: ${notif.status}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

simpleTest();
});
