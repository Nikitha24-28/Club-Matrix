import React, { useState, useEffect } from "react";
import "./JoinRequests.css";

const JoinRequests = () => {
  const [joinRequests, setJoinRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJoinRequests = async () => {
      try {
        setLoading(true);
        const userEmail = localStorage.getItem("email");
        const response = await fetch(
          `http://localhost:5000/clubs/requests?email=${encodeURIComponent(userEmail)}`
        );
        if (!response.ok) throw new Error("Failed to fetch join requests");
        const data = await response.json();
        setJoinRequests(data);
      } catch (err) {
        setError(err.message);
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
            <p>Loading requests...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : allRequests.length === 0 ? (
            <div className="no-requests">
              <p>You have no pending join requests.</p>
              <p>Requests you submit will appear here until they are approved or rejected.</p>
            </div>
          ) : (
            <div className="requests-list">
              {allRequests.map((request) => (
                <div key={request.club_id} className="request-card">
                  <div className="request-info">
                    <h4 className="club-name">{request.clubName}</h4>
                    <p className="club-description">{request.clubDescription}</p>
                    <p className="club-category">{request.clubCategory}</p>
                    <p className="request-date">
                      Requested on: {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                    <p className="request-reason">
                      <strong>Reason:</strong> {request.request_reason || "N/A"}
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