import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sidebar watcher
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebarSelectors = ['.sidebar', '.side-nav', '.navigation', '.nav-sidebar'];
      let sidebar = null;

      for (const selector of sidebarSelectors) {
        sidebar = document.querySelector(selector);
        if (sidebar) break;
      }

      if (sidebar) {
        const isCollapsed =
          sidebar.classList.contains('collapsed') ||
          sidebar.classList.contains('closed') ||
          sidebar.classList.contains('hidden') ||
          window.getComputedStyle(sidebar).width === '0px';
        setSidebarCollapsed(isCollapsed);
      }
    };

    checkSidebarState();
    const observer = new MutationObserver(checkSidebarState);
    const sidebar = document.querySelector('.sidebar, .side-nav, .navigation, .nav-sidebar');
    if (sidebar) {
      observer.observe(sidebar, { attributes: true, attributeFilter: ['class', 'style'] });
    }
    window.addEventListener('resize', checkSidebarState);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkSidebarState);
    };
  }, []);

  // ✅ Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const mail = localStorage.getItem("email");
        if (!mail) {
          console.error("No mail found in localStorage");
          setLoading(false);
          return;
        }

        const res = await axios.get(`http://localhost:5000/profile/${mail}`);
        const data = res.data;

        setProfileData({
          fullName: data.full_name,
          phoneNumber: data.phone_number,
          dateOfBirth: data.date_of_birth,
          gender: data.gender,
          address: data.address,
          email: data.mail,
          profileImage:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", // placeholder
          clubs: (data.clubs || []).map((club, index) => ({
            id: index + 1,
            name: club.name,
            role: club.role,
            description: club.description,
            category: club.category,
            logo: club.logo || "https://via.placeholder.com/100"
          })),
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "-";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return <div className="profile-container">Loading profile...</div>;
  }

  if (!profileData) {
    return <div className="profile-container">No profile data found.</div>;
  }

  return (
    <div className={`profile-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="profile-header">
        <div className="profile-image-container">
          <img 
            src={profileData.profileImage} 
            alt="Profile" 
            className="profile-image"
          />
          <div className="profile-status">
            <span className="status-dot"></span>
            <span>Active</span>
          </div>
        </div>
        <div className="profile-basic-info">
          <h1 className="profile-name">{profileData.fullName}</h1>
          <p className="profile-email">{profileData.email}</p>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{profileData.clubs.length}</span>
              <span className="stat-label">Clubs</span>
            </div>
            <div className="stat">
              <span className="stat-number">{calculateAge(profileData.dateOfBirth)}</span>
              <span className="stat-label">Years Old</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2 className="section-title">Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name</label>
              <span>{profileData.fullName}</span>
            </div>
            <div className="info-item">
              <label>Phone Number</label>
              <span>{profileData.phoneNumber}</span>
            </div>
            <div className="info-item">
              <label>Date of Birth</label>
              <span>{formatDate(profileData.dateOfBirth)}</span>
            </div>
            <div className="info-item">
              <label>Gender</label>
              <span>{profileData.gender}</span>
            </div>
            <div className="info-item full-width">
              <label>Address</label>
              <span>{profileData.address}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2 className="section-title">My Clubs</h2>
          <div className="clubs-grid">
            {profileData.clubs.map((club) => (
              <div key={club.id} className="club-card">
                <div className="club-header">
                  <img 
                    src={club.logo} 
                    alt={club.name} 
                    className="club-logo"
                  />
                  <div className="club-info">
                    <h3 className="club-name">{club.name}</h3>
                    <span className="club-category">{club.category}</span>
                  </div>
                </div>
                <p className="club-description">{club.description}</p>
                <div className="club-details">
                  <div className="club-role">
                    <span className="role-badge">{club.role}</span>
                  </div>
                  <div className="club-stats">
                    <span className="established-date">Club</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;