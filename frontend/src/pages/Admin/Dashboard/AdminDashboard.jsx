// AdminDashboard.jsx
import React, { useState, useMemo } from 'react';
import {
  BarChart, Users, Calendar, Target, Shield, Ban, Search, Activity
} from 'lucide-react';
import './AdminDashboard.css';

// Mock Data
const mockClubs = [
  { id: 1, name: 'Tech Innovators', owner: 'anita@college.edu', type: 'Public', status: 'pending', submittedAt: '2h ago' },
  { id: 2, name: 'Photography Fans', owner: 'mark@college.edu', type: 'Private', status: 'pending', submittedAt: '4h ago' },
  { id: 3, name: 'Gaming Masters', owner: 'jules@college.edu', type: 'Public', status: 'pending', submittedAt: '1d ago' },
  { id: 4, name: 'Music Lovers', owner: 'sarah@college.edu', type: 'Public', status: 'pending', submittedAt: '3h ago' },
];

const mockBlockedClubs = [
  { id: 5, name: 'Spam Club', owner: 'spam@college.edu', type: 'Public', blockedAt: '2d ago', reason: 'Spam content' },
  { id: 6, name: 'Inactive Group', owner: 'old@college.edu', type: 'Private', blockedAt: '5d ago', reason: 'Inactive for 6 months' },
];

const mockActiveClubs = [
  { id: 7, name: 'Art Hub', owner: 'emma@college.edu', type: 'Public', status: 'active' },
  { id: 8, name: 'Dance Fusion', owner: 'liam@college.edu', type: 'Private', status: 'active' },
  { id: 9, name: 'Book Lovers', owner: 'noah@college.edu', type: 'Public', status: 'active' },
  { id: 10, name: 'Fitness Freaks', owner: 'ava@college.edu', type: 'Private', status: 'active' },
  { id: 11, name: 'Drama Society', owner: 'mia@college.edu', type: 'Public', status: 'active' },
  { id: 12, name: 'Designers Club', owner: 'lucas@college.edu', type: 'Public', status: 'active' },
  { id: 13, name: 'Cultural Crew', owner: 'olivia@college.edu', type: 'Private', status: 'active' },
  { id: 14, name: 'Eco Warriors', owner: 'sophia@college.edu', type: 'Public', status: 'active' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingClubs, setPendingClubs] = useState(mockClubs);
  const [blockedClubs, setBlockedClubs] = useState(mockBlockedClubs);
  const [activeClubs, setActiveClubs] = useState(mockActiveClubs);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(5); // lazy loading count

  // Stats Data
  const stats = {
    totalClubs: 245,
    activeEvents: 67,
    targetsSet: 32,
    pendingApprovals: pendingClubs.length,
    blockedClubs: blockedClubs.length,
    growth: 12.5
  };

  // Chart Data
  const monthlyData = [
    { month: 'Jan', clubs: 180, events: 45 },
    { month: 'Feb', clubs: 195, events: 52 },
    { month: 'Mar', clubs: 210, events: 58 },
    { month: 'Apr', clubs: 225, events: 61 },
    { month: 'May', clubs: 238, events: 65 },
    { month: 'Jun', clubs: 245, events: 67 },
  ];

  // Actions
  const handleBlock = (id) => {
    const club = activeClubs.find(c => c.id === id);
    if (club) {
      setActiveClubs(prev => prev.filter(c => c.id !== id));
      setBlockedClubs(prev => [...prev, { ...club, status: 'blocked', blockedAt: 'Just now', reason: 'Admin decision' }]);
    }
  };

  const handleUnblock = (id) => {
    const club = blockedClubs.find(c => c.id === id);
    setBlockedClubs(prev => prev.filter(c => c.id !== id));
    setActiveClubs(prev => [...prev, { ...club, status: 'active' }]);
  };

  // Filters
  const filteredBlocked = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return blockedClubs.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.owner.toLowerCase().includes(q)
    );
  }, [searchQuery, blockedClubs]);

  const filteredActive = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return activeClubs.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.owner.toLowerCase().includes(q)
    );
  }, [searchQuery, activeClubs]);

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <aside className="admin-sidebar-new">
        <div className="sidebar-header-new">
          <div className="sidebar-brand">
            <div className="brand-logo-new">CM</div>
            <div className="brand-text">
              <h2 className="brand-title">Admin Panel</h2>
              <p className="brand-subtitle">Club Management</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav-new">
          <button
            onClick={() => setActiveTab('overview')}
            className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <BarChart className="nav-icon" />
            <span className="nav-text">Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('block')}
            className={`nav-btn ${activeTab === 'block' ? 'active' : ''}`}
          >
            <Ban className="nav-icon" />
            <span className="nav-text">Block Clubs</span>
          </button>

          <button
            onClick={() => setActiveTab('unblock')}
            className={`nav-btn ${activeTab === 'unblock' ? 'active' : ''}`}
          >
            <Shield className="nav-icon" />
            <span className="nav-text">Unblock Clubs</span>
            {blockedClubs.length > 0 && (
              <span className="nav-badge badge-red">{blockedClubs.length}</span>
            )}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        {/* Header */}
        <div className="content-header">
          <div className="header-text">
            <h1 className="page-title">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'block' && 'Block Clubs'}
              {activeTab === 'unblock' && 'Unblock Clubs'}
            </h1>
            <p className="page-subtitle">
              {activeTab === 'overview' && 'Monitor your club management system at a glance'}
              {activeTab === 'block' && 'Block active clubs that violate policies'}
              {activeTab === 'unblock' && 'Restore access to previously blocked clubs'}
            </p>
          </div>
          <div className="header-actions">
            <div className="search-container">
              <Search className="search-icon-new" />
              <input
                type="text"
                placeholder="Search clubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-new"
              />
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-content">
            {/* Stats Grid */}
            <div className="stats-grid">
              <StatCard
                icon={<Users className="stat-icon" />}
                title="Total Clubs"
                value={stats.totalClubs}
                change={`+${stats.growth}%`}
                color="blue"
              />
              <StatCard
                icon={<Calendar className="stat-icon" />}
                title="Active Events"
                value={stats.activeEvents}
                change="+8.2%"
                color="purple"
              />
              <StatCard
                icon={<Target className="stat-icon" />}
                title="Targets Set"
                value={stats.targetsSet}
                change="+15.3%"
                color="green"
              />
              <StatCard
                icon={<Ban className="stat-icon" />}
                title="Blocked Clubs"
                value={stats.blockedClubs}
                change="No change"
                color="red"
              />
            </div>

            {/* Charts */}
            <div className="charts-grid">
              {/* Club Growth Chart */}
              <div className="chart-card">
                <h3 className="chart-title">
                  <Activity className="chart-icon blue" />
                  Club Growth Trend
                </h3>
                <div className="bar-chart">
                  {monthlyData.map((data, idx) => {
                    const maxValue = Math.max(...monthlyData.map(d => d.clubs));
                    const height = (data.clubs / maxValue) * 100;
                    return (
                      <div key={idx} className="bar-wrapper">
                        <div className="bar-container">
                          <div
                            className="bar blue"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <span className="bar-month">{data.month}</span>
                        <span className="bar-value">{data.clubs}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Events Chart */}
              <div className="chart-card">
                <h3 className="chart-title">
                  <Calendar className="chart-icon purple" />
                  Events Created
                </h3>
                <div className="bar-chart">
                  {monthlyData.map((data, idx) => {
                    const maxValue = Math.max(...monthlyData.map(d => d.events));
                    const height = (data.events / maxValue) * 100;
                    return (
                      <div key={idx} className="bar-wrapper">
                        <div className="bar-container">
                          <div
                            className="bar purple"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <span className="bar-month">{data.month}</span>
                        <span className="bar-value">{data.events}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Block Clubs Tab */}
        {activeTab === 'block' && (
          <div className="table-card">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Club Name</th>
                    <th>Owner</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActive.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        No active clubs to block
                      </td>
                    </tr>
                  ) : (
                    <>
                      {filteredActive.slice(0, visibleCount).map((club) => (
                        <tr key={club.id}>
                          <td className="font-medium">{club.name}</td>
                          <td>{club.owner}</td>
                          <td>
                            <span className={`badge ${club.type === 'Public' ? 'badge-blue' : 'badge-purple'}`}>
                              {club.type}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-green">Active</span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleBlock(club.id)}
                              className="btn btn-block"
                            >
                              Block Club
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredActive.length > visibleCount && (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center' }}>
                            <button
                              onClick={() => setVisibleCount(prev => prev + 5)}
                              className="btn btn-load-more"
                            >
                              Load More
                            </button>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Unblock Clubs Tab */}
        {activeTab === 'unblock' && (
          <div className="table-card">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Club Name</th>
                    <th>Owner</th>
                    <th>Type</th>
                    <th>Blocked</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlocked.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        No blocked clubs
                      </td>
                    </tr>
                  ) : (
                    filteredBlocked.map((club) => (
                      <tr key={club.id}>
                        <td className="font-medium">{club.name}</td>
                        <td>{club.owner}</td>
                        <td>
                          <span className={`badge ${club.type === 'Public' ? 'badge-blue' : 'badge-purple'}`}>
                            {club.type}
                          </span>
                        </td>
                        <td className="text-muted">{club.blockedAt}</td>
                        <td className="text-muted">{club.reason}</td>
                        <td>
                          <button
                            onClick={() => handleUnblock(club.id)}
                            className="btn btn-unblock"
                          >
                            Unblock
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// StatCard Component
const StatCard = ({ icon, title, value, change, color }) => {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className={`stat-icon-wrapper ${color}`}>
          {icon}
        </div>
        <span className="stat-change">{change}</span>
      </div>
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">{value}</p>
    </div>
  );
};

export default AdminDashboard;
