// Test script to check notifications in database
const mongoose = require('mongoose');
require('dotenv').config();

// Import models (from current directory since we're in backend/)
const Notification = require('./models/Notification');
const User = require('./models/User');
const Book = require('./models/Book');

async function testNotifications() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check how many notifications exist
    const totalNotifications = await Notification.countDocuments();
    console.log(`📊 Total notifications in database: ${totalNotifications}`);
    
    if (totalNotifications > 0) {
      console.log('\n📋 Recent notifications:');
      const recentNotifications = await Notification.find()
        .populate('sender', 'name email')
        .populate('recipient', 'name email')
        .populate('book', 'title author')
        .sort({ createdAt: -1 })
        .limit(5);
        
      recentNotifications.forEach((notif, index) => {
        console.log(`\n${index + 1}. ${notif.type} notification:`);
        console.log(`   From: ${notif.sender?.name} (${notif.sender?.email})`);
        console.log(`   To: ${notif.recipient?.name} (${notif.recipient?.email})`);
        console.log(`   Book: ${notif.book?.title}`);
        console.log(`   Message: ${notif.message}`);
        console.log(`   Status: ${notif.status}`);
        console.log(`   Contact Info: ${JSON.stringify(notif.contactInfo)}`);
        console.log(`   Created: ${notif.createdAt}`);
      });
    } else {
      console.log('❌ No notifications found in database');
      console.log('💡 This means no contact requests have been sent yet');
    }
    
    // Check users
    const totalUsers = await User.countDocuments();
    console.log(`\n👥 Total users: ${totalUsers}`);
    
    // Check books  
    const totalBooks = await Book.countDocuments();
    console.log(`📚 Total books: ${totalBooks}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testNotifications();
