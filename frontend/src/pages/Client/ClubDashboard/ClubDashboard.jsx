import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Users,
  Calendar,
  Target,
  FileText,
  Megaphone,
  Upload,
  Eye,
  Plus,
  Clock,
  UserPlus,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';
import './ClubDashboard.css';

const ClubDashboard = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [clubInfo, setClubInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState('member');
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [momFiles, setMomFiles] = useState([]);
  const [events, setEvents] = useState([]);
  const [targets, setTargets] = useState([]);
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [expandEvents, setExpandEvents] = useState(false);
  const [expandTargets, setExpandTargets] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [expandMoms, setExpandMoms] = useState(false);
  const [showJoinRequests, setShowJoinRequests] = useState(true);
  const [joinRequests, setJoinRequests] = useState([]);
  
  // Modal states
  const [showEventModal, setShowEventModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    priority: 'medium',
    visibility: 'club_members'
  });
  const [newTarget, setNewTarget] = useState({
    title: '',
    description: '',
    end_date: '',
    priority: 'urgent',
    visibility: 'officers_only'
  });

  useEffect(() => {
    if (clubId) localStorage.setItem("ClubId", clubId);
  }, [clubId]);

  // Fetch club information
  useEffect(() => {
    const fetchClubInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        const userEmail = localStorage.getItem('email');
        const response = await axios.get(`http://localhost:5000/club/${clubId}?email=${userEmail}`);
        const data = response.data;

        setClubInfo({
          id: data.club_id,
          name: data.club_name,
          description: data.description,
          category: data.category,
          memberCount: data.member_count,
          foundedDate: data.founded_date,
          clubHead: data.club_head,
          email: data.club_email,
          socialMedia: data.social_media,
          website: data.website,
          logoUrl: data.logo_url,
          visibility: data.visibility,
          status: data.status
        });

        setRole(data.userRole || 'member');
        console.log("Fetched role:", data.userRole);

        setMembers(data.members || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching club info:', error);
        setError('Failed to load club information');
        setLoading(false);
      }
    };

    if (clubId) {
      fetchClubInfo();
    }
  }, [clubId]);

  // Fetch announcements from database
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/club/${clubId}/announcements`);
        const dbAnnouncements = response.data.map(item => ({
          id: item.item_id,
          title: item.title,
          content: item.description,
          author: item.author_name || 'Club Admin',
          date: new Date(item.created_at).toISOString().split('T')[0],
          priority: item.priority,
          status: item.status
        }));
        setAnnouncements(dbAnnouncements);
        console.log('✅ Loaded announcements:', dbAnnouncements.length);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    if (clubId) {
      fetchAnnouncements();
    }
  }, [clubId]);

  // Fetch events from database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/club/${clubId}/events`);
        const dbEvents = response.data.map(item => ({
          id: item.item_id,
          title: item.title,
          description: item.description,
          date: item.start_date,
          endDate: item.end_date,
          time: '2:00 PM',
          location: 'TBA',
          attendees: 0,
          status: item.status,
          priority: item.priority
        }));
        setEvents(dbEvents);
        console.log('✅ Loaded events:', dbEvents.length);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    if (clubId) {
      fetchEvents();
    }
  }, [clubId]);

  // Fetch targets from database
  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/club/${clubId}/targets`);
        const dbTargets = response.data.map(item => {
          const match = item.description.match(/(\d+)/g);
          const targetValue = match ? parseInt(match[match.length - 1]) : 100;
          
          return {
            id: item.item_id,
            title: item.title,
            current: 0,
            target: targetValue,
            unit: 'units',
            deadline: item.end_date,
            status: item.status,
            priority: item.priority,
            description: item.description
          };
        });
        setTargets(dbTargets);
        console.log('✅ Loaded targets:', dbTargets.length);
      } catch (error) {
        console.error('Error fetching targets:', error);
      }
    };

    if (clubId) {
      fetchTargets();
    }
  }, [clubId]);

  // Fetch MoMs from database
  useEffect(() => {
    const fetchMoms = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/moms/${clubId}`);
        const dbMoms = response.data.map(mom => ({
          id: mom.mom_id,
          name: mom.meeting_title,
          date: new Date(mom.meeting_date).toISOString().split('T')[0],
          size: '2.3 MB',
          type: 'MoM'
        }));
        setMomFiles(dbMoms);
        console.log('✅ Loaded MoMs:', dbMoms.length);
      } catch (error) {
        console.error('Error fetching MoMs:', error);
      }
    };

    if (clubId) {
      fetchMoms();
    }
  }, [clubId]);

  // Fetch join requests from database
  useEffect(() => {
    const fetchJoinRequests = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/club/${clubId}/join-requests`);
        const dbRequests = response.data.map(req => ({
          id: req.client_id,
          name: req.full_name,
          email: req.email,
          message: req.request_reason || 'No message provided',
          date: new Date(req.joined_at).toISOString().split('T')[0]
        }));
        setJoinRequests(dbRequests);
        console.log('✅ Loaded join requests:', dbRequests.length);
      } catch (error) {
        console.error('Error fetching join requests:', error);
      }
    };

    if (clubId && role === 'Coordinator') {
      fetchJoinRequests();
    }
  }, [clubId, role]);

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    if (newAnnouncement.title && newAnnouncement.description) {
      try {
        const userEmail = localStorage.getItem('email');
        await axios.post(`http://localhost:5000/api/club/${clubId}/announcements`, {
          title: newAnnouncement.title,
          description: newAnnouncement.description,
          priority: newAnnouncement.priority,
          visibility: 'club_members',
          userEmail
        });

        const response = await axios.get(`http://localhost:5000/api/club/${clubId}/announcements`);
        const dbAnnouncements = response.data.map(item => ({
          id: item.item_id,
          title: item.title,
          content: item.description,
          author: item.author_name || 'Club Admin',
          date: new Date(item.created_at).toISOString().split('T')[0],
          priority: item.priority,
          status: item.status
        }));
        setAnnouncements(dbAnnouncements);

        setNewAnnouncement({ title: '', description: '', priority: 'medium' });
        setShowAnnouncementForm(false);
        console.log('✅ Announcement posted successfully');
      } catch (error) {
        console.error('Error posting announcement:', error);
        alert('Failed to post announcement');
      }
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const userEmail = localStorage.getItem('email');
      await axios.post(`http://localhost:5000/api/club/${clubId}/events`, {
        title: newEvent.title,
        description: newEvent.description,
        start_date: newEvent.start_date,
        end_date: newEvent.end_date || newEvent.start_date,
        priority: newEvent.priority,
        visibility: newEvent.visibility,
        userEmail
      });

      // Refresh events
      const response = await axios.get(`http://localhost:5000/api/club/${clubId}/events`);
      const dbEvents = response.data.map(item => ({
        id: item.item_id,
        title: item.title,
        description: item.description,
        date: item.start_date,
        endDate: item.end_date,
        time: '2:00 PM',
        location: 'TBA',
        attendees: 0,
        status: item.status,
        priority: item.priority
      }));
      setEvents(dbEvents);

      // Reset form and close modal
      setNewEvent({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        priority: 'medium',
        visibility: 'club_members'
      });
      setShowEventModal(false);
      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    }
  };

  const handleTargetSubmit = async (e) => {
    e.preventDefault();
    try {
      const userEmail = localStorage.getItem('email');
      await axios.post(`http://localhost:5000/api/club/${clubId}/targets`, {
        title: newTarget.title,
        description: newTarget.description,
        end_date: newTarget.end_date,
        priority: newTarget.priority,
        visibility: newTarget.visibility,
        userEmail
      });

      // Refresh targets
      const response = await axios.get(`http://localhost:5000/api/club/${clubId}/targets`);
      const dbTargets = response.data.map(item => {
        const match = item.description.match(/(\d+)/g);
        const targetValue = match ? parseInt(match[match.length - 1]) : 100;
        
        return {
          id: item.item_id,
          title: item.title,
          current: 0,
          target: targetValue,
          unit: 'units',
          deadline: item.end_date,
          status: item.status,
          priority: item.priority,
          description: item.description
        };
      });
      setTargets(dbTargets);

      // Reset form and close modal
      setNewTarget({
        title: '',
        description: '',
        end_date: '',
        priority: 'urgent',
        visibility: 'officers_only'
      });
      setShowTargetModal(false);
      alert('Target created successfully!');
    } catch (error) {
      console.error('Error creating target:', error);
      alert('Failed to create target');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#22c55e';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'on-track':
        return '#22c55e';
      case 'upcoming':
        return '#3b82f6';
      case 'completed':
        return '#6b7280';
      case 'cancelled':
        return '#ef4444';
      case 'draft':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const toggleMemberDropdown = () => setShowMembers((prev) => !prev);
  const toggleEvents = () => setExpandEvents((prev) => !prev);
  const toggleTargets = () => setExpandTargets((prev) => !prev);
  const toggleJoinRequests = () => setShowJoinRequests((prev) => !prev);
  const toggleAnnouncements = () => setShowAnnouncements((prev) => !prev);
  const toggleAnnouncementForm = () => setShowAnnouncementForm((prev) => !prev);
  const toggleMoms = () => setExpandMoms((prev) => !prev);

  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.post(`http://localhost:5000/api/club/${clubId}/join-requests/${requestId}/accept`);
      setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
      
      const userEmail = localStorage.getItem('email');
      const response = await axios.get(`http://localhost:5000/club/${clubId}?email=${userEmail}`);
      setMembers(response.data.members || []);
      setClubInfo(prev => ({ ...prev, memberCount: (prev.memberCount || 0) + 1 }));
      
      console.log('✅ Request accepted successfully');
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await axios.delete(`http://localhost:5000/api/club/${clubId}/join-requests/${requestId}/reject`);
      setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
      console.log('✅ Request rejected successfully');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request');
    }
  };

  const handleTargetProgressChange = (targetId, newValue) => {
    setTargets((prev) => prev.map((t) => (
      t.id === targetId ? { ...t, current: Number(newValue) } : t
    )));
  };

  if (loading) {
    return (
      <div className="club-dashboard">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Loading...</h1>
            <p className="header-subtitle">Fetching club information</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="club-dashboard">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Error</h1>
            <p className="header-subtitle">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!clubInfo) {
    return (
      <div className="club-dashboard">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Club Not Found</h1>
            <p className="header-subtitle">The requested club could not be found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="club-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>{clubInfo?.name || 'Club Dashboard'}</h1>
          <p className="header-subtitle">Manage your club activities and stay updated</p>
        </div>
        <div className="role-badge">
          {role === 'Coordinator' ? 'Coordinator' : 'Member'}
        </div>
      </div>

      {/* Club Statistics */}
      <div className="stats-section">
        <h2>Club Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Users className="icon" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{clubInfo.memberCount || members.length}</div>
              <div className="stat-label">Total Members</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Calendar className="icon" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{events.filter(e => e.status === 'active').length}</div>
              <div className="stat-label">Upcoming Events</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Target className="icon" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{targets.filter(t => t.status === 'active').length}</div>
              <div className="stat-label">Active Targets</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FileText className="icon" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{momFiles.length}</div>
              <div className="stat-label">MoM Files</div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Left Column */}
        <div className="left-column">
          {/* Announcements Section */}
          <div className="section">
            <div
              className="section-header clickable"
              onClick={toggleAnnouncements}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleAnnouncements()}
            >
              <h3>
                <Megaphone className="section-icon" />
                Announcements
              </h3>
              <div className="section-actions">
                <span className="members-count-badge">{announcements.length}</span>
                <span className="collapse-toggle">
                  {showAnnouncements ? <ChevronDown className="icon-sm" /> : <ChevronRight className="icon-sm" />}
                </span>
              </div>
            </div>

            {showAnnouncements && (
            <>
              {role === 'Coordinator' && (
                <div className="section-header clickable" onClick={toggleAnnouncementForm} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleAnnouncementForm()}>
                  <h3>
                    <Plus className="section-icon" />
                    Post Announcement
                  </h3>
                  <div className="section-actions">
                    <span className="collapse-toggle">
                      {showAnnouncementForm ? <ChevronDown className="icon-sm" /> : <ChevronRight className="icon-sm" />}
                    </span>
                  </div>
                </div>
              )}

              {role === 'Coordinator' && showAnnouncementForm && (
                <div className="announcement-form">
                  <form onSubmit={handleAnnouncementSubmit}>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Announcement Title"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <textarea
                        placeholder="Announcement Content"
                        value={newAnnouncement.description}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                        rows="3"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <select
                        value={newAnnouncement.priority}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                      >
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
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="announcement-card">
                    <div className="announcement-header">
                      <h4>{announcement.title}</h4>
                      <span
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(announcement.priority) }}
                      >
                        {announcement.priority}
                      </span>
                    </div>
                    <p className="announcement-content">{announcement.content}</p>
                    <div className="announcement-footer">
                      <span className="author">By {announcement.author}</span>
                      <span className="date">{announcement.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
            )}
          </div>

          {/* MoMs Section */}
          <div className="section">
            <div className="section-header clickable" onClick={toggleMoms} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleMoms()}>
              <h3>
                <FileText className="section-icon" />
                Minutes of Meetings (MoMs)
              </h3>
              <div className="section-actions">
                <span className="members-count-badge">{momFiles.length}</span>
                <span className="collapse-toggle">
                  {expandMoms ? <ChevronDown className="icon-sm" /> : <ChevronRight className="icon-sm" />}
                </span>
                <button
                  className="add-btn"
                  onClick={() => navigate(`/ClubDashboard/${clubId}/mom`)}
                >
                  <Eye className="icon-sm" />
                  View All MoMs
                </button>
              </div>
            </div>

            {expandMoms && (
            <div className="mom-files">
              {momFiles.map((file) => (
                <div key={file.id} className="file-card">
                  <div className="file-icon">
                    <FileText className="icon" />
                  </div>
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

          {/* Join Requests - Coordinator only */}
          {role === 'Coordinator' && (
          <div className="section">
            <div
              className="section-header clickable"
              onClick={toggleJoinRequests}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleJoinRequests()}
            >
              <h3>
                <UserPlus className="section-icon" />
                Join Requests
              </h3>
              <div className="section-actions">
                <span className="requests-count-badge">{joinRequests.length}</span>
                <span className="collapse-toggle">
                  {showJoinRequests ? <ChevronDown className="icon-sm" /> : <ChevronRight className="icon-sm" />}
                </span>
              </div>
            </div>

            {showJoinRequests && (
            <div className="requests-list">
              {joinRequests.length > 0 ? (
                joinRequests.map((req) => (
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
                ))
              ) : (
                <p className="empty-note">No pending requests</p>
              )}
            </div>
            )}
          </div>
          )}
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Events Section */}
          <div className="section">
            <div className="section-header clickable" onClick={toggleEvents} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleEvents()}>
              <h3>
                <Calendar className="section-icon" />
                Events
              </h3>
              <div className="section-actions">
                <span className="collapse-toggle">
                  {expandEvents ? <ChevronDown className="icon-sm" /> : <ChevronRight className="icon-sm" />}
                </span>
              {role === 'Coordinator' && (
                <button className="add-btn" onClick={() => setShowEventModal(true)}>
                  <Plus className="icon-sm" />
                  Create Event
                </button>
              )}
              </div>
            </div>

            {expandEvents && (
            <div className="events-list">
              {events.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-header">
                    <h4>{event.title}</h4>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(event.status) }}
                    >
                      {event.status}
                    </span>
                  </div>
                  {event.description && (
                    <p className="event-description">{event.description}</p>
                  )}
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
              {events.length === 0 && (
                <p className="empty-note">No events scheduled</p>
              )}
            </div>
            )}
          </div>

          {/* Targets Section */}
          <div className="section">
            <div className="section-header clickable" onClick={toggleTargets} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleTargets()}>
              <h3>
                <Target className="section-icon" />
                Club Targets
              </h3>
              <div className="section-actions">
                <span className="collapse-toggle">
                  {expandTargets ? <ChevronDown className="icon-sm" /> : <ChevronRight className="icon-sm" />}
                </span>
                {role === 'Coordinator' && (
                  <button className="add-btn" onClick={() => setShowTargetModal(true)}>
                    <Plus className="icon-sm" />
                    Set Target
                  </button>
                )}
              </div>
            </div>

            {expandTargets && (
            <div className="targets-list">
              {targets.map((target) => (
                <div key={target.id} className="target-card">
                  <div className="target-header">
                    <h4>{target.title}</h4>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(target.status) }}
                    >
                      {target.status}
                    </span>
                  </div>
                  {target.description && (
                    <p className="target-description">{target.description}</p>
                  )}
                  
                  {role === 'Coordinator' && (
                    <div className="target-control">
                      <input
                        type="range"
                        min="0"
                        max={target.target}
                        value={Math.min(target.current, target.target)}
                        onChange={(e) => handleTargetProgressChange(target.id, e.target.value)}
                      />
                      <span className="target-control-label">Update progress</span>
                    </div>
                  )}
                  
                  <div className="target-deadline">
                    Deadline: {new Date(target.deadline).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {targets.length === 0 && (
                <p className="empty-note">No active targets</p>
              )}
            </div>
            )}
          </div>

          {/* Members Section */}
          <div className="section">
            <div className="section-header clickable" onClick={toggleMemberDropdown} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleMemberDropdown()}>
              <h3>
                <Users className="section-icon" />
                Club Members
              </h3>
              <div className="section-actions">
                <span className="collapse-toggle">
                  {showMembers ? <ChevronDown className="icon-sm" /> : <ChevronRight className="icon-sm" />}
                </span>
              </div>
            </div>

            {showMembers && (
            <div className="members-list">
              {members.filter(member => member.role !== 'Request').length > 0 ? (
                members
                  .filter(member => member.role !== 'Request')
                  .map((member, index) => (
                    <div key={index} className="member-card">
                      <div className="member-avatar">
                        <Users className="icon" />
                      </div>
                      <div className="member-info">
                        <h4>{member.full_name}</h4>
                        <p className="member-role">{member.role}</p>
                        <p className="member-email">{member.email}</p>
                        <p className="member-join-date">
                          Joined: {member.joined_date ? new Date(member.joined_date).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor('active') }}
                      >
                        active
                      </span>
                    </div>
                  ))
              ) : (
                <p>No members found</p>
              )}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <Calendar className="modal-icon" />
                Create New Event
              </h2>
              <button className="modal-close" onClick={() => setShowEventModal(false)}>
                <X className="icon-sm" />
              </button>
            </div>

            <form onSubmit={handleEventSubmit} className="modal-form">
              <div className="form-group">
                <label>Event Title *</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Enter event description"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  value={newEvent.start_date}
                  onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={newEvent.end_date}
                  onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
                  min={newEvent.start_date}
                />
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  value={newEvent.priority}
                  onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="form-group">
                <label>Visibility</label>
                <select
                  value={newEvent.visibility}
                  onChange={(e) => setNewEvent({ ...newEvent, visibility: e.target.value })}
                >
                  <option value="public">Public</option>
                  <option value="club_members">Club Members</option>
                  <option value="officers_only">Officers Only</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowEventModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Target Modal */}
      {showTargetModal && (
        <div className="modal-overlay" onClick={() => setShowTargetModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <Target className="modal-icon" />
                Set New Target
              </h2>
              <button className="modal-close" onClick={() => setShowTargetModal(false)}>
                <X className="icon-sm" />
              </button>
            </div>

            <form onSubmit={handleTargetSubmit} className="modal-form">
              <div className="form-group">
                <label>Target Title *</label>
                <input
                  type="text"
                  value={newTarget.title}
                  onChange={(e) => setNewTarget({ ...newTarget, title: e.target.value })}
                  placeholder="Enter target title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={newTarget.description}
                  onChange={(e) => setNewTarget({ ...newTarget, description: e.target.value })}
                  placeholder="Enter target description (include target value)"
                  rows="3"
                  required
                />
                <p className="form-hint">
                  Tip: Include numbers in your description (e.g., "Recruit 50 new members")
                </p>
              </div>

              <div className="form-group">
                <label>Deadline *</label>
                <input
                  type="date"
                  value={newTarget.end_date}
                  onChange={(e) => setNewTarget({ ...newTarget, end_date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  value={newTarget.priority}
                  onChange={(e) => setNewTarget({ ...newTarget, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="form-group">
                <label>Visibility</label>
                <select
                  value={newTarget.visibility}
                  onChange={(e) => setNewTarget({ ...newTarget, visibility: e.target.value })}
                >
                  <option value="public">Public</option>
                  <option value="club_members">Club Members</option>
                  <option value="officers_only">Officers Only</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowTargetModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Set Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubDashboard;