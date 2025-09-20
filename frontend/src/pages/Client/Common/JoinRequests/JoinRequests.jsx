import React, { useState, useEffect } from "react";
import "./JoinRequests.css";

const JoinRequests = () => {
    const [joinRequests, setJoinRequests] = useState([
        //all join requests here     
    ]);

    // Show all requests (both pending and approved)
    const allRequests = joinRequests;

    return (
        <div className="myclubs-container">
            {/* Header Section - 25% of page */}
            <div className="myclubs-header">
                <div className="header-content">
                    <h1 className="main-title">Join Clubs</h1>
                    <h2 className="subtitle">Be a part of something cool</h2>
                    <p className="tagline">Connect with like-minded individuals and explore your passions together</p>
                </div>
            </div>

            {/* Main Content Box - 75% of page */}
            <div className="myclubs-content">
                <div className="content-box">
                    <h3 className="content-heading">Join Requests</h3>
                    
                    {allRequests.length === 0 ? (
                        <div className="no-requests">
                            <p>You haven’t requested to join any club yet.</p>
                            <p>Start sending requests and grow your connections </p>
                        </div>
                    ) : (
                        <div className="requests-list">
                            {allRequests.map(request => (
                                <div key={request.id} className="request-card">
                                    <div className="request-info">
                                        <h4 className="club-name">{request.clubName}</h4>
                                        <p className="club-description">{request.clubDescription}</p>
                                        <p className="club-category">{request.clubCategory}</p>
                                        <p className="request-date">Requested on: {new Date(request.requestDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="request-status">
                                        <span className={`status-badge ${request.status}`}>
                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                        </span>
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