// Simplified App.jsx for testing
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestPage from './pages/TestPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

function SimpleApp() {
  return (
    <Router>
      <div>
        <nav style={{ 
          padding: '1rem 2rem', 
          backgroundColor: '#2c3e50', 
          color: 'white',
          marginBottom: '20px'
        }}>
          <h1 style={{ margin: 0 }}>📚 BookBarter (Test Mode)</h1>
          <div style={{ marginTop: '10px' }}>
            <a href="/" style={{ color: 'white', marginRight: '20px' }}>Home</a>
            <a href="/test" style={{ color: 'white', marginRight: '20px' }}>Test</a>
            <a href="/login" style={{ color: 'white', marginRight: '20px' }}>Login</a>
            <a href="/register" style={{ color: 'white' }}>Register</a>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<TestPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default SimpleApp;
