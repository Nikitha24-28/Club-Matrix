import React, { useState, useEffect } from "react";
import "./JoinRequests.css";

const JoinRequests = () => {
    const [joinRequests, setJoinRequests] = useState([
        {
            id: 1,
            clubName: "Photography Club",
            clubDescription: "Capture moments and explore the art of photography",
            clubCategory: "Arts & Media",
            requestDate: "2024-01-15",
            status: "approved"
        },
        {
            id: 2,
            clubName: "Coding Club",
            clubDescription: "Learn programming and build amazing projects together",
            clubCategory: "Technology",
            requestDate: "2024-01-14",
            status: "pending"
        },
        {
            id: 3,
            clubName: "Music Society",
            clubDescription: "Share your love for music and perform together",
            clubCategory: "Arts & Media",
            requestDate: "2024-01-13",
            status: "approved"
        },
        {
            id: 4,
            clubName: "Drama Club",
            clubDescription: "Express yourself through theater and acting",
            clubCategory: "Arts & Media",
            requestDate: "2024-01-12",
            status: "pending"
        },
        {
            id: 5,
            clubName: "Debate Society",
            clubDescription: "Develop critical thinking and public speaking skills",
            clubCategory: "Academic",
            requestDate: "2024-01-11",
            status: "approved"
        },
        {
            id: 6,
            clubName: "Art Club",
            clubDescription: "Create, inspire, and explore various art forms",
            clubCategory: "Arts & Media",
            requestDate: "2024-01-10",
            status: "pending"
        }
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
                            <p>No join requests at the moment.</p>
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