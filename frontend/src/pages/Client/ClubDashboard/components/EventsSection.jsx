import React, { useState } from 'react';
import { Calendar, Plus, ChevronDown, ChevronRight, Clock, X } from 'lucide-react';
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

const EventsSection = ({ clubId, role, events, onRefresh }) => {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '', description: '', start_date: '', end_date: '', priority: 'medium'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userEmail = localStorage.getItem('email');
      await axiosInstance.post(`/api/club/${clubId}/events`, {
        title: newEvent.title,
        description: newEvent.description,
        start_date: newEvent.start_date,
        end_date: newEvent.end_date || newEvent.start_date,
        priority: newEvent.priority,
        userEmail
      });
      await onRefresh();
      setNewEvent({ title: '', description: '', start_date: '', end_date: '', priority: 'medium' });
      setShowModal(false);
      toast.success('Event created successfully');
    } catch (err) {
      console.error('Error creating event:', err);
      toast.error('Failed to create event');
    }
  };

  return (
    <>
      <div className="section">
        <div className="section-header clickable" onClick={() => setExpanded(p => !p)}
          role="button" tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setExpanded(p => !p)}>
          <h3><Calendar className="section-icon" /> Events</h3>
          <div className="section-actions">
            <span className="collapse-toggle">
              {expanded ? <ChevronDown className="icon-sm" /> : <ChevronRight className="icon-sm" />}
            </span>
            {role === 'Coordinator' && (
              <button className="add-btn" onClick={(e) => { e.stopPropagation(); setShowModal(true); }}>
                <Plus className="icon-sm" /> Create Event
              </button>
            )}
          </div>
        </div>

        {expanded && (
          <div className="events-list">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <h4>{event.title}</h4>
                  <span className="status-badge" style={{ backgroundColor: getStatusColor(event.status) }}>
                    {event.status}
                  </span>
                </div>
                {event.description && <p className="event-description">{event.description}</p>}
                <div className="event-details">
                  <div className="event-detail">
                    <Clock className="icon-sm" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  {event.endDate && event.endDate !== event.date && (
                    <div className="event-detail">
                      <span>to {new Date(event.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {events.length === 0 && <p className="empty-note">No events scheduled</p>}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><Calendar className="modal-icon" /> Create New Event</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X className="icon-sm" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Event Title *</label>
                <input type="text" value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Enter event title" required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Enter event description" rows="3" />
              </div>
              <div className="form-group">
                <label>Start Date *</label>
                <input type="date" value={newEvent.start_date}
                  onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
                  required />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" value={newEvent.end_date}
                  onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
                  min={newEvent.start_date} />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={newEvent.priority}
                  onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Create Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EventsSection;