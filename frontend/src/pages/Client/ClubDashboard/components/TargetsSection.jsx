import React, { useState } from 'react';
import { Target, Plus, ChevronDown, ChevronRight, X } from 'lucide-react';
import axiosInstance from '../../../../api/axiosInstance';
import { toast } from 'sonner';

const getStatusColor = (status) => {
  switch (status) {
    case 'active': case 'on-track': return '#22c55e';
    case 'upcoming': return '#3b82f6';
    case 'completed': return '#6b7280';
    case 'cancelled': return '#ef4444';
    case 'draft': return '#f59e0b';
    default: return '#6b7280';
  }
};

const TargetsSection = ({ clubId, role, targets, setTargets, onRefresh }) => {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newTarget, setNewTarget] = useState({
    title: '', description: '', end_date: '', priority: 'urgent'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userEmail = localStorage.getItem('email');
      await axiosInstance.post(`/api/club/${clubId}/targets`, {
        title: newTarget.title,
        description: newTarget.description,
        end_date: newTarget.end_date,
        priority: newTarget.priority,
        userEmail
      });
      await onRefresh();
      setNewTarget({ title: '', description: '', end_date: '', priority: 'urgent' });
      setShowModal(false);
      toast.success('Target created successfully');
    } catch (err) {
      console.error('Error creating target:', err);
      toast.error('Failed to create target');
    }
  };

  const handleProgressChange = (targetId, newValue) => {
    setTargets(prev => prev.map(t =>
      t.id === targetId ? { ...t, current: Number(newValue) } : t
    ));
  };

  return (
    <>
      <div className="section">
        <div className="section-header clickable" onClick={() => setExpanded(p => !p)}
          role="button" tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setExpanded(p => !p)}>
          <h3><Target className="section-icon" /> Club Targets</h3>
          <div className="section-actions">
            <span className="collapse-toggle">
              {expanded ? <ChevronDown className="icon-sm" /> : <ChevronRight className="icon-sm" />}
            </span>
            {role === 'Coordinator' && (
              <button className="add-btn" onClick={(e) => { e.stopPropagation(); setShowModal(true); }}>
                <Plus className="icon-sm" /> Set Target
              </button>
            )}
          </div>
        </div>

        {expanded && (
          <div className="targets-list">
            {targets.map((target) => (
              <div key={target.id} className="target-card">
                <div className="target-header">
                  <h4>{target.title}</h4>
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(target.status) }}>
                    {target.status}
                  </span>
                </div>
                {target.description && <p className="target-description">{target.description}</p>}
                {role === 'Coordinator' && (
                  <div className="target-control">
                    <input type="range" min="0" max={target.target}
                      value={Math.min(target.current, target.target)}
                      onChange={(e) => handleProgressChange(target.id, e.target.value)} />
                    <span className="target-control-label">Update progress</span>
                  </div>
                )}
                <div className="target-deadline">
                  Deadline: {new Date(target.deadline).toLocaleDateString()}
                </div>
              </div>
            ))}
            {targets.length === 0 && <p className="empty-note">No active targets</p>}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><Target className="modal-icon" /> Set New Target</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X className="icon-sm" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Target Title *</label>
                <input type="text" value={newTarget.title}
                  onChange={(e) => setNewTarget({ ...newTarget, title: e.target.value })}
                  placeholder="Enter target title" required />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea value={newTarget.description}
                  onChange={(e) => setNewTarget({ ...newTarget, description: e.target.value })}
                  placeholder="Enter target description (include target value)"
                  rows="3" required />
                <p className="form-hint">Tip: Include numbers (e.g., "Recruit 50 new members")</p>
              </div>
              <div className="form-group">
                <label>Deadline *</label>
                <input type="date" value={newTarget.end_date}
                  onChange={(e) => setNewTarget({ ...newTarget, end_date: e.target.value })}
                  required />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={newTarget.priority}
                  onChange={(e) => setNewTarget({ ...newTarget, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Set Target</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TargetsSection;