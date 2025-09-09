import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyClubs.css";

const MyClubs = () => {
    const [myClubs, setMyClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // replace with logged-in user's email (can be from auth context/localStorage)
    const email = localStorage.getItem("email"); 

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/profile/${email}`);
                const data = res.data;

                // Transform backend response into club objects
                const clubs = [];

                if (data.club1_name) {
                    clubs.push({
                        id: 1,
                        name: data.club1_name,
                        description: data.club1_description,
                        category: data.club1_category,
                        role: data.club1_role,
                        status: "active" // you can extend schema later
                    });
                }

                if (data.club2_name) {
                    clubs.push({
                        id: 2,
                        name: data.club2_name,
                        description: data.club2_description,
                        category: data.club2_category,
                        role: data.club2_role,
                        status: "active"
                    });
                }

                if (data.club3_name) {
                    clubs.push({
                        id: 3,
                        name: data.club3_name,
                        description: data.club3_description,
                        category: data.club3_category,
                        role: data.club3_role,
                        status: "active"
                    });
                }

                setMyClubs(clubs);
            } catch (err) {
                console.error("Error fetching clubs:", err);
                setError("Failed to load clubs.");
            } finally {
                setLoading(false);
            }
        };

        fetchClubs();
    }, [email]);

    const handleClubClick = (clubId) => {
        console.log(`Clicked on club with ID: ${clubId}`);
    };

    const getRoleColor = (role) => {
        if (!role) return "#6c757d";
        switch (role.toLowerCase()) {
            case "president": return "#dc3545";
            case "vice president": return "#fd7e14";
            case "treasurer": return "#20c997";
            case "secretary": return "#6f42c1";
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
                                                {club.role || "N/A"}
                                            </span>
                                        </div>
                                        <p className="club-description">{club.description}</p>
                                        <div className="club-meta">
                                            <span className="club-category">{club.category}</span>
                                        </div>
                                    </div>
                                    <div className="club-actions">
                                        <div className={`status-indicator ${club.status}`}></div>
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