import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      alert('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('🔐 Attempting login for:', email);
      
      const res = await axios.post('/users/login', {
        email: email.trim(),
        password,
      });
      
      console.log('✅ Login response:', res.data);
      alert(res.data.message);
      
      // Store user info in localStorage
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Store additional user info if available
      if (res.data.user) {
        localStorage.setItem('userName', res.data.user.name || 'Abhishek Ravindra');
        localStorage.setItem('userEmail', res.data.user.email || email);
      } else {
        localStorage.setItem('userName', 'Abhishek Ravindra');
        localStorage.setItem('userEmail', email);
      }
      
      // Trigger storage event to update App state
      window.dispatchEvent(new Event('storage'));
      
      // Navigate to My Books page after successful login
      navigate('/my-books');
    } catch (error) {
      console.error('❌ Login error details:', error);
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 404) {
          alert('User not found. Please check your email or register first.');
        } else if (status === 401) {
          alert('Invalid password. Please try again.');
        } else if (status === 500) {
          alert('Server error. Please try again later.');
        } else {
          alert(`Login failed: ${data.error || 'Unknown error'}`);
        }
      } else if (error.request) {
        alert('Cannot connect to server. Please check if the backend is running.');
      } else {
        alert('Login failed: ' + error.message);
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
              <span className="form-title-icon">🔐</span>
              Welcome Back
            </h2>
            <p className="form-subtitle">
              Sign in to your BookBarter account
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="enhanced-form">
            <div className="enhanced-form-group">
              <label className="enhanced-form-label">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
                    Signing In...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🚀</span>
                    Sign In
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="form-link">
            Don't have an account? <Link to="/register">Create one here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
