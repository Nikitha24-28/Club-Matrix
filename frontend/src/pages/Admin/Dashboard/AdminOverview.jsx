import React from 'react';
import './AdminUI.css';

const AdminOverview = () => {
  const cards = [
    { label: 'Pending Approvals', value: '14', delta: '+3 today' },
    { label: 'Active Clubs', value: '128', delta: '+2 this week' },
    { label: 'Events This Month', value: '42', delta: '+5 planned' },
    { label: 'Reports Open', value: '3', delta: '0 new' }
  ];

  const recent = [
    { action: 'Approved', subject: 'Tech Innovators', time: '2m ago' },
    { action: 'Rejected', subject: 'Spam Club 123', time: '15m ago' },
    { action: 'Created event', subject: 'Photography Fans', time: '1h ago' },
    { action: 'Unblocked', subject: 'Gaming Masters', time: '2h ago' }
  ];

  const approvals = [
    { name: 'Tech Innovators', owner: 'anita@college.edu', type: 'Public' },
    { name: 'Photography Fans', owner: 'mark@college.edu', type: 'Private' },
    { name: 'Gaming Masters', owner: 'jules@college.edu', type: 'Public' }
  ];

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div>
        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1.25rem' }}>Admin Overview</h2>
        <p style={{ margin: 0, color: '#6c757d' }}>Monitor clubs, approvals, and activity at a glance</p>
      </div>

      <div className="overview-grid">
        {cards.map((c) => (
          <div key={c.label} className="overview-card">
            <span className="label">{c.label}</span>
            <span className="value">{c.value}</span>
            <span className="delta">{c.delta}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
        <div className="approval-list">
          <div className="approval-row header">
            <span>Club</span>
            <span>Owner</span>
            <span>Type</span>
            <span>Actions</span>
          </div>
          {approvals.map((r) => (
            <div className="approval-row" key={r.name}>
              <span>{r.name}</span>
              <span>{r.owner}</span>
              <span>{r.type}</span>
              <div className="approval-actions">
                <button className="btn btn-primary">Approve</button>
                <button className="btn btn-danger">Reject</button>
              </div>
            </div>
          ))}
        </div>

        <div className="settings-card">
          <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '1rem' }}>Recent Activity</h3>
          <div style={{ display: 'grid', gap: '0.6rem', marginTop: '0.6rem' }}>
            {recent.map((a, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: '#2c3e50' }}>
                <span>{a.action} • {a.subject}</span>
                <span style={{ color: '#6c757d' }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;


