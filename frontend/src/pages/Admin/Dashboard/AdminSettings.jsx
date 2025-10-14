import React, { useState } from 'react';
import './AdminUI.css';

const AdminSettings = () => {
  const [form, setForm] = useState({
    emailNotifications: true,
    weeklyDigest: false,
    defaultPrivacy: 'public',
    approvalAutoAssign: true
  });

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const save = (e) => {
    e.preventDefault();
    // Placeholder: hook up to backend later
    alert('Settings saved');
  };

  return (
    <div className="settings-wrap">
      <form className="settings-card" onSubmit={save}>
        <div className="settings-section">
          <h3>Notifications</h3>
          <label className="setting-row">
            <input type="checkbox" checked={form.emailNotifications} onChange={(e) => update('emailNotifications', e.target.checked)} />
            <span>Email notifications for new approvals</span>
          </label>
          <label className="setting-row">
            <input type="checkbox" checked={form.weeklyDigest} onChange={(e) => update('weeklyDigest', e.target.checked)} />
            <span>Weekly activity digest</span>
          </label>
        </div>

        <div className="settings-section">
          <h3>Defaults</h3>
          <label className="setting-col">
            <span>Default club privacy</span>
            <select value={form.defaultPrivacy} onChange={(e) => update('defaultPrivacy', e.target.value)}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </label>
          <label className="setting-row">
            <input type="checkbox" checked={form.approvalAutoAssign} onChange={(e) => update('approvalAutoAssign', e.target.checked)} />
            <span>Auto-assign approvals to admins</span>
          </label>
        </div>

        <div className="settings-actions">
          <button type="submit" className="btn btn-primary">Save changes</button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;




