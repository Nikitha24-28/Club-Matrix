import React, { useState } from 'react';
import { Megaphone, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': case 'urgent': return '#ef4444';
    case 'medium': return '#f59e0b';
    case 'low': return '#22c55e';
    default: return '#6b7280';
  }
};

const AnnouncementsSection = ({ clubId, role, announcements, onRefresh }) => {
  const [show, setShow] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '', description: '', priority: 'medium'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.description) return;
    try {
      const userEmail = localStorage.getItem('email');
      await axiosInstance.post(`/api/club/${clubId}/announcements`, {
        title: newAnnouncement.title,
        description: newAnnouncement.description,
        priority: newAnnouncement.priority,
        userEmail
      });
      await onRefresh();
      setNewAnnouncement({ title: '', description: '', priority: 'medium' });
      setShowForm(false);
      toast.success('Announcement posted successfully');
    } catch (err) {
      console.error('Error posting announcement:', err);
      toast.error('Failed to post announcement');
    }
  };

  return (
    <div className="section">
      <div className="section-header clickable" onClick={() => setShow(p => !p)}
        role="button" tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setShow(p => !p)}>
        <h3><Megaphone className="section-icon" /> Announcements</h3>
        <div className="section-actions">
          <span className="members-count-badge">{announcements.length}</span>
          <span className="collapse-toggle">
            {show ? <ChevronDown className="icon-sm" /> : <ChevronRight className="icon-sm" />}
          </span>
        </div>
      </div>

      {show && (
        <>
          {role === 'Coordinator' && (
            <div className="section-header clickable" onClick={() => setShowForm(p => !p)}
              role="button" tabIndex={0}>
              <h3><Plus className="section-icon" /> Post Announcement</h3>
              <div className="section-actions">
                <span className="collapse-toggle">
                  {showForm ? <ChevronDown className="icon-sm" /> : <ChevronRight className="icon-sm" />}
                </span>
              </div>
            </div>
          )}

          {role === 'Coordinator' && showForm && (
            <div className="announcement-form">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input type="text" placeholder="Announcement Title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    required />
                </div>
                <div className="form-group">
                  <textarea placeholder="Announcement Content"
                    value={newAnnouncement.description}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                    rows="3" required />
                </div>
                <div className="form-group">
                  <select value={newAnnouncement.priority}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <button type="submit" className="submit-btn">Post Announcement</button>
              </form>
            </div>
          )}

          <div className="announcements-list">
            {announcements.map((a) => (
              <div key={a.id} className="announcement-card">
                <div className="announcement-header">
                  <h4>{a.title}</h4>
                  <span className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(a.priority) }}>
                    {a.priority}
                  </span>
                </div>
                <p className="announcement-content">{a.content}</p>
                <div className="announcement-footer">
                  <span className="author">By {a.author}</span>
                  <span className="date">{a.date}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AnnouncementsSection;