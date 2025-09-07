import React, { useState, useEffect } from "react";
import "./MyClubs.css";

const MyClubs = () => {
    // Dummy data for clubs
    const [myClubs, setMyClubs] = useState([
        {
            id: 1,
            name: "Computer Science Club",
            description: "A community for computer science enthusiasts to share knowledge and collaborate on projects.",
            category: "Technology",
            role: "President",
            memberCount: 45,
            joinDate: "2023-08-15",
            status: "active"
        },
        {
            id: 2,
            name: "Photography Society",
            description: "Capture moments, share stories, and explore the art of photography together.",
            category: "Arts & Culture",
            role: "Member",
            memberCount: 32,
            joinDate: "2023-09-20",
            status: "active"
        },
        {
            id: 3,
            name: "Debate Club",
            description: "Sharpen your argumentation skills and engage in intellectual discussions.",
            category: "Academic",
            role: "Vice President",
            memberCount: 28,
            joinDate: "2023-07-10",
            status: "active"
        },
        {
            id: 4,
            name: "Environmental Club",
            description: "Working together to promote sustainability and environmental awareness on campus.",
            category: "Social Impact",
            role: "Treasurer",
            memberCount: 38,
            joinDate: "2023-10-05",
            status: "active"
        },
        {
            id: 5,
            name: "Music Club",
            description: "For music lovers to jam, perform, and share their passion for all genres.",
            category: "Arts & Culture",
            role: "Member",
            memberCount: 52,
            joinDate: "2023-11-12",
            status: "active"
        }
    ]);

    const handleClubClick = (clubId) => {
        console.log(`Clicked on club with ID: ${clubId}`);
        // Here you would typically navigate to the club details page
        // For now, just log the action
    };

    const getRoleColor = (role) => {
        switch (role.toLowerCase()) {
            case 'president':
                return '#dc3545'; // Red
            case 'vice president':
                return '#fd7e14'; // Orange
            case 'treasurer':
                return '#20c997'; // Teal
            case 'secretary':
                return '#6f42c1'; // Purple
            case 'member':
                return '#6c757d'; // Gray
            default:
                return '#6c757d';
        }
    };

    return (
        <div className="myclubs-container">
            {/* Header Section */}
            <div className="myclubs-header">
                <div className="header-content">
                    <h1 className="main-title">My Clubs</h1>
                    <p className="subtitle">Your Club Memberships</p>
                    <p className="tagline">Manage and explore your club activities</p>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="myclubs-content">
                <div className="content-box">
                    <h2 className="content-heading">Your Club Memberships</h2>
                    
                    {myClubs.length > 0 ? (
                        <div className="clubs-list">
                            {myClubs.map((club) => (
                                <div 
                                    key={club.id} 
                                    className="club-item"
                                    onClick={() => handleClubClick(club.id)}
                                >
                                    <div className="club-main-info">
                                        <div className="club-header">
                                            <h3 className="club-name">{club.name}</h3>
                                            <span 
                                                className="role-badge"
                                                style={{ backgroundColor: getRoleColor(club.role) }}
                                            >
                                                {club.role}
                                            </span>
                                        </div>
                                        <p className="club-description">{club.description}</p>
                                        <div className="club-meta">
                                            <span className="club-category">{club.category}</span>
                                            <span className="member-count">{club.memberCount} members</span>
                                            <span className="join-date">Joined: {new Date(club.joinDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="club-actions">
                                        <div className="status-indicator active"></div>
                                        <span className="action-arrow">→</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-clubs">
                            <p>You haven't joined any clubs yet.</p>
                            <p>Explore available clubs and join the ones that interest you!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyClubs;