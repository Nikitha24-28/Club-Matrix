import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyClubs.css";

const MyClubs = () => {
    const [myClubs, setMyClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const email = localStorage.getItem("email"); 

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/profile/${email}`);
                const data = res.data;

                // ✅ backend already sends clubs array
                setMyClubs(data.clubs || []);
            } catch (err) {
                console.error("Error fetching clubs:", err);
                setError("Failed to load clubs.");
            } finally {
                setLoading(false);
            }
        };

        fetchClubs();
    }, [email]);

    const handleClubClick = (club) => {
        // Navigate to ClubDashboard with club ID
        navigate(`/ClubDashboard/${club.id || club.name}`);
    };

    const getRoleColor = (role) => {
        if (!role) return "#6c757d";
        switch (role.toLowerCase()) {
            case "president": return "#dc3545";
            case "vice president": return "#fd7e14";
            case "treasurer": return "#20c997";
            case "secretary": return "#6f42c1";
            case "coordinator": return "#007bff";
            case "member": return "#6c757d";
            default: return "#6c757d";
        }
    };

    if (loading) return <p>Loading clubs...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="myclubs-container">
            <div className="myclubs-header">
                <div className="header-content">
                    <h1 className="main-title">My Clubs</h1>
                    <p className="subtitle">Your Club Memberships</p>
                    <p className="tagline">Manage and explore your club activities</p>
                </div>
            </div>

            <div className="myclubs-content">
                <div className="content-box">
                    <h2 className="content-heading">Your Club Memberships</h2>

                    {myClubs.length > 0 ? (
                        <div className="clubs-list">
                            {myClubs.map((club, index) => (
                                <div 
                                    key={index} 
                                    className="club-item"
                                    onClick={() => handleClubClick(club)}
                                >
                                    <div className="club-main-info">
                                        <div className="club-header">
                                            <h3 className="club-name">{club.name}</h3>
                                            <span 
                                                className="role-badge"
                                                style={{ backgroundColor: getRoleColor(club.role) }}
                                            >
                                                {club.role || "N/A"}
                                            </span>
                                        </div>
                                        <p className="club-description">{club.description}</p>
                                        <div className="club-meta">
                                            <span className="club-category">{club.category}</span>
                                        </div>
                                    </div>
                                    <div className="club-actions">
                                        <div className={`status-indicator active`}></div>
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
