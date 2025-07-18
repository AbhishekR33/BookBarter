import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const Home = () => {
  const authenticated = isAuthenticated();

  const features = [
    {
      icon: '📚',
      title: 'Browse Books',
      description: 'Discover thousands of books from fellow readers in your community.',
      link: '/books',
      color: 'primary'
    },
    {
      icon: '🔄',
      title: 'Exchange Books',
      description: 'Trade your books with others and expand your library without spending money.',
      link: '/books',
      color: 'secondary'
    },
    {
      icon: '📤',
      title: 'Upload Books',
      description: 'Share your books with the community and help others discover great reads.',
      link: authenticated ? '/upload' : '/login',
      color: 'accent'
    },
    {
      icon: '🔔',
      title: 'Get Notified',
      description: 'Receive instant notifications when someone is interested in your books.',
      link: authenticated ? '/notifications' : '/login',
      color: 'info'
    }
  ];

  const stats = [
    { number: '250+', label: 'Books Available' },
    { number: '150+', label: 'Happy Readers' },
    { number: '300+', label: 'Books Exchanged' },
    { number: '15+', label: 'Cities Covered' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Share Books, <br />
                <span className="gradient-text">Build Community</span>
              </h1>
              <p className="hero-subtitle">
                Join thousands of book lovers who are sharing knowledge, 
                exchanging stories, and building a community around their passion for reading.
              </p>
              <div className="hero-actions">
                {authenticated ? (
                  <>
                    <Link to="/books" className="btn btn-primary btn-lg">
                      Browse Books
                    </Link>
                    <Link to="/upload" className="btn btn-secondary btn-lg">
                      Upload Book
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg">
                      Get Started
                    </Link>
                    <Link to="/books" className="btn btn-secondary btn-lg">
                      Browse Books
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-books">
                <div className="floating-book book-1">📖</div>
                <div className="floating-book book-2">📚</div>
                <div className="floating-book book-3">📓</div>
                <div className="floating-book book-4">📔</div>
                <div className="floating-book book-5">📕</div>
                <div className="floating-book book-6">📗</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item animate-fade-in">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How BookBarter Works</h2>
            <p className="section-subtitle">
              Simple steps to start your book sharing journey
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className={`feature-card feature-card-${feature.color}`}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Journey?</h2>
            <p className="cta-subtitle">
              Join our community of book lovers and start sharing today
            </p>
            {!authenticated ? (
              <div className="cta-actions">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Create Account
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="cta-actions">
                <Link to="/upload" className="btn btn-primary btn-lg">
                  Upload Your First Book
                </Link>
                <Link to="/books" className="btn btn-secondary btn-lg">
                  Browse Books
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
