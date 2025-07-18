import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      const { confirmPassword, ...submitData } = formData;
      const res = await axios.post('/users/register', submitData);
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      console.log(err.response?.data || err.message);
      if (err.response?.data?.error) {
        alert(err.response.data.error);
      } else {
        alert('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-form">
      <div className="form-container">
        <div className="form-card">
          <div className="form-header">
            <h2 className="form-title">
              <span className="form-title-icon">📝</span>
              Join BookBarter
            </h2>
            <p className="form-subtitle">
              Create your account and start sharing books
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="enhanced-form">
            <div className="enhanced-form-group">
              <label className="enhanced-form-label">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="enhanced-form-input"
                required
                disabled={loading}
              />
            </div>

            <div className="enhanced-form-group">
              <label className="enhanced-form-label">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="enhanced-form-input"
                required
                disabled={loading}
              />
            </div>

            <div className="enhanced-form-group">
              <label className="enhanced-form-label">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password (min 6 characters)"
                className="enhanced-form-input"
                required
                minLength="6"
                disabled={loading}
              />
            </div>

            <div className="enhanced-form-group">
              <label className="enhanced-form-label">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="enhanced-form-input"
                required
                disabled={loading}
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className={`btn btn-primary btn-lg ${loading ? 'btn-loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner-small"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🎉</span>
                    Create Account
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="form-link">
            Already have an account? <Link to="/login">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
