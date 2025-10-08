import React, { useState, useEffect } from "react";
import "./CommunityPage.css";
import {
  Users, Calendar, Settings, TrendingUp, Plus,
  Search, Bell, Filter, Star, Clock, ChevronRight, Loader2, X
} from "lucide-react";
import ClientLayout from "../../Nav/ClientLayout";


const CommunityPage = () => {
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedClub, setSelectedClub] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinReason, setJoinReason] = useState("");
  const [joiningClubId, setJoiningClubId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch public clubs from backend
  useEffect(() => {
    const fetchPublicClubs = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/clubs_fetch');
        
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
        club.club_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    setJoiningClubId(clubId);
    setJoinReason("");
    setIsJoinModalOpen(true);
  };

  // Handle view details
  const handleViewDetails = (club) => {
    setSelectedClub(club);
  };

  const closeModal = () => {
    setSelectedClub(null);
  };

  const closeJoinModal = () => {
    setIsJoinModalOpen(false);
    setJoinReason("");
    setJoiningClubId(null);
  };

  const submitJoinRequest = async () => {
    if (!joinReason.trim()) {
      alert('Please provide a reason.');
      return;
    }
    try {
      setIsSubmitting(true);
      // TODO: Wire to backend endpoint here
      console.log('Submitting join request for club:', joiningClubId, 'reason:', joinReason);
      alert('Request submitted!');
      closeJoinModal();
    } finally {
      setIsSubmitting(false);
    }
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
                    <div key={club.club_id || club.id || index} className={`club-card ${getCategoryColor(club.category)}`}>
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
                          onClick={() => handleViewDetails(club)}
                        >
                          View Details
                        </button>
                        {null}
                      </div>
                    </div>
                  ))}
                </div>

                {null}
              </>
            )}
          </main>
        </div>
      </div>
      {/* Club Details Modal */}
      {selectedClub && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>
              <X size={20} />
            </button>
            <div className="modal-header">
              <h2>{selectedClub.club_name}</h2>
              <p className="modal-category">{selectedClub.category}</p>
            </div>
            <div className="modal-body">
              <p>{selectedClub.description}</p>
              <div className="modal-details">
                <p><strong>Email:</strong> {selectedClub.email}</p>
                <p><strong>Social Media:</strong> {selectedClub.social_media || "N/A"}</p>
                <p><strong>Website:</strong> {selectedClub.website || "N/A"}</p>
                <p><strong>Members:</strong> {selectedClub.member_count || selectedClub.members || 0}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="join-btn" onClick={() => handleJoinClub(selectedClub.club_id || selectedClub.id)}>
                Join Club
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Join Reason Modal */}
      {isJoinModalOpen && (
        <div className="modal-overlay" onClick={closeJoinModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeJoinModal}>
              <X size={20} />
            </button>
            <div className="modal-header">
              <h2>Join Request</h2>
              <p className="modal-category">Why are you willing to join this club?</p>
            </div>
            <div className="modal-body">
              <textarea
                className="reason-textarea"
                rows="5"
                placeholder="Share your motivation, relevant experience, or interests..."
                value={joinReason}
                onChange={(e) => setJoinReason(e.target.value)}
              />
            </div>
            <div className="modal-footer modal-actions">
              <button className="cancel-btn" onClick={closeJoinModal} disabled={isSubmitting}>Cancel</button>
              <button className="join-btn" onClick={submitJoinRequest} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ClientLayout>
  );
};

export default CommunityPage;