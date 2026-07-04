import React, { useState } from 'react';
import { Users, UserPlus, Plus, ChevronDown, ChevronRight, X } from 'lucide-react';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

const MembersSection = ({
  clubId, role, members, setMembers, setClubInfo,
  joinRequests, setJoinRequests, onRefreshMembers
}) => {
  const [showMembers, setShowMembers] = useState(false);
  const [showJoinRequests, setShowJoinRequests] = useState(true);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMember, setNewMember] = useState({ email: '', role: 'Member' });

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/api/club/${clubId}/add-member`, {
        memberEmail: newMember.email,
        role: newMember.role
      });
      toast.success(response.data.message);
      await onRefreshMembers();
      setClubInfo(prev => ({ ...prev, memberCount: (prev.memberCount || 0) + 1 }));
      setNewMember({ email: '', role: 'Member' });
      setShowAddMemberModal(false);
    } catch (err) {
      console.error('Error adding member:', err);
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await axiosInstance.post(`/api/club/${clubId}/join-requests/${requestId}/accept`);
      setJoinRequests(prev => prev.filter(r => r.id !== requestId));
      await onRefreshMembers();
      setClubInfo(prev => ({ ...prev, memberCount: (prev.memberCount || 0) + 1 }));
      toast.success('Request accepted');
    } catch (err) {
      console.error('Error accepting request:', err);
      toast.error('Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await axiosInstance.delete(`/api/club/${clubId}/join-requests/${requestId}/reject`);
      setJoinRequests(prev => prev.filter(r => r.id !== requestId));
      toast.success('Request rejected');
    } catch (err) {
      console.error('Error rejecting request:', err);
      toast.error('Failed to reject request');
    }
  };

  return (
    <>
      {/* Join Requests — Coordinator only */}
      {role === 'Coordinator' && (
        <div className="section">
          <div className="section-header clickable"
            onClick={() => setShowJoinRequests(p => !p)}
            role="button" tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setShowJoinRequests(p => !p)}>
            <h3><UserPlus className="section-icon" /> Join Requests</h3>
            <div className="section-actions">
              <span className="requests-count-badge">{joinRequests.length}</span>
              <span className="collapse-toggle">
                {showJoinRequests ? <ChevronDown className="icon-sm" /> : <ChevronRight className="icon-sm" />}
              </span>
            </div>
          </div>

          {showJoinRequests && (
            <div className="requests-list">
              {joinRequests.length > 0 ? joinRequests.map((req) => (
                <div key={req.id} className="request-card">
                  <div className="request-info">
                    <div className="request-avatar"><Users className="icon" /></div>
                    <div className="request-text">
                      <h4>{req.name}</h4>
                      <p className="request-email">{req.email}</p>
                      <p className="request-message">{req.message}</p>
                      <p className="request-date">Requested on: {req.date}</p>
                    </div>
                  </div>
                  <div className="request-actions">
                    <button className="btn-accept" onClick={() => handleAcceptRequest(req.id)}>Accept</button>
                    <button className="btn-reject" onClick={() => handleRejectRequest(req.id)}>Reject</button>
                  </div>
                </div>
              )) : <p className="empty-note">No pending requests</p>}
            </div>
          )}
        </div>
      )}

      {/* Members List */}
      <div className="section">
        <div className="section-header clickable"
          onClick={() => setShowMembers(p => !p)}
          role="button" tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setShowMembers(p => !p)}>
          <h3><Users className="section-icon" /> Club Members</h3>
          <div className="section-actions">
            <span className="collapse-toggle">
              {showMembers ? <ChevronDown className="icon-sm" /> : <ChevronRight className="icon-sm" />}
            </span>
            {role === 'Coordinator' && (
              <button className="add-btn" onClick={(e) => { e.stopPropagation(); setShowAddMemberModal(true); }}>
                <Plus className="icon-sm" /> Add Member
              </button>
            )}
          </div>
        </div>

        {showMembers && (
          <div className="members-list">
            {members.filter(m => m.role !== 'Request').length > 0
              ? members.filter(m => m.role !== 'Request').map((member, index) => (
                <div key={index} className="member-card">
                  <div className="member-avatar"><Users className="icon" /></div>
                  <div className="member-info">
                    <h4>{member.full_name}</h4>
                    <p className="member-role">{member.role}</p>
                    <p className="member-email">{member.email}</p>
                    <p className="member-join-date">
                      Joined: {member.joined_date ? new Date(member.joined_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <span className="status-badge" style={{ backgroundColor: '#22c55e' }}>active</span>
                </div>
              ))
              : <p>No members found</p>}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="modal-overlay" onClick={() => setShowAddMemberModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><UserPlus className="modal-icon" /> Add New Member</h2>
              <button className="modal-close" onClick={() => setShowAddMemberModal(false)}>
                <X className="icon-sm" />
              </button>
            </div>
            <form onSubmit={handleAddMemberSubmit} className="modal-form">
              <div className="form-group">
                <label>Member Email *</label>
                <input type="email" value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="Enter member's email address" required />
                <p className="form-hint">The user must be registered in the system</p>
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} required>
                  <option value="Member">Member</option>
                  <option value="Coordinator">Coordinator</option>
                </select>
                <p className="form-hint">Coordinators have full management permissions</p>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddMemberModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MembersSection;