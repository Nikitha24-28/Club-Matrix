import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Users, Calendar, Target, Shield, Ban, Search, Activity, X, AlertTriangle
} from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [allClubs, setAllClubs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [blockReason, setBlockReason] = useState('');

  // Fetch all clubs from database
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/admin/clubs');
        const data = await response.json();
        setAllClubs(data);
        console.log('✅ Loaded clubs:', data.length);
      } catch (error) {
        console.error('Error fetching clubs:', error);
        alert('Failed to load clubs data');
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  // Calculate stats from real data
  const stats = useMemo(() => {
    const activeClubs = allClubs.filter(c => c.block_status === 'Unblocked');
    const blockedClubs = allClubs.filter(c => c.block_status === 'Blocked');
    
    return {
      totalClubs: allClubs.length,
      activeClubs: activeClubs.length,
      blockedClubs: blockedClubs.length,
      publicClubs: allClubs.filter(c => c.visibility === 'Public').length
    };
  }, [allClubs]);

  // Filter clubs based on search and block status
  const filteredActiveClubs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return allClubs.filter(c =>
      c.block_status === 'Unblocked' &&
      (c.club_name.toLowerCase().includes(q) ||
       (c.email && c.email.toLowerCase().includes(q)))
    );
  }, [searchQuery, allClubs]);

  const filteredBlockedClubs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return allClubs.filter(c =>
      c.block_status === 'Blocked' &&
      (c.club_name.toLowerCase().includes(q) ||
       (c.email && c.email.toLowerCase().includes(q)))
    );
  }, [searchQuery, allClubs]);

  // Handle block club
  const handleBlockClick = (club) => {
    setSelectedClub(club);
    setBlockReason('');
    setShowBlockModal(true);
  };

  const handleBlockSubmit = async () => {
    if (!blockReason.trim()) {
      alert('Please provide a reason for blocking');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/clubs/${selectedClub.club_id}/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockReason: blockReason.trim() })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to block club');
      }

      // Update local state
      setAllClubs(prev => prev.map(c =>
        c.club_id === selectedClub.club_id
          ? { ...c, block_status: 'Blocked', block_reason: blockReason.trim(), updated_at: new Date().toISOString() }
          : c
      ));

      alert(`Club "${selectedClub.club_name}" has been blocked successfully`);
      setShowBlockModal(false);
      setSelectedClub(null);
      setBlockReason('');
    } catch (error) {
      console.error('Error blocking club:', error);
      alert(error.message || 'Failed to block club');
    }
  };

  // Handle unblock club
  const handleUnblock = async (club) => {
    if (!confirm(`Are you sure you want to unblock "${club.club_name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/clubs/${club.club_id}/unblock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to unblock club');
      }

      // Update local state
      setAllClubs(prev => prev.map(c =>
        c.club_id === club.club_id
          ? { ...c, block_status: 'Unblocked', block_reason: null, updated_at: new Date().toISOString() }
          : c
      ));

      alert(`Club "${club.club_name}" has been unblocked successfully`);
    } catch (error) {
      console.error('Error unblocking club:', error);
      alert(error.message || 'Failed to unblock club');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString();
  };

  const getBlockDuration = (updatedAt) => {
    if (!updatedAt) return 'N/A';
    const date = new Date(updatedAt);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Loading admin dashboard...</h2>
        </div>
      </div>
    );
  }

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
            {stats.blockedClubs > 0 && (
              <span className="nav-badge badge-red">{stats.blockedClubs}</span>
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
                change={`${stats.activeClubs} active`}
                color="blue"
              />
              <StatCard
                icon={<Shield className="stat-icon" />}
                title="Active Clubs"
                value={stats.activeClubs}
                change={`${stats.publicClubs} public`}
                color="green"
              />
              <StatCard
                icon={<Ban className="stat-icon" />}
                title="Blocked Clubs"
                value={stats.blockedClubs}
                change={stats.blockedClubs > 0 ? 'Requires attention' : 'All clear'}
                color="red"
              />
              <StatCard
                icon={<Target className="stat-icon" />}
                title="Public Clubs"
                value={stats.publicClubs}
                change={`${allClubs.filter(c => c.visibility === 'Private').length} private`}
                color="purple"
              />
            </div>

            {/* Recent Activity */}
            <div className="chart-card" style={{ marginTop: '2rem' }}>
              <h3 className="chart-title">
                <Activity className="chart-icon blue" />
                Recent Club Updates
              </h3>
              <div style={{ padding: '1rem' }}>
                {allClubs.slice(0, 10).map((club, idx) => (
                  <div key={idx} style={{
                    padding: '0.75rem',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <strong>{club.club_name}</strong>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {club.category} • {club.visibility}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className={`badge ${club.block_status === 'Blocked' ? 'badge-red' : 'badge-green'}`}>
                        {club.block_status}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        Updated {formatDate(club.updated_at)}
                      </div>
                    </div>
                  </div>
                ))}
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
                    <th>Email</th>
                    <th>Category</th>
                    <th>Visibility</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActiveClubs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        {searchQuery ? 'No clubs found matching your search' : 'No active clubs to block'}
                      </td>
                    </tr>
                  ) : (
                    <>
                      {filteredActiveClubs.slice(0, visibleCount).map((club) => (
                        <tr key={club.club_id}>
                          <td className="font-medium">{club.club_name}</td>
                          <td>{club.email || 'N/A'}</td>
                          <td>
                            <span className="badge badge-blue">
                              {club.category}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${club.visibility === 'Public' ? 'badge-green' : 'badge-purple'}`}>
                              {club.visibility}
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-green">{club.status}</span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleBlockClick(club)}
                              className="btn btn-block"
                            >
                              Block Club
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredActiveClubs.length > visibleCount && (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center' }}>
                            <button
                              onClick={() => setVisibleCount(prev => prev + 10)}
                              className="btn btn-load-more"
                            >
                              Load More ({filteredActiveClubs.length - visibleCount} remaining)
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
                    <th>Email</th>
                    <th>Category</th>
                    <th>Blocked Duration</th>
                    <th>Reason / Request</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlockedClubs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        {searchQuery ? 'No blocked clubs found matching your search' : 'No blocked clubs'}
                      </td>
                    </tr>
                  ) : (
                    filteredBlockedClubs.map((club) => {
                      const isUnblockRequest = club.block_reason?.startsWith('UNBLOCK_REQUEST:');
                      const displayReason = isUnblockRequest 
                        ? club.block_reason.replace('UNBLOCK_REQUEST: ', '')
                        : club.block_reason;
                      
                      return (
                        <tr key={club.club_id}>
                          <td className="font-medium">{club.club_name}</td>
                          <td>{club.email || 'N/A'}</td>
                          <td>
                            <span className="badge badge-blue">
                              {club.category}
                            </span>
                          </td>
                          <td className="text-muted">{getBlockDuration(club.updated_at)}</td>
                          <td className="text-muted">
                            {isUnblockRequest && (
                              <span className="badge badge-purple" style={{ marginRight: '0.5rem' }}>
                                UNBLOCK REQUEST
                              </span>
                            )}
                            <div style={{ marginTop: '0.25rem', fontSize: '0.875rem' }}>
                              {displayReason || 'No reason provided'}
                            </div>
                          </td>
                          <td>
                            <button
                              onClick={() => handleUnblock(club)}
                              className="btn btn-unblock"
                            >
                              Unblock
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Block Club Modal */}
      {showBlockModal && selectedClub && (
        <div className="modal-overlay" onClick={() => setShowBlockModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <Ban className="modal-icon" style={{ color: '#ef4444' }} />
                Block Club: {selectedClub.club_name}
              </h2>
              <button className="modal-close" onClick={() => setShowBlockModal(false)}>
                <X className="icon-sm" />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-info" style={{ 
                background: '#fef2f2', 
                border: '1px solid #fecaca',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '0.75rem'
              }}>
                <AlertTriangle size={20} style={{ color: '#ef4444', flexShrink: 0, marginTop: '0.125rem' }} />
                <div>
                  <p style={{ margin: 0, fontWeight: '600', color: '#991b1b' }}>Warning: Blocking this club will:</p>
                  <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', color: '#7f1d1d' }}>
                    <li>Prevent all members from accessing the club</li>
                    <li>Hide the club from public view</li>
                    <li>Delete the club automatically after 30 days if not unblocked</li>
                  </ul>
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                  Reason for Blocking * <span style={{ color: '#ef4444' }}>(Required)</span>
                </label>
                <textarea
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Enter a detailed reason for blocking this club (e.g., policy violations, spam content, inappropriate behavior)..."
                  rows="5"
                  className="modal-textarea"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                  required
                />
                <p className="form-hint" style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                  This reason will be visible to the club coordinator.
                </p>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={() => setShowBlockModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-submit"
                style={{ background: '#ef4444' }}
                onClick={handleBlockSubmit}
                disabled={!blockReason.trim()}
              >
                Block Club
              </button>
            </div>
          </div>
        </div>
      )}
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