import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Users, Calendar, TrendingUp, Shield, 
  Target, Globe, BarChart3, Menu, X, Star, Zap,
  CheckCircle2, Sparkles
} from 'lucide-react';
import './PriorLogin.css';

const PriorLogin = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleSignIn = () => {
    navigate('/login');
  };
  
  const handleGetStarted = () => {
    navigate('/signup');
  };
  
  useEffect(() => {
    try {
      localStorage.removeItem('role');
      localStorage.removeItem('email');
    } catch (e) {
      // no-op
    }
  }, []);

  return (
    <div className="prior-login">
      {/* Animated Background */}
      <div className="background-mesh"></div>
      <div className="background-gradient"></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <button 
              className="navbar-burger" 
              aria-label="Open menu" 
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="navbar-brand">
              <Sparkles size={24} className="brand-icon" />
              <h1 className="brand-title">CLUB MATRIX</h1>
            </div>
          </div>
          
          <div className="navbar-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#testimonials" className="nav-link">Testimonials</a>
            <a href="#pricing" className="nav-link">Pricing</a>
          </div>
          
          <div className="navbar-actions">
            <button className="btn btn-ghost" onClick={handleSignIn}>
              Sign In
            </button>
            <button className="btn btn-primary" onClick={handleGetStarted}>
              Get Started
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="mobile-menu-content">
              <div className="mobile-menu-header">
                <div className="navbar-brand">
                  <Sparkles size={24} className="brand-icon" />
                  <h3 className="brand-title">CLUB MATRIX</h3>
                </div>
                <button 
                  className="close-mobile" 
                  aria-label="Close menu" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>
              <div className="mobile-menu-links">
                <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
                <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)}>Testimonials</a>
                <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
              </div>
              <div className="mobile-menu-actions">
                <button 
                  className="btn btn-ghost btn-block" 
                  onClick={() => { setIsMobileMenuOpen(false); handleSignIn(); }}
                >
                  Sign In
                </button>
                <button 
                  className="btn btn-primary btn-block" 
                  onClick={() => { setIsMobileMenuOpen(false); handleGetStarted(); }}
                >
                  Get Started
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="prior-main">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-container">
            <div className="hero-badge">
              <Zap size={14} />
              <span>Trusted by 10,000+ clubs worldwide</span>
            </div>
            
            <h1 className="hero-title">
              Manage Your Club with
              <span className="hero-gradient-text"> Intelligence</span>
            </h1>
            
            <p className="hero-description">
              The ultimate platform for modern club management. Track attendance, 
              organize events, and build thriving communities with powerful analytics 
              and automation.
            </p>
            
            <div className="hero-actions">
              <button className="btn btn-hero btn-lg" onClick={handleGetStarted}>
                Start Free Trial
                <ArrowRight size={20} />
              </button>
              <button className="btn btn-outline btn-lg">
                Watch Demo
              </button>
            </div>
            
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">10k+</div>
                <div className="hero-stat-label">Active Clubs</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">250k+</div>
                <div className="hero-stat-label">Events Hosted</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">99.9%</div>
                <div className="hero-stat-label">Uptime</div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="hero-cards">
              <div className="floating-card card-1">
                <Users size={20} />
                <div>
                  <div className="card-title">Member Growth</div>
                  <div className="card-value">+127%</div>
                </div>
              </div>
              <div className="floating-card card-2">
                <TrendingUp size={20} />
                <div>
                  <div className="card-title">Engagement</div>
                  <div className="card-value">98.5%</div>
                </div>
              </div>
              <div className="floating-card card-3">
                <Calendar size={20} />
                <div>
                  <div className="card-title">Events This Month</div>
                  <div className="card-value">47</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <div className="features-container">
            <div className="section-header">
              <div className="section-badge">
                <Sparkles size={14} />
                <span>Features</span>
              </div>
              <h2 className="section-title">Everything you need to succeed</h2>
              <p className="section-description">
                Powerful tools designed to streamline club management and boost engagement
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <Users />
                </div>
                <h3 className="feature-title">Member Management</h3>
                <p className="feature-description">
                  Track member profiles, contributions, and engagement with intuitive dashboards and automated workflows.
                </p>
                <ul className="feature-list">
                  <li><CheckCircle2 size={16} /> Profile directories</li>
                  <li><CheckCircle2 size={16} /> Role management</li>
                  <li><CheckCircle2 size={16} /> Activity tracking</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Calendar />
                </div>
                <h3 className="feature-title">Event Planning</h3>
                <p className="feature-description">
                  Schedule events, send automated reminders, and manage RSVPs all in one place.
                </p>
                <ul className="feature-list">
                  <li><CheckCircle2 size={16} /> Smart scheduling</li>
                  <li><CheckCircle2 size={16} /> Auto notifications</li>
                  <li><CheckCircle2 size={16} /> RSVP tracking</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <BarChart3 />
                </div>
                <h3 className="feature-title">Analytics & Insights</h3>
                <p className="feature-description">
                  Understand your club's performance with detailed analytics and actionable insights.
                </p>
                <ul className="feature-list">
                  <li><CheckCircle2 size={16} /> Real-time metrics</li>
                  <li><CheckCircle2 size={16} /> Engagement reports</li>
                  <li><CheckCircle2 size={16} /> Custom dashboards</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Target />
                </div>
                <h3 className="feature-title">Goal Tracking</h3>
                <p className="feature-description">
                  Set objectives, track progress, and celebrate achievements with your team.
                </p>
                <ul className="feature-list">
                  <li><CheckCircle2 size={16} /> Milestone tracking</li>
                  <li><CheckCircle2 size={16} /> Progress reports</li>
                  <li><CheckCircle2 size={16} /> Team collaboration</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Globe />
                </div>
                <h3 className="feature-title">Public & Private</h3>
                <p className="feature-description">
                  Create public clubs for discovery or private clubs with custom access controls.
                </p>
                <ul className="feature-list">
                  <li><CheckCircle2 size={16} /> Visibility settings</li>
                  <li><CheckCircle2 size={16} /> Invite management</li>
                  <li><CheckCircle2 size={16} /> Access controls</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Shield />
                </div>
                <h3 className="feature-title">Enterprise Security</h3>
                <p className="feature-description">
                  Bank-level encryption and security to keep your club data safe and protected.
                </p>
                <ul className="feature-list">
                  <li><CheckCircle2 size={16} /> End-to-end encryption</li>
                  <li><CheckCircle2 size={16} /> Regular backups</li>
                  <li><CheckCircle2 size={16} /> 99.9% uptime</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="testimonials">
          <div className="testimonials-container">
            <div className="section-header">
              <div className="section-badge">
                <Star size={14} />
                <span>Testimonials</span>
              </div>
              <h2 className="section-title">Loved by club leaders everywhere</h2>
              <p className="section-description">
                See what coordinators are saying about Club Matrix
              </p>
            </div>
            
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="testimonial-text">
                  "Club Matrix transformed how we manage our tech community. The analytics 
                  alone have helped us boost engagement by over 150%."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">A</div>
                  <div>
                    <div className="author-name">Aisha Kumar</div>
                    <div className="author-role">Founder, Tech Innovators</div>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="testimonial-text">
                  "The event management tools are incredible. We've organized over 100 
                  events this year with zero hassle."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">R</div>
                  <div>
                    <div className="author-name">Rahul Mehta</div>
                    <div className="author-role">President, Photography Club</div>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="testimonial-text">
                  "Security and reliability are top-notch. We trust Club Matrix with all 
                  our community data."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">M</div>
                  <div>
                    <div className="author-name">Mei Chen</div>
                    <div className="author-role">Lead, Gaming Masters</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="pricing" className="cta">
          <div className="cta-container">
            <div className="cta-content">
              <h2 className="cta-title">Ready to elevate your club?</h2>
              <p className="cta-description">
                Join thousands of successful clubs already using Club Matrix to build 
                stronger communities and drive engagement.
              </p>
              <div className="cta-actions">
                <button className="btn btn-cta-primary" onClick={handleGetStarted}>
                  Start Free Trial
                  <ArrowRight size={20} />
                </button>
                <button className="btn btn-cta-secondary">
                  Schedule Demo
                </button>
              </div>
              <div className="cta-features">
                <span><CheckCircle2 size={16} /> 14-day free trial</span>
                <span><CheckCircle2 size={16} /> No credit card required</span>
                <span><CheckCircle2 size={16} /> Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="navbar-brand">
                <Sparkles size={24} className="brand-icon" />
                <h3 className="brand-title">CLUB MATRIX</h3>
              </div>
              <p className="footer-tagline">
                Empowering communities through intelligent club management.
              </p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#testimonials">Testimonials</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Careers</a>
                <a href="#">Contact</a>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="#">Documentation</a>
                <a href="#">Guides</a>
                <a href="#">Support</a>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Security</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Club Matrix. All rights reserved.</p>
            <div className="footer-social">
              <a href="#" aria-label="Twitter">Twitter</a>
              <a href="#" aria-label="LinkedIn">LinkedIn</a>
              <a href="#" aria-label="GitHub">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PriorLogin;