import React, { useState, useEffect } from "react";
import "./JoinRequests.css";
import axiosInstance from '../../../../api/axiosInstance';

const JoinRequests = () => {
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJoinRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const userEmail = localStorage.getItem("email");
        
        if (!userEmail) {
          throw new Error("User email not found. Please log in again.");
        }
        
        const response = await axiosInstance.get(
          `/clubs/requests?email=${encodeURIComponent(userEmail)}`
        );
        setJoinRequests(Array.isArray(response.data) ? response.data : []);
        
      } catch (err) {
        console.error("Error fetching join requests:", err);
        setError(err.message);
        setJoinRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJoinRequests();
  }, []);

  const allRequests = joinRequests;

  return (
    <div className="myclubs-container">
      {/* Header Section - 25% of page */}
      <div className="myclubs-header">
        <div className="header-content">
          <h1 className="main-title">Your Club Requests</h1>
          <h2 className="subtitle">Track your pending requests and membership status</h2>
          <p className="tagline">Stay updated as coordinators review your requests</p>
        </div>
      </div>

      {/* Main Content Box - 75% of page */}
      <div className="myclubs-content">
        <div className="content-box">
          <h3 className="content-heading">Pending Join Requests</h3>
          
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your join requests...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p className="error-message">Error: {error}</p>
              <button 
                className="retry-button" 
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : allRequests.length === 0 ? (
            <div className="no-requests">
              <p>You have no pending join requests.</p>
              <p>Requests you submit will appear here until they are approved or rejected.</p>
            </div>
          ) : (
            <div className="requests-list">
              {allRequests.map((request, index) => (
                <div key={request.club_id || request.id || index} className="request-card">
                  <div className="request-info">
                    <h4 className="club-name">{request.clubName || request.name || 'Unknown Club'}</h4>
                    <p className="club-description">{request.clubDescription || request.description || 'No description available'}</p>
                    <p className="club-category">{request.clubCategory || request.category || 'Uncategorized'}</p>
                    <p className="request-date">
                      Requested on: {request.requestDate ? new Date(request.requestDate).toLocaleDateString() : 'Date not available'}
                    </p>
                    <p className="request-reason">
                      <strong>Reason:</strong> {request.request_reason || request.reason || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinRequests;