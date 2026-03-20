import React from "react";
import './Home.css';

function Home() {
  return (
    <div className="home">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>CareerPath</h2>
          </div>
          <div className="nav-menu">
            <a href="#home" className="nav-link">Home</a>
            <a href="#internships" className="nav-link">Internships</a>
            <a href="#programs" className="nav-link">Career Programs</a>
            <a href="#companies" className="nav-link">Companies</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>
          <div className="nav-buttons">
            <button className="btn-login">Login</button>
            <button className="btn-signup">Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Find Your Dream Internship & Build Your Career</h1>
            <p className="hero-subtitle">Connecting students with top companies and AI-powered career guidance.</p>
            <div className="hero-buttons">
              <button className="btn-primary">Get Started as Student</button>
              <button className="btn-secondary">Hire Interns</button>
            </div>
          </div>
          <div className="hero-illustration">
            <div className="illustration-placeholder">
              🎓💼📈
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-bar">
            <input type="text" placeholder="Search for internships..." className="search-input" />
            <button className="search-btn">Search</button>
          </div>
          <div className="search-filters">
            <select className="filter-select">
              <option>Location</option>
              <option>Remote</option>
              <option>On-site</option>
              <option>Hybrid</option>
            </select>
            <select className="filter-select">
              <option>Industry</option>
              <option>Technology</option>
              <option>Finance</option>
              <option>Marketing</option>
              <option>Healthcare</option>
            </select>
            <select className="filter-select">
              <option>All Types</option>
              <option>Remote</option>
              <option>On-site</option>
            </select>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👤</div>
              <h3>Student Profile & Resume Builder</h3>
              <p>Create professional profiles and build impressive resumes with our AI-powered tools.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Internship Posting & CV Review</h3>
              <p>Post internships and get AI-assisted CV reviews to find the best candidates.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Based CV Filtering</h3>
              <p>Smart AI algorithms filter and match candidates with the most suitable opportunities.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Leadership Programs & Skill Tests</h3>
              <p>Access exclusive leadership programs and test your skills with certified assessments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Profile</h3>
              <p>Sign up and build your professional profile with resume and skills.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Apply or Post Internship</h3>
              <p>Browse opportunities or post internships if you're a company.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Matched with AI</h3>
              <p>Our AI matches students with the best internship opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="statistics">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>10,000+</h3>
              <p>Students</p>
            </div>
            <div className="stat-item">
              <h3>500+</h3>
              <p>Companies</p>
            </div>
            <div className="stat-item">
              <h3>2,000+</h3>
              <p>Internships</p>
            </div>
            <div className="stat-item">
              <h3>85%</h3>
              <p>Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>CareerPath</h3>
              <p>Your gateway to professional opportunities and career growth.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#internships">Internships</a></li>
                <li><a href="#programs">Programs</a></li>
                <li><a href="#about">About</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: info@careerpath.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <div className="social-icons">
                <span className="social-icon">📘</span>
                <span className="social-icon">🐦</span>
                <span className="social-icon">💼</span>
                <span className="social-icon">📷</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 CareerPath. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;