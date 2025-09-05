import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const email = useMemo(() => localStorage.getItem('email') || '', []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!email) {
        setError('No user email found. Please log in again.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        const { data } = await axios.get(`http://localhost:5000/profile/${encodeURIComponent(email)}`);
        setProfile(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [email]);

  const renderClub = (clubId, clubRole, idx) => {
    if (!clubId && !clubRole) return null;
    return (
      <div className="profile-club" key={`club-${idx}`}>
        <div className="profile-club-badge">Club {idx}</div>
        <div className="profile-club-fields">
          <div className="profile-field">
            <span className="label">Club ID</span>
            <span className="value">{clubId || '—'}</span>
          </div>
          <div className="profile-field">
            <span className="label">Role</span>
            <span className="value">{clubRole || '—'}</span>
          </div>
        </div>
      </div>
    );
  };

  const getAvatarInitials = () => {
    const name = profile?.name || email || '';
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  };

  return (
    <div className="profile-container">
      {isLoading && (
        <div className="profile-state">
          <div className="spinner" />
          <p>Loading your profile…</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="profile-state error">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && profile && (
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">{getAvatarInitials()}</div>
            <div className="header-text">
              <h1 className="title">{profile.name || 'User'}</h1>
              <p className="subtitle">{profile.email}</p>
            </div>
            <div className="role-chip">{profile.role}</div>
          </div>

          <div className="profile-grid">
            <div className="profile-section">
              <h2 className="section-title">Account</h2>
              <div className="profile-field">
                <span className="label">User Since</span>
                <span className="value">{new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
              <div className="profile-field">
                <span className="label">Client ID</span>
                <span className="value">{profile.client_id}</span>
              </div>
              <div className="profile-field">
                <span className="label">Registration No.</span>
                <span className="value">{profile.reg_no || '—'}</span>
              </div>
            </div>

            <div className="profile-section">
              <h2 className="section-title">Contact</h2>
              <div className="profile-field">
                <span className="label">Phone</span>
                <span className="value">{profile.phone || '—'}</span>
              </div>
              <div className="profile-field">
                <span className="label">Department</span>
                <span className="value">{profile.department || '—'}</span>
              </div>
              <div className="profile-inline">
                <div className="profile-field">
                  <span className="label">Year</span>
                  <span className="value">{profile.year || '—'}</span>
                </div>
                <div className="profile-field">
                  <span className="label">Section</span>
                  <span className="value">{profile.section || '—'}</span>
                </div>
              </div>
            </div>

            <div className="profile-section full">
              <h2 className="section-title">Club Memberships</h2>
              <div className="profile-clubs">
                {renderClub(profile.club1_id, profile.club1_role, 1)}
                {renderClub(profile.club2_id, profile.club2_role, 2)}
                {renderClub(profile.club3_id, profile.club3_role, 3)}
                {!profile.club1_id && !profile.club2_id && !profile.club3_id && (
                  <div className="profile-empty">Not a member of any clubs yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;