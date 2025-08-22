import React from "react";
import "./CommunityPage.css";
import {
  Users, Calendar, Settings, TrendingUp, Plus,
  Search, Bell, Filter, Star, Clock, ChevronRight
} from "lucide-react";
import ClientLayout from "../../Nav/ClientLayout";

const CommunityPage = () => {
  return (
    // <ClientLayout userRole="general">
    //   <div className="community-page" style={{ display: "flex", height: "100%", maxWidth:"80%" }}>
        
    //     {/* Main Content (middle section) */}
    //     <div className="main-content" style={{ flex: "1", padding: "0px" }}>
    //       <header className="main-header">
    //         <div className="header-top">
    //           <div className="header-title">
    //             <h2>Discover Clubs</h2>
    //             <p>Find and join amazing clubs in your community</p>
    //           </div>
    //           <div className="header-actions">
    //             <div className="search-bar">
    //               <Search className="search-icon" size={18} />
    //               <input type="text" placeholder="Search clubs..." />
    //             </div>
    //             <button className="filter-btn">
    //               <Filter size={20} />
    //             </button>
    //             <button className="notification-btn">
    //               <Bell size={20} />
    //             </button>
    //           </div>
    //         </div>
    //       </header>

    //       <main className="clubs-grid">
    //         {[
    //           { name: "Tech Innovators", members: 248, category: "Technology", color: "blue" },
    //           { name: "Design Studio", members: 156, category: "Design", color: "purple" },
    //           { name: "Startup Hub", members: 312, category: "Business", color: "green" },
    //           { name: "Photography Club", members: 89, category: "Arts", color: "orange" },
    //           { name: "Music Collective", members: 203, category: "Music", color: "indigo" },
    //           { name: "Sports League", members: 445, category: "Sports", color: "teal" }
    //         ].map((club, index) => (
    //           <div key={index} className={`club-card ${club.color}`}>
    //             <div className="club-header">
    //               <div className="club-icon">
    //                 <Users className="users-icon" size={24} />
    //               </div>
    //               <div className="club-rating">
    //                 <Star className="star-icon" size={16} />
    //                 <span>4.8</span>
    //               </div>
    //             </div>

    //             <h3>{club.name}</h3>
    //             <div className="club-info">
    //               <span>{club.members} members</span>
    //               <span className="category">{club.category}</span>
    //             </div>

    //             <p className="club-description">
    //               Join our vibrant community of passionate individuals and unlock new opportunities for growth and collaboration.
    //             </p>

    //             <div className="club-actions">
    //               <button className="view-details-btn">View Details</button>
    //               <button className="join-btn">Join</button>
    //             </div>
    //           </div>
    //         ))}
    //       </main>
    //     </div>

    //     {/* Right Sidebar */}
    //     <div className="right-sidebar" style={{ flex: "1", backgroundColor: "#fafafa", padding: "0px" }}>
    //       <div className="overview-header">
    //         <h3>Overview</h3>
    //       </div>

    //       <div className="overview-content">
    //         {/* My Clubs */}
    //         <div className="my-clubs">
    //           <div className="my-clubs-header">
    //             <h4>My Clubs</h4>
    //             <span>3 active</span>
    //           </div>
    //           <div className="my-clubs-list">
    //             {[
    //               { name: "Design Studio", status: "Active", color: "purple" },
    //               { name: "Tech Innovators", status: "Active", color: "blue" },
    //               { name: "Music Collective", status: "Active", color: "indigo" }
    //             ].map((club, index) => (
    //               <div key={index} className="my-club-item">
    //                 <div className={`my-club-avatar ${club.color}`}>
    //                   <Users size={14} />
    //                 </div>
    //                 <div className="my-club-info">
    //                   <p>{club.name}</p>
    //                   <p className="status">{club.status}</p>
    //                 </div>
    //                 <ChevronRight className="chevron-icon" size={16} />
    //               </div>
    //             ))}
    //           </div>
    //         </div>

    //         {/* Progress */}
    //         <div className="progress-section">
    //           <h4>Progress</h4>
    //           {[
    //             { label: "Club Participation", value: "85%", color: "blue", width: "85%" },
    //             { label: "Events Attended", value: "12/15", color: "green", width: "80%" }
    //           ].map((item, i) => (
    //             <div key={i} className={`progress-bar-wrapper ${item.color}`}>
    //               <div className="progress-bar-header">
    //                 <span>{item.label}</span>
    //                 <span>{item.value}</span>
    //               </div>
    //               <div className="progress-bar-bg">
    //                 <div className="progress-bar-fill" style={{ width: item.width }}></div>
    //               </div>
    //             </div>
    //           ))}
    //         </div>

    //         {/* Quick Stats */}
    //         <div className="quick-stats">
    //           <h4>Quick Stats</h4>
    //           <div className="stats-grid">
    //             <div className="stat-card blue">
    //               <p className="stat-number">3</p>
    //               <p>Clubs Joined</p>
    //             </div>
    //             <div className="stat-card purple">
    //               <p className="stat-number">24</p>
    //               <p>Events</p>
    //             </div>
    //           </div>
    //         </div>

    //         {/* Recent Activity */}
    //         <div className="recent-activity">
    //           <h4>Recent Activity</h4>
    //           <div className="activity-list">
    //             {[
    //               { action: "Joined Tech Innovators", time: "2 hours ago" },
    //               { action: "Attended Design Workshop", time: "1 day ago" },
    //               { action: "Created Music Event", time: "2 days ago" }
    //             ].map((activity, index) => (
    //               <div key={index} className="activity-item">
    //                 <div className="activity-dot"></div>
    //                 <div className="activity-info">
    //                   <p>{activity.action}</p>
    //                   <p className="activity-time">
    //                     <Clock size={12} />
    //                     {activity.time}
    //                   </p>
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </ClientLayout>
    <div>Public Club Page , Comming Soon </div>
  );
};

export default CommunityPage;