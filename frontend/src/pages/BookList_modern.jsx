import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { getUserId, isAuthenticated } from '../utils/auth';

const BookList = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [contactMessage, setContactMessage] = useState('');
  const [contactType, setContactType] = useState('contact');
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '' });
  const [offerPrice, setOfferPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [loading, setLoading] = useState(true);
  const currentUserId = getUserId();

  const openContactModal = (book, type = 'contact') => {
    if (!isAuthenticated()) {
      alert('Please login to contact book owners');
      navigate('/login');
      return;
    }
    
    if (book.owner?._id === currentUserId) {
      alert('You cannot contact yourself about your own book!');
      return;
    }
    
    setSelectedBook(book);
    setContactType(type);
    
    switch (type) {
      case 'buy_request':
        setContactMessage(`Hi! I'm interested in buying your book "${book.title}". Is it still available?`);
        setOfferPrice(book.price || '');
        break;
      case 'exchange_request':
        setContactMessage(`Hi! I'd like to exchange one of my books for "${book.title}". Are you interested in book exchanges?`);
        break;
      default:
        setContactMessage(`Hi! I'm interested in your book "${book.title}". Could you please provide more details?`);
    }
    
    setShowContactModal(true);
  };

  const sendContactMessage = async () => {
    if (!contactMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    try {
      await axios.post('/notifications', {
        bookId: selectedBook._id,
        bookTitle: selectedBook.title,
        bookOwner: selectedBook.owner._id,
        requesterName: getUserId(),
        message: contactMessage,
        contactInfo,
        contactType,
        offerPrice: contactType === 'buy_request' ? offerPrice : undefined
      });

      alert('Message sent successfully!');
      setShowContactModal(false);
      resetModal();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  const resetModal = () => {
    setContactMessage('');
    setSelectedBook(null);
    setContactType('contact');
    setContactInfo({ email: '', phone: '' });
    setOfferPrice('');
  };

  const filteredAndSortedBooks = books
    .filter(book => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      switch (filterBy) {
        case 'title':
          return book.title.toLowerCase().includes(searchLower);
        case 'author':
          return book.author.toLowerCase().includes(searchLower);
        case 'genre':
          return book.genre?.toLowerCase().includes(searchLower);
        default:
          return book.title.toLowerCase().includes(searchLower) || 
                 book.author.toLowerCase().includes(searchLower) ||
                 book.description?.toLowerCase().includes(searchLower) ||
                 book.genre?.toLowerCase().includes(searchLower);
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        default: // newest
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/books');
        setBooks(res.data);
      } catch (err) {
        console.error('❌ Error fetching books:', err);
        alert('Failed to load books. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="books-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading amazing books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="books-page">
      <div className="container">
        {/* Page Header */}
        <div className="books-header">
          <div className="books-title-section">
            <h1 className="books-title">
              <span className="books-icon">📚</span>
              Discover Amazing Books
            </h1>
            <p className="books-subtitle">
              Browse our collection of {books.length} books from fellow readers
            </p>
          </div>
          
          {isAuthenticated() && (
            <button 
              onClick={() => navigate('/upload')} 
              className="btn btn-primary btn-lg"
            >
              <span className="btn-icon">📤</span>
              Share Your Book
            </button>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="books-controls">
          <div className="search-section">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search books, authors, genres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-controls">
              <select 
                value={filterBy} 
                onChange={(e) => setFilterBy(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Fields</option>
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="genre">Genre</option>
              </select>
              
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
                <option value="author">Author A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="view-controls">
            <button 
              onClick={() => setViewMode('grid')}
              className={`view-btn ${viewMode === 'grid' ? 'view-btn-active' : ''}`}
            >
              ⊞
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`view-btn ${viewMode === 'list' ? 'view-btn-active' : ''}`}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <p className="results-text">
            Showing {filteredAndSortedBooks.length} of {books.length} books
            {searchTerm && (
              <span className="search-term"> for "{searchTerm}"</span>
            )}
          </p>
        </div>

        {/* Books Grid/List */}
        {filteredAndSortedBooks.length === 0 ? (
          <div className="no-books">
            <div className="no-books-icon">📖</div>
            <h3 className="no-books-title">No books found</h3>
            <p className="no-books-text">
              {searchTerm 
                ? `No books match your search for "${searchTerm}"`
                : "No books available at the moment"
              }
            </p>
            {isAuthenticated() && (
              <button 
                onClick={() => navigate('/upload')} 
                className="btn btn-primary"
              >
                Be the first to share a book
              </button>
            )}
          </div>
        ) : (
          <div className={`books-container ${viewMode === 'list' ? 'books-list' : 'books-grid'}`}>
            {filteredAndSortedBooks.map((book) => (
              <div key={book._id} className={`book-card ${viewMode === 'list' ? 'book-card-list' : ''}`}>
                <div className="book-image">
                  <div className="book-cover">
                    <span className="book-emoji">📖</span>
                    <div className="book-overlay">
                      <span className="book-type">
                        {book.price ? `₹${book.price}` : 'Exchange'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="book-content">
                  <div className="book-header">
                    <h3 className="book-title">{book.title}</h3>
                    <div className="book-meta">
                      <span className="book-author">by {book.author}</span>
                      {book.genre && (
                        <span className="book-genre">{book.genre}</span>
                      )}
                    </div>
                  </div>
                  
                  {book.description && (
                    <p className="book-description">
                      {book.description.length > 120 
                        ? `${book.description.substring(0, 120)}...` 
                        : book.description
                      }
                    </p>
                  )}
                  
                  <div className="book-details">
                    <div className="book-condition">
                      <span className="detail-label">Condition:</span>
                      <span className="detail-value">{book.condition || 'Good'}</span>
                    </div>
                    {book.price && (
                      <div className="book-price">
                        <span className="price-label">Price:</span>
                        <span className="price-value">₹{book.price}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="book-owner">
                    <span className="owner-label">Shared by:</span>
                    <span className="owner-name">
                      {book.owner?.name || book.owner?._id || 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="book-actions">
                    {book.owner?._id !== currentUserId ? (
                      <>
                        <button 
                          onClick={() => openContactModal(book, 'contact')}
                          className="btn btn-secondary btn-sm"
                        >
                          <span className="btn-icon">💬</span>
                          Contact
                        </button>
                        {book.price && (
                          <button 
                            onClick={() => openContactModal(book, 'buy_request')}
                            className="btn btn-primary btn-sm"
                          >
                            <span className="btn-icon">💰</span>
                            Buy Now
                          </button>
                        )}
                        <button 
                          onClick={() => openContactModal(book, 'exchange_request')}
                          className="btn btn-accent btn-sm"
                        >
                          <span className="btn-icon">🔄</span>
                          Exchange
                        </button>
                      </>
                    ) : (
                      <span className="own-book-label">Your Book</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Modal */}
        {showContactModal && (
          <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">
                  {contactType === 'buy_request' ? '💰 Purchase Request' :
                   contactType === 'exchange_request' ? '🔄 Exchange Request' :
                   '💬 Contact Owner'}
                </h3>
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="book-info">
                  <h4 className="book-info-title">"{selectedBook?.title}"</h4>
                  <p className="book-info-author">by {selectedBook?.author}</p>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Your Message</label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Write your message here..."
                    className="form-textarea"
                    rows="4"
                  />
                </div>
                
                {contactType === 'buy_request' && (
                  <div className="form-group">
                    <label className="form-label">Your Offer (₹)</label>
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder="Enter your offer price"
                      className="form-input"
                    />
                  </div>
                )}
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Your Email</label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      placeholder="your.email@example.com"
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                      placeholder="+91 12345 67890"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={sendContactMessage}
                  className="btn btn-primary"
                >
                  <span className="btn-icon">📤</span>
                  Send Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;
