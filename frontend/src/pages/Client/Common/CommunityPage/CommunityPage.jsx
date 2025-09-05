import React, { useState, useEffect } from "react";
import "./CommunityPage.css";
import {
  Users, Calendar, Settings, TrendingUp, Plus,
  Search, Bell, Filter, Star, Clock, ChevronRight, Loader2
} from "lucide-react";
import ClientLayout from "../../Nav/ClientLayout";

const CommunityPage = () => {
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch public clubs from backend
  useEffect(() => {
    const fetchPublicClubs = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/clubs/public');
        
        if (!response.ok) {
          throw new Error('Failed to fetch clubs');
        }
        
        const data = await response.json();
        console.log('Fetched clubs data:', data); // Debug log
        setClubs(data);
        setFilteredClubs(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching clubs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicClubs();
  }, []);

  // Filter clubs based on search term and category
  useEffect(() => {
    let filtered = clubs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(club =>
        club.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(club => club.category === selectedCategory);
    }

    setFilteredClubs(filtered);
  }, [clubs, searchTerm, selectedCategory]);

  // Get unique categories for filter
  const categories = ["All", ...new Set(clubs.map(club => club.category).filter(Boolean))];

  // Color mapping for different categories
  const getCategoryColor = (category) => {
    const colorMap = {
      'Technology': 'blue',
      'Design': 'purple',
      'Business': 'green',
      'Arts': 'orange',
      'Music': 'indigo',
      'Sports': 'teal',
      'Education': 'pink',
      'Health': 'red',
      'Environment': 'emerald',
      'Social': 'amber'
    };
    return colorMap[category] || 'blue';
  };

  // Handle join club
  const handleJoinClub = (clubId) => {
    // TODO: Implement join club functionality
    console.log('Joining club:', clubId);
    alert('Join functionality will be implemented soon!');
  };

  // Handle view details
  const handleViewDetails = (clubId) => {
    // TODO: Implement view details functionality
    console.log('Viewing details for club:', clubId);
    alert('View details functionality will be implemented soon!');
  };

  if (loading) {
    return (
      <ClientLayout userRole="general">
        <div className="community-page">
          <div className="loading-container">
            <Loader2 className="loading-spinner" size={48} />
            <p>Loading public clubs...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout userRole="general">
        <div className="community-page">
          <div className="error-container">
            <h2>Error Loading Clubs</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout userRole="general">
      <div className="community-page">
        {/* Main Content */}
        <div className="main-content">
          <header className="main-header">
            <div className="header-top">
              <div className="header-title">
                <h2>Discover Public Clubs</h2>
                <p>Find and join amazing clubs in your community</p>
              </div>
              <div className="header-actions">
                <div className="search-bar">
                  <Search className="search-icon" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search clubs..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="filter-dropdown">
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="category-filter"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="notification-btn">
                  <Bell size={20} />
                </button>
              </div>
            </div>
          </header>

          <main className="clubs-grid">
            {filteredClubs.length === 0 ? (
              <div className="no-clubs">
                <Users size={48} />
                <h3>No clubs found</h3>
                <p>
                  {searchTerm || selectedCategory !== "All" 
                    ? "Try adjusting your search or filter criteria"
                    : "No public clubs are available at the moment"
                  }
                </p>
              </div>
            ) : (
              <>
                {/* Club Cards Section */}
                <div className="clubs-section">
                  {filteredClubs.map((club, index) => (
                    <div key={club.id || index} className={`club-card ${getCategoryColor(club.category)}`}>
                      <div className="club-header">
                        <div className="club-icon">
                          <Users className="users-icon" size={24} />
                        </div>
                        <div className="club-rating">
                          <Star className="star-icon" size={16} />
                          <span>{club.rating || "4.5"}</span>
                        </div>
                      </div>

                      <h3>{club.club_name || `Club ${index + 1}`}</h3>
                      <div className="club-info">
                        <span>{club.member_count || club.members || "0"} members</span>
                        <span className="category">{club.category}</span>
                      </div>

                      <p className="club-description">
                        {club.description || "Join our vibrant community of passionate individuals and unlock new opportunities for growth and collaboration."}
                      </p>

                      <div className="club-actions">
                        <button 
                          className="view-details-btn"
                          onClick={() => handleViewDetails(club.id)}
                        >
                          View Details
                        </button>
                        <button 
                          className="join-btn"
                          onClick={() => handleJoinClub(club.id)}
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Overview Section */}
                <div className="overview-card">
                  <div className="overview-header">
                    <h3>Overview</h3>
                  </div>

                  <div className="overview-content">
                    {/* Quick Stats */}
                    <div className="quick-stats">
                      <h4>Quick Stats</h4>
                      <div className="stats-grid">
                        <div className="stat-card blue">
                          <p className="stat-number">{clubs.length}</p>
                          <p>Public Clubs</p>
                        </div>
                        <div className="stat-card purple">
                          <p className="stat-number">{categories.length - 1}</p>
                          <p>Categories</p>
                        </div>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="categories-section">
                      <h4>Categories</h4>
                      <div className="categories-list">
                        {categories.slice(1).map((category, index) => (
                          <div 
                            key={category} 
                            className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category)}
                          >
                            <div className={`category-dot ${getCategoryColor(category)}`}></div>
                            <span>{category}</span>
                            <span className="category-count">
                              {clubs.filter(club => club.category === category).length}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="recent-activity">
                      <h4>Recent Activity</h4>
                      <div className="activity-list">
                        <div className="activity-item">
                          <div className="activity-dot"></div>
                          <div className="activity-info">
                            <p>New clubs added</p>
                            <p className="activity-time">
                              <Clock size={12} />
                              Recently
                            </p>
                          </div>
                        </div>
                        <div className="activity-item">
                          <div className="activity-dot"></div>
                          <div className="activity-info">
                            <p>Community growing</p>
                            <p className="activity-time">
                              <Clock size={12} />
                              This week
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </ClientLayout>
  );
};

export default CommunityPage;