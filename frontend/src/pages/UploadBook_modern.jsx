import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { requireAuth } from '../utils/auth';

const UploadBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    condition: 'good',
    genre: '',
    price: '',
    isForSale: false,
    contactInfo: {
      email: '',
      phone: ''
    }
  });
  const [loading, setLoading] = useState(false);

  // Check authentication
  React.useEffect(() => {
    requireAuth(navigate);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.author.trim()) {
      alert('Please fill in at least the title and author');
      return;
    }
    
    if (formData.isForSale && !formData.price) {
      alert('Please enter a price if the book is for sale');
      return;
    }
    
    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        price: formData.isForSale ? parseFloat(formData.price) : null
      };
      
      const res = await axios.post('/books', submitData);
      alert('Book uploaded successfully!');
      navigate('/my-books');
    } catch (err) {
      console.error('Upload error:', err);
      if (err.response?.data?.error) {
        alert(err.response.data.error);
      } else {
        alert('Failed to upload book. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy',
    'Biography', 'History', 'Self-Help', 'Educational', 'Poetry', 'Drama',
    'Adventure', 'Horror', 'Comedy', 'Other'
  ];

  const conditions = [
    { value: 'excellent', label: 'Excellent - Like new' },
    { value: 'good', label: 'Good - Minor wear' },
    { value: 'fair', label: 'Fair - Noticeable wear' },
    { value: 'poor', label: 'Poor - Heavy wear' }
  ];

  return (
    <div className="page-form">
      <div className="form-container" style={{ maxWidth: '700px' }}>
        <div className="form-card">
          <div className="form-header">
            <h2 className="form-title">
              <span className="form-title-icon">📤</span>
              Share Your Book
            </h2>
            <p className="form-subtitle">
              Add your book to the community and help others discover great reads
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="enhanced-form">
            {/* Basic Information */}
            <div className="form-section">
              <h3 className="form-section-title">Book Information</h3>
              
              <div className="form-row">
                <div className="enhanced-form-group">
                  <label className="enhanced-form-label">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter the book title"
                    className="enhanced-form-input"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="enhanced-form-group">
                  <label className="enhanced-form-label">
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Enter the author's name"
                    className="enhanced-form-input"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="enhanced-form-group">
                  <label className="enhanced-form-label">
                    Genre
                  </label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="enhanced-form-select"
                    disabled={loading}
                  >
                    <option value="">Select a genre</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                <div className="enhanced-form-group">
                  <label className="enhanced-form-label">
                    Condition
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="enhanced-form-select"
                    disabled={loading}
                  >
                    {conditions.map(condition => (
                      <option key={condition.value} value={condition.value}>
                        {condition.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="enhanced-form-group">
                <label className="enhanced-form-label">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about the book - plot, your thoughts, condition details..."
                  className="enhanced-form-textarea"
                  rows="4"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="form-section">
              <h3 className="form-section-title">Pricing & Availability</h3>
              
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isForSale"
                    checked={formData.isForSale}
                    onChange={handleChange}
                    className="checkbox-input"
                    disabled={loading}
                  />
                  <span className="checkbox-text">This book is for sale</span>
                </label>
              </div>

              {formData.isForSale && (
                <div className="enhanced-form-group">
                  <label className="enhanced-form-label">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter price in rupees"
                    className="enhanced-form-input"
                    min="0"
                    step="0.01"
                    disabled={loading}
                  />
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="form-section">
              <h3 className="form-section-title">Contact Information</h3>
              
              <div className="form-row">
                <div className="enhanced-form-group">
                  <label className="enhanced-form-label">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="contactInfo.email"
                    value={formData.contactInfo.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="enhanced-form-input"
                    disabled={loading}
                  />
                </div>

                <div className="enhanced-form-group">
                  <label className="enhanced-form-label">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="contactInfo.phone"
                    value={formData.contactInfo.phone}
                    onChange={handleChange}
                    placeholder="+91 12345 67890"
                    className="enhanced-form-input"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button"
                onClick={() => navigate('/my-books')}
                className="btn btn-secondary btn-lg"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={`btn btn-primary btn-lg ${loading ? 'btn-loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner-small"></span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🚀</span>
                    Share Book
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadBook;
