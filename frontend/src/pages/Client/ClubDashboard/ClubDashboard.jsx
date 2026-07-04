import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Calendar, Target, FileText, Eye, AlertTriangle, Shield, ChevronDown, ChevronRight, X } from 'lucide-react';
import useClubDashboard from './hooks/useClubDashboard';
import AnnouncementsSection from './components/AnnouncementsSection';
import EventsSection from './components/EventsSection';
import TargetsSection from './components/TargetsSection';
import MembersSection from './components/MembersSection';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'sonner';
import './ClubDashboard.css';

const ClubDashboard = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [expandMoms, setExpandMoms] = useState(false);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [unblockReason, setUnblockReason] = useState('');

  const {
    clubInfo, setClubInfo, loading, error, role,
    announcements, events, targets, members, setMembers,
    momFiles, joinRequests, setJoinRequests, blockStatus,
    setTargets, refreshAnnouncements, refreshEvents,
    refreshTargets, refreshMembers, refreshBlockStatus
  } = useClubDashboard(clubId);

  const handleUnblockRequest = async () => {
    if (!unblockReason.trim()) {
      toast.error('Please provide a reason for unblocking');
      return;
    }
    try {
      const userEmail = localStorage.getItem('email');
      await axiosInstance.post(`/api/clubs/${clubId}/request-unblock`, {
        unblockReason: unblockReason.trim(),
        userEmail
      });
      toast.success('Unblock request submitted! Admin will review your request.');
      setShowUnblockModal(false);
      setUnblockReason('');
      await refreshBlockStatus();
    } catch (err) {
      console.error('Error submitting unblock request:', err);
      toast.error(err.response?.data?.message || 'Failed to submit unblock request');
    }
  };

  if (loading) return (
    <div className="club-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Loading...</h1>
          <p className="header-subtitle">Fetching club information</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="club-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Error</h1>
          <p className="header-subtitle">{error}</p>
        </div>
      </div>
    </div>
  );

  if (!clubInfo) return (
    <div className="club-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Club Not Found</h1>
          <p className="header-subtitle">The requested club could not be found</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="club-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>{clubInfo?.name || 'Club Dashboard'}</h1>
          <p className="header-subtitle">Manage your club activities and stay updated</p>
        </div>
        <div className="role-badge">
          {role === 'Coordinator' ? 'Coordinator' : 'Member'}
        </div>
      </div>

      {/* Block notification */}
      {blockStatus?.blockStatus === 'Blocked' && (
        <div className="block-notification-container">
          <div className={`block-notification ${blockStatus.daysRemaining <= 7 ? 'urgent' : ''}`}>
            <div className="notification-icon"><AlertTriangle size={24} /></div>
            <div className="notification-content">
              <h3 className="notification-title">
                {blockStatus.willBeDeleted ? 'Critical: Club Will Be Deleted' : 'Club is Blocked'}
              </h3>
              <p className="notification-message">
                {blockStatus.willBeDeleted
                  ? <>Your club has been blocked for 30 days and will be <strong>permanently deleted</strong>. Submit an unblock request immediately!</>
                  : <>Your club has been blocked by admin. You have <strong>{blockStatus.daysRemaining} days</strong> remaining before permanent deletion.</>}
              </p>
              <div className="notification-details">
                <div className="detail-item">
                  <span className="detail-label">Block Reason:</span>
                  <span className="detail-value">
                    {blockStatus.blockReason?.startsWith('UNBLOCK_REQUEST:')
                      ? blockStatus.blockReason.replace('UNBLOCK_REQUEST: ', 'Your Request: ')
                      : blockStatus.blockReason || 'No reason provided'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Days Blocked:</span>
                  <span className="detail-value">{blockStatus.daysBlocked} days</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Days Remaining:</span>
                  <span className={`detail-value ${blockStatus.daysRemaining <= 7 ? 'urgent-text' : ''}`}>
                    {blockStatus.daysRemaining} days
                  </span>
                </div>
              </div>
              {role === 'Coordinator' && !blockStatus.blockReason?.startsWith('UNBLOCK_REQUEST:') && (
                <button className="unblock-request-btn" onClick={() => setShowUnblockModal(true)}>
                  <Shield size={18} /> Request Unblock
                </button>
              )}
              {blockStatus.blockReason?.startsWith('UNBLOCK_REQUEST:') && (
                <div className="request-pending-badge">
                  <Shield size={16} /> Unblock request pending admin review
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stats-section">
        <h2>Club Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><Users className="icon" /></div>
            <div className="stat-content">
              <div className="stat-value">{clubInfo.memberCount || members.length}</div>
              <div className="stat-label">Total Members</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Calendar className="icon" /></div>
            <div className="stat-content">
              <div className="stat-value">{events.filter(e => e.status === 'active').length}</div>
              <div className="stat-label">Upcoming Events</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Target className="icon" /></div>
            <div className="stat-content">
              <div className="stat-value">{targets.filter(t => t.status === 'active').length}</div>
              <div className="stat-label">Active Targets</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><FileText className="icon" /></div>
            <div className="stat-content">
              <div className="stat-value">{momFiles.length}</div>
              <div className="stat-label">MoM Files</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="dashboard-content">
        <div className="left-column">
          <AnnouncementsSection
            clubId={clubId} role={role}
            announcements={announcements}
            onRefresh={refreshAnnouncements}
          />

          {/* MoMs section */}
          <div className="section">
            <div className="section-header clickable" onClick={() => setExpandMoms(p => !p)}
              role="button" tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setExpandMoms(p => !p)}>
              <h3><FileText className="section-icon" /> Minutes of Meetings (MoMs)</h3>
              <div className="section-actions">
                <span className="members-count-badge">{momFiles.length}</span>
                <span className="collapse-toggle">
                  {expandMoms ? <ChevronDown className="icon-sm" /> : <ChevronRight className="icon-sm" />}
                </span>
                <button className="add-btn" onClick={() => navigate(`/ClubDashboard/${clubId}/mom`)}>
                  <Eye className="icon-sm" /> View All MoMs
                </button>
              </div>
            </div>
            {expandMoms && (
              <div className="mom-files">
                {momFiles.map((file) => (
                  <div key={file.id} className="file-card">
                    <div className="file-icon"><FileText className="icon" /></div>
                    <div className="file-info">
                      <h4>{file.name}</h4>
                      <div className="file-meta">
                        <span>{file.date}</span>
                        <span>{file.size}</span>
                        <span className="file-type">{file.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <MembersSection
            clubId={clubId} role={role}
            members={members} setMembers={setMembers}
            setClubInfo={setClubInfo}
            joinRequests={joinRequests} setJoinRequests={setJoinRequests}
            onRefreshMembers={refreshMembers}
          />
        </div>

        <div className="right-column">
          <EventsSection
            clubId={clubId} role={role}
            events={events} onRefresh={refreshEvents}
          />
          <TargetsSection
            clubId={clubId} role={role}
            targets={targets} setTargets={setTargets}
            onRefresh={refreshTargets}
          />
        </div>
      </div>

      {/* Unblock Modal */}
      {showUnblockModal && (
        <div className="modal-overlay" onClick={() => setShowUnblockModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><Shield className="modal-icon" style={{ color: '#10b981' }} /> Request Club Unblock</h2>
              <button className="modal-close" onClick={() => setShowUnblockModal(false)}>
                <X className="icon-sm" />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-info">
                <AlertTriangle size={20} style={{ color: '#f59e0b' }} />
                <p>Explain why your club should be unblocked. The admin will review your request.</p>
              </div>
              <div className="form-group">
                <label>Reason for Unblocking *</label>
                <textarea value={unblockReason}
                  onChange={(e) => setUnblockReason(e.target.value)}
                  placeholder="Explain what corrective actions you've taken..."
                  rows="5" className="modal-textarea" required />
                <p className="form-hint">Be specific about how you've addressed the issues.</p>
              </div>
              <div className="modal-warning-box">
                <strong>Important:</strong> You have {blockStatus?.daysRemaining} days remaining before permanent deletion.
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setShowUnblockModal(false)}>Cancel</button>
              <button type="button" className="btn-submit"
                onClick={handleUnblockRequest} disabled={!unblockReason.trim()}>
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubDashboard;