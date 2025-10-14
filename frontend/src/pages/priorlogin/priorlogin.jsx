import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Calendar, TrendingUp, Shield, Target, Globe, BarChart3, Menu, X, Star } from 'lucide-react';
import clubHeroImage from '../../assets/image.png';
import './priorlogin.css';

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
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <button className="navbar-burger" aria-label="Open menu" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu />
          </button>
          <div className="navbar-brand">
            <h2 className="brand-title">CLUB MATRIX</h2>
          </div>
        </div>
        
        <div className="navbar-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#testimonials" className="nav-link">Testimonials</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
        
        <div className="navbar-actions">
          <button className="btn btn-ghost" onClick={handleSignIn}>Sign In</button>
          <button className="btn btn-hero" onClick={handleGetStarted}>Get Started</button>
        </div>

        {isMobileMenuOpen && (
          <div className="mobile-menu" role="dialog" aria-modal="true">
            <div className="mobile-menu-header">
              <h3 className="brand-title">CLUB MATRIX</h3>
              <button className="close-mobile" aria-label="Close menu" onClick={() => setIsMobileMenuOpen(false)}>
                <X />
              </button>
            </div>
            <div className="mobile-menu-links">
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
              <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)}>Testimonials</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
            </div>
            <div className="mobile-menu-actions">
              <button className="btn btn-outline" onClick={() => { setIsMobileMenuOpen(false); handleSignIn(); }}>Sign In</button>
              <button className="btn btn-hero" onClick={() => { setIsMobileMenuOpen(false); handleGetStarted(); }}>Get Started</button>
            </div>
          </div>
        )}
      </nav>

      <main className="prior-main">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">
                  Transform Your Club Management with 
                  <span className="hero-gradient-text"> CLUB MATRIX</span>
                </h1>
                <p className="hero-description">
                  The ultimate platform for managing clubs, tracking attendance, organizing events, 
                  and building stronger communities. Join thousands of successful clubs worldwide.
                </p>
                <div className="hero-actions">
                  <button className="btn btn-hero btn-lg" onClick={handleGetStarted}>
                    Start Building Your Club
                    <ArrowRight className="btn-icon" />
                  </button>
                  <button className="btn btn-outline btn-lg">
                    Watch Demo
                  </button>
                </div>
                <div className="hero-features">
                  <div className="hero-feature">
                    <div className="feature-icon">
                      <Users />
                    </div>
                    <span>10,000+ Active Clubs</span>
                  </div>
                  <div className="hero-feature">
                    <div className="feature-icon">
                      <TrendingUp />
                    </div>
                    <span>98% Satisfaction Rate</span>
                  </div>
                  <div className="hero-feature">
                    <div className="feature-icon">
                      <Shield />
                    </div>
                    <span>Enterprise Security</span>
                  </div>
                </div>
              </div>
              <div className="hero-image">
                <div className="hero-image-container">
                  <img src={clubHeroImage} alt="Illustration of a club dashboard and analytics" />
                  <div className="hero-image-overlay"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="stats">
          <div className="stats-container">
            <div className="stat-item">
              <Users className="stat-icon" />
              <div className="stat-text">
                <div className="stat-value">10k+</div>
                <div className="stat-label">Clubs Managed</div>
              </div>
            </div>
            <div className="stat-item">
              <Calendar className="stat-icon" />
              <div className="stat-text">
                <div className="stat-value">250k+</div>
                <div className="stat-label">Events Organized</div>
              </div>
            </div>
            <div className="stat-item">
              <Shield className="stat-icon" />
              <div className="stat-text">
                <div className="stat-value">99.9%</div>
                <div className="stat-label">Uptime & Security</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <div className="features-container">
            <div className="features-header">
              <h2 className="features-title">Everything You Need to Manage Your Club</h2>
              <p className="features-subtitle">
                Comprehensive tools designed to streamline every aspect of club management, 
                from member onboarding to event planning and community building.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon-large">
                  <Users />
                </div>
                <h3 className="feature-title">Smart Member Management</h3>
                <p className="feature-description">
                  Effortlessly manage member profiles, track contributions, and handle membership tiers 
                  with our intuitive member management system.
                </p>
                <ul className="feature-list">
                  <li>Member profiles & directories</li>
                  <li>Contribution tracking</li>
                  <li>Membership tiers & roles</li>
                  <li>Automated member onboarding</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon-large">
                  <Calendar />
                </div>
                <h3 className="feature-title">Event & Meeting Management</h3>
                <p className="feature-description">
                  Plan, schedule, and track all your club events and meetings with powerful 
                  organizational tools and automated reminders.
                </p>
                <ul className="feature-list">
                  <li>Event scheduling & planning</li>
                  <li>Meeting minutes tracking</li>
                  <li>Automated notifications</li>
                  <li>RSVP management</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon-large">
                  <BarChart3 />
                </div>
                <h3 className="feature-title">Attendance Tracking</h3>
                <p className="feature-description">
                  Monitor member engagement with comprehensive attendance tracking, 
                  detailed analytics, and automated reporting systems.
                </p>
                <ul className="feature-list">
                  <li>Real-time attendance monitoring</li>
                  <li>Engagement analytics</li>
                  <li>Automated reports</li>
                  <li>Member activity insights</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon-large">
                  <Target />
                </div>
                <h3 className="feature-title">Goal & Project Management</h3>
                <p className="feature-description">
                  Set club objectives, track progress, and manage collaborative projects 
                  with integrated planning and monitoring tools.
                </p>
                <ul className="feature-list">
                  <li>Goal setting & tracking</li>
                  <li>Project collaboration</li>
                  <li>Progress monitoring</li>
                  <li>Achievement milestones</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon-large">
                  <Globe />
                </div>
                <h3 className="feature-title">Public & Private Clubs</h3>
                <p className="feature-description">
                  Create public clubs for open communities or private clubs for exclusive groups, 
                  with flexible privacy and access controls.
                </p>
                <ul className="feature-list">
                  <li>Public club discovery</li>
                  <li>Private club security</li>
                  <li>Invitation management</li>
                  <li>Access control settings</li>
                </ul>
              </div>

              <div className="feature-card">
                <div className="feature-icon-large">
                  <Shield />
                </div>
                <h3 className="feature-title">Security & Analytics</h3>
                <p className="feature-description">
                  Enterprise-grade security with comprehensive analytics to understand 
                  your club's growth, engagement, and performance metrics.
                </p>
                <ul className="feature-list">
                  <li>End-to-end encryption</li>
                  <li>Advanced analytics</li>
                  <li>Performance insights</li>
                  <li>Security monitoring</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="testimonials">
          <div className="testimonials-container">
            <div className="testimonials-header">
              <h2 className="testimonials-title">Loved by Clubs Everywhere</h2>
              <p className="testimonials-subtitle">What coordinators and members are saying</p>
            </div>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-stars">
                  <Star /><Star /><Star /><Star /><Star />
                </div>
                <p>Club Matrix made organizing our events and tracking attendance effortless. Our engagement has never been higher.</p>
                <div className="testimonial-author">— Aisha, Tech Innovators</div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-stars">
                  <Star /><Star /><Star /><Star /><Star />
                </div>
                <p>The member management tools are fantastic. We love the analytics for understanding participation trends.</p>
                <div className="testimonial-author">— Rahul, Photography Fans</div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-stars">
                  <Star /><Star /><Star /><Star /><Star />
                </div>
                <p>Secure and reliable. The platform scales smoothly for our growing community.</p>
                <div className="testimonial-author">— Mei, Gaming Masters</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta">
          <div className="cta-container">
            <div className="cta-content">
              <div className="cta-overlay"></div>
              <div className="cta-text">
                <h2 className="cta-title">Ready to Transform Your Club?</h2>
                <p className="cta-description">
                  Join thousands of successful clubs already using CLUB MATRIX. 
                  Start building stronger communities today.
                </p>
                <div className="cta-actions">
                  <button className="btn btn-cta-primary" onClick={handleGetStarted}>
                    Create Your Club Now
                    <ArrowRight className="btn-icon" />
                  </button>
                  <button className="btn btn-cta-outline">
                    Watch Demo
                  </button>
                </div>
                <div className="cta-features">
                  ✓ Free 14-day trial • ✓ No credit card required • ✓ Setup in minutes
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-brand">
              <h3 className="brand-title">CLUB MATRIX</h3>
              <p>Manage clubs, build communities, and grow together.</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#">Pricing</a>
                <a href="#">Security</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#testimonials">Testimonials</a>
                <a href="#contact">Contact</a>
                <a href="#">Careers</a>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="#">Docs</a>
                <a href="#">Guides</a>
                <a href="#">Support</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Club Matrix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PriorLogin;