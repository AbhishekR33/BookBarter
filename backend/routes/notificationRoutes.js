// backend/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');
const Book = require('../models/Book');

// Get all notifications for a user
router.get('/user/:userId', async (req, res) => {
  try {
    console.log('🔍 Fetching notifications for user ID:', req.params.userId);
    
    const notifications = await Notification.find({ 
      recipient: req.params.userId 
    })
    .populate('sender', 'name email')
    .populate('book', 'title author')
    .sort({ createdAt: -1 });

    console.log(`📨 Found ${notifications.length} notifications for user ${req.params.userId}`);
    res.json(notifications);
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    );
    
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Error updating notification' });
  }
});

// Get unread notification count
router.get('/unread/:userId', async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.params.userId,
      status: 'unread'
    });
    
    res.json({ count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Error getting unread count' });
  }
});

// Delete notification
router.delete('/:id', async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
});

module.exports = router;
