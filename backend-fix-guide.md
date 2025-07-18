# Quick Backend Fix Guide

## 🚨 The Problem
The `bookRoutes.js` file is corrupted and causing "argument handler must be a function" error.

## ✅ Quick Fix Steps:

### Step 1: Replace the corrupted bookRoutes.js
1. Go to `backend/routes/` folder
2. Delete `bookRoutes.js` 
3. Copy this content into a new `bookRoutes.js` file:

```javascript
const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Notification = require('../models/Notification');

// GET /books - Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({ availability: { $ne: 'sold' } })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching books', error: err.message });
  }
});

// GET /books/user/:userId - Get books by specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const books = await Book.find({ owner: req.params.userId })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user books', error: err.message });
  }
});

// POST /books - Create a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, description, condition, availability, price, owner } = req.body;
    
    if (!title || !author || !owner) {
      return res.status(400).json({ message: 'Title, author, and owner are required' });
    }
    
    const book = new Book({
      title,
      author,
      description,
      condition,
      availability,
      price: availability === 'for_sale' || availability === 'for_both' ? price : null,
      owner
    });
    
    await book.save();
    const populatedBook = await Book.findById(book._id).populate('owner', 'name email');
    res.status(201).json(populatedBook);
  } catch (err) {
    res.status(500).json({ message: 'Error creating book', error: err.message });
  }
});

// PUT /books/:id - Update a book
router.put('/:id', async (req, res) => {
  try {
    const { title, author, description, condition, availability, price } = req.body;
    
    const updateData = {
      title,
      author,
      description,
      condition,
      availability,
      price: availability === 'for_sale' || availability === 'for_both' ? price : null
    };
    
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('owner', 'name email');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Error updating book', error: err.message });
  }
});

// DELETE /books/:id - Delete a book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting book', error: err.message });
  }
});

// POST /books/contact - Send contact message
router.post('/contact', async (req, res) => {
  try {
    const { bookId, ownerId, senderId, message, contactInfo } = req.body;
    
    const notification = new Notification({
      recipient: ownerId,
      sender: senderId,
      type: 'contact',
      book: bookId,
      message: message,
      contactInfo: contactInfo || {}
    });
    
    await notification.save();
    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }
});

// POST /books/buy-request - Send buy request
router.post('/buy-request', async (req, res) => {
  try {
    const { bookId, ownerId, senderId, offerPrice, message, contactInfo } = req.body;
    
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    const notification = new Notification({
      recipient: ownerId,
      sender: senderId,
      type: 'buy_request',
      book: bookId,
      message: `Buy offer (₹${offerPrice}): ${message}`,
      contactInfo: contactInfo || {}
    });
    
    await notification.save();
    res.json({ message: 'Buy request sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending buy request', error: err.message });
  }
});

// POST /books/exchange-request - Send exchange request
router.post('/exchange-request', async (req, res) => {
  try {
    const { bookId, ownerId, senderId, offeredBookIds, message, contactInfo } = req.body;
    
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    let offeredBookTitles = 'Available books';
    if (offeredBookIds && offeredBookIds.length > 0) {
      const offeredBooks = await Book.find({ _id: { $in: offeredBookIds } });
      offeredBookTitles = offeredBooks.map(b => b.title).join(', ');
    }
    
    const notification = new Notification({
      recipient: ownerId,
      sender: senderId,
      type: 'exchange_request',
      book: bookId,
      message: `Exchange offer (${offeredBookTitles}): ${message}`,
      contactInfo: contactInfo || {}
    });
    
    await notification.save();
    res.json({ message: 'Exchange request sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending exchange request', error: err.message });
  }
});

module.exports = router;
```

### Step 2: Test the backend
```bash
cd backend
npm start
```

Should show:
```
✅ Connected to MongoDB
🚀 Server is running on port 5000
```

### Step 3: Start frontend
```bash
cd frontend
npm run dev
```

## 🛠️ Alternative: Use the startup script
Double-click `start-servers.bat` in the main folder to start both servers automatically.

## ⚠️ If still having issues:
1. Check if MongoDB is running
2. Check .env file has correct MONGO_URI
3. Try `npm install` in backend folder
4. Check Node.js version (should be 16+)
