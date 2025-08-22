import React from 'react';
import { ArrowRight, Users, Calendar, TrendingUp, Shield, Target, Globe, BarChart3 } from 'lucide-react';
import clubHeroImage from '../../assets/image.png';
import './priorlogin.css';

const PriorLogin = () => {
  return (
    <div className="prior-login">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2 className="brand-title">CLUB MATRIX</h2>
        </div>
        
        <div className="navbar-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
        
        <div className="navbar-actions">
          <button className="btn btn-ghost">Sign In</button>
          <button className="btn btn-hero">Get Started</button>
        </div>
      </nav>

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
                <button className="btn btn-hero btn-lg">
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
                <img src={clubHeroImage} alt="Club management dashboard interface" />
                <div className="hero-image-overlay"></div>
              </div>
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
                <li>Meeting moments tracking</li>
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
                <button className="btn btn-cta-primary">
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
    </div>
  );
};

export default PriorLogin ;