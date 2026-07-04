import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../../../api/axiosInstance';
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
                // Add cache-busting timestamp to force fresh data
                const res = await axiosInstance.get(`/profile/${email}?t=${Date.now()}`);
                const data = res.data;

                console.log("Full response from backend:", data);
                console.log("Clubs data from backend:", data.clubs);
                
                // Log each club to see if it has id/club_id
                data.clubs?.forEach((club, index) => {
                    console.log(`Club ${index}:`, {
                        id: club.id,
                        club_id: club.club_id,
                        name: club.name,
                        fullObject: club
                    });
                });

                // ✅ backend now sends clubs with 'id' field
                // Filter out clubs where role is 'Request'
                const filteredClubs = (data.clubs || []).filter(
                    (club) => club.role && club.role.toLowerCase() !== "request"
                );

                setMyClubs(filteredClubs);
            } catch (err) {
                console.error("Error fetching clubs:", err);
                setError("Failed to load clubs.");
            } finally {
                setLoading(false);
            }
        };

        fetchClubs();
    }, [email]);

    const handleClubClick = async (club) => {
        console.log("Clicking club:", club);
        
        try {
            // ✅ Fetch the numeric club_id using club name
            const response = await axiosInstance.get(`/api/club/id/${encodeURIComponent(club.name)}`);
            const { club_id } = response.data;
            
            console.log("✅ Fetched club_id:", club_id, "for club:", club.name);
            
            if (!club_id) {
                console.error("No club ID received from backend");
                alert("Error: Could not fetch club ID. Please try again.");
                return;
            }
            
            // Navigate to ClubDashboard with numeric club ID
            navigate(`/ClubDashboard/${club_id}`);
        } catch (error) {
            console.error("Error fetching club ID:", error);
            alert("Error: Could not load club. Please try again.");
        }
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
                                    key={club.id || club.club_id || index}
                                    className="club-item"
                                    onClick={() => handleClubClick(club)}
                                >
                                    <div className="club-main-info">
                                        <div className="club-header">
                                            <h3 className="club-name">
                                                {club.name}
                                                <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '10px' }}>
                                                    (ID: {club.id || club.club_id || 'N/A'})
                                                </span>
                                            </h3>
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