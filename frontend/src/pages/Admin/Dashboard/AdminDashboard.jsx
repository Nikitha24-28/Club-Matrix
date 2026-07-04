import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Users, Calendar, Target, Shield, Ban, Search, Activity, X, AlertTriangle, LogOut,
} from 'lucide-react';
import './AdminDashboard.css';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'sonner';

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
        const response = await axiosInstance.get('/api/admin/clubs');
        const data = response.data;
        setAllClubs(data);
        console.log('✅ Loaded clubs:', data.length);
        } catch (error) {
          console.error('Error fetching clubs:', error);
          toast.error('Failed to load clubs data');
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

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
      toast.error('Please provide a reason for blocking');
      return;
    }
    
    try {
      await axiosInstance.post(`/api/admin/clubs/${selectedClub.club_id}/block`, {
        blockReason: blockReason.trim()
      });
    
      setAllClubs(prev => prev.map(c =>
        c.club_id === selectedClub.club_id
          ? { ...c, block_status: 'Blocked', block_reason: blockReason.trim(), updated_at: new Date().toISOString() }
          : c
      ));
    
      toast.success(`Club "${selectedClub.club_name}" has been blocked successfully`);
      setShowBlockModal(false);
      setSelectedClub(null);
      setBlockReason('');
    } catch (error) {
      console.error('Error blocking club:', error);
      toast.error(error.response?.data?.message || 'Failed to block club');
    }
  };

  // Handle unblock club
  const handleUnblock = async (club) => {
    try {
      await axiosInstance.post(`/api/admin/clubs/${club.club_id}/unblock`);
    
      setAllClubs(prev => prev.map(c =>
        c.club_id === club.club_id
          ? { ...c, block_status: 'Unblocked', block_reason: null, updated_at: new Date().toISOString() }
          : c
      ));
    
      toast.success(`Club "${club.club_name}" has been unblocked successfully`);
    } catch (error) {
      console.error('Error unblocking club:', error);
      toast.error(error.response?.data?.message || 'Failed to unblock club');
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

        {/* Logout Section */}
        <div className="sidebar-footer-new">
          <div className="user-info-new"></div>
          <div className="logout-section-new">
            <button className="logout-button-new" onClick={handleLogout}>
              <LogOut className="logout-icon" size={18} />
              Logout
            </button>
          </div>
        </div>
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

            {/* Charts Section */}
            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Bar Chart - Club Statistics */}
              <div className="chart-card">
                <h3 className="chart-title">
                  <BarChart className="chart-icon blue" />
                  Club Statistics Overview
                </h3>
                <div style={{ padding: '1.5rem' }}>
                  {[
                    { name: 'Total Clubs', value: stats.totalClubs, color: '#3b82f6', max: stats.totalClubs },
                    { name: 'Active Clubs', value: stats.activeClubs, color: '#10b981', max: stats.totalClubs },
                    { name: 'Blocked Clubs', value: stats.blockedClubs, color: '#ef4444', max: stats.totalClubs },
                    { name: 'Public Clubs', value: stats.publicClubs, color: '#8b5cf6', max: stats.totalClubs }
                  ].map((item, idx) => (
                    <div key={idx} style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{item.name}</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: item.color }}>{item.value}</span>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '24px', 
                        backgroundColor: '#f3f4f6', 
                        borderRadius: '0.5rem',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${(item.value / item.max) * 100}%`,
                          height: '100%',
                          backgroundColor: item.color,
                          transition: 'width 0.3s ease',
                          borderRadius: '0.5rem'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pie Chart - Club Distribution */}
              <div className="chart-card">
                <h3 className="chart-title">
                  <Target className="chart-icon purple" />
                  Club Distribution
                </h3>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {(() => {
                    const total = stats.activeClubs + stats.blockedClubs;
                    const activePercent = total > 0 ? (stats.activeClubs / total) * 100 : 0;
                    const blockedPercent = total > 0 ? (stats.blockedClubs / total) * 100 : 0;
                    
                    return (
                      <>
                        <div style={{ 
                          width: '150px', 
                          height: '150px', 
                          borderRadius: '50%',
                          background: `conic-gradient(
                            #10b981 0deg ${activePercent * 3.6}deg,
                            #ef4444 ${activePercent * 3.6}deg 360deg
                          )`,
                          marginBottom: '1.5rem',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }} />
                        <div style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '2px' }} />
                              <span style={{ fontSize: '0.875rem' }}>Active Clubs</span>
                            </div>
                            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                              {stats.activeClubs} ({activePercent.toFixed(0)}%)
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '2px' }} />
                              <span style={{ fontSize: '0.875rem' }}>Blocked Clubs</span>
                            </div>
                            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                              {stats.blockedClubs} ({blockedPercent.toFixed(0)}%)
                            </span>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Visibility Breakdown */}
              <div className="chart-card">
                <h3 className="chart-title">
                  <Activity className="chart-icon green" />
                  Visibility Statistics
                </h3>
                <div style={{ padding: '1.5rem' }}>
                  {(() => {
                    const publicActive = allClubs.filter(c => c.visibility === 'Public' && c.block_status === 'Unblocked').length;
                    const publicBlocked = allClubs.filter(c => c.visibility === 'Public' && c.block_status === 'Blocked').length;
                    const privateActive = allClubs.filter(c => c.visibility === 'Private' && c.block_status === 'Unblocked').length;
                    const privateBlocked = allClubs.filter(c => c.visibility === 'Private' && c.block_status === 'Blocked').length;
                    const maxValue = Math.max(publicActive + publicBlocked, privateActive + privateBlocked);
                    
                    return (
                      <>
                        {[
                          { name: 'Public', active: publicActive, blocked: publicBlocked },
                          { name: 'Private', active: privateActive, blocked: privateBlocked }
                        ].map((item, idx) => (
                          <div key={idx} style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{item.name}</span>
                              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                Active: {item.active} | Blocked: {item.blocked}
                              </span>
                            </div>
                            <div style={{ 
                              width: '100%', 
                              height: '32px', 
                              backgroundColor: '#f3f4f6', 
                              borderRadius: '0.5rem',
                              overflow: 'hidden',
                              display: 'flex'
                            }}>
                              <div style={{
                                width: `${maxValue > 0 ? (item.active / maxValue) * 100 : 0}%`,
                                height: '100%',
                                backgroundColor: '#10b981',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                              }}>
                                {item.active > 0 && item.active}
                              </div>
                              <div style={{
                                width: `${maxValue > 0 ? (item.blocked / maxValue) * 100 : 0}%`,
                                height: '100%',
                                backgroundColor: '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                              }}>
                                {item.blocked > 0 && item.blocked}
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Top Categories */}
              <div className="chart-card">
                <h3 className="chart-title">
                  <Shield className="chart-icon blue" />
                  Top 5 Categories
                </h3>
                <div style={{ padding: '1.5rem' }}>
                  {(() => {
                    const categoryCount = {};
                    allClubs.forEach(club => {
                      categoryCount[club.category] = (categoryCount[club.category] || 0) + 1;
                    });
                    const topCategories = Object.entries(categoryCount)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5);
                    const maxCount = topCategories.length > 0 ? topCategories[0][1] : 1;
                    
                    return topCategories.map(([name, count], idx) => (
                      <div key={idx} style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{name}</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#3b82f6' }}>{count}</span>
                        </div>
                        <div style={{ 
                          width: '100%', 
                          height: '24px', 
                          backgroundColor: '#f3f4f6', 
                          borderRadius: '0.5rem',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${(count / maxCount) * 100}%`,
                            height: '100%',
                            backgroundColor: '#3b82f6',
                            transition: 'width 0.3s ease',
                            borderRadius: '0.5rem'
                          }} />
                        </div>
                      </div>
                    ));
                  })()}
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