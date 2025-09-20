import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Settings,
  BarChart3,
  Activity,
  Star,
  MessageSquare
} from 'lucide-react';
import './ClubDashboard.css';

const ClubDashboard = () => {
  const { clubId } = useParams();
  const [clubInfo, setClubInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState('member');
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium'
  });
  const [momFiles, setMomFiles] = useState([]);
  const [events, setEvents] = useState([]);
  const [targets, setTargets] = useState([]);
  const [members, setMembers] = useState([]);

  // Fetch club information based on clubId
  useEffect(() => {
    const fetchClubInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userEmail = localStorage.getItem('email');
        const response = await axios.get(`http://localhost:5000/club/${clubId}?email=${userEmail}`);
        
        const data = response.data;
        
        // Set club information
        setClubInfo({
          id: data.club_id,
          name: data.club_name,
          description: data.description,
          category: data.category,
          memberCount: data.member_count,
          foundedDate: data.founded_date,
          clubHead: data.club_head,
          email: data.email,
          socialMedia: data.social_media,
          website: data.website,
          logoUrl: data.logo_url,
          visibility: data.visibility,
          status: data.status
        });

        // Set user role
        setRole(data.userRole || 'member');

        // Set members
        setMembers(data.members || []);

        // Set mock announcements (since no announcements table exists)
        setAnnouncements([
          {
            id: 1,
            title: "Welcome to " + data.club_name,
            content: "Welcome to our club! We're excited to have you as a member.",
            author: data.club_head || "Club Head",
            date: new Date().toISOString().split('T')[0],
            priority: "high"
          },
          {
            id: 2,
            title: "Club Meeting Schedule",
            content: "Our regular club meetings are held every Friday at 3 PM.",
            author: data.club_head || "Club Head",
            date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
            priority: "medium"
          }
        ]);

        // Set mock events (since no events table exists)
        setEvents([
          {
            id: 1,
            title: "Club Introduction Session",
            date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], // Next week
            time: "2:00 PM",
            location: "Main Hall",
            attendees: data.totalMembers || 0,
            status: "upcoming"
          },
          {
            id: 2,
            title: "Monthly Club Gathering",
            date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], // Next month
            time: "10:00 AM",
            location: "Club Room",
            attendees: data.totalMembers || 0,
            status: "upcoming"
          }
        ]);

        // Set mock targets for now (you can create a targets table later)
        setTargets([
          {
            id: 1,
            title: "Member Growth",
            current: data.totalMembers || 0,
            target: Math.max((data.totalMembers || 0) + 10, 20),
            unit: "members",
            deadline: "2024-12-31",
            status: "on-track"
          },
          {
            id: 2,
            title: "Club Activities",
            current: 2, // Mock events count
            target: 12,
            unit: "activities",
            deadline: "2024-12-31",
            status: "on-track"
          }
        ]);

        // Set mock MoM files for now (you can create a files table later)
        setMomFiles([
          {
            id: 1,
            name: "Meeting Minutes - Recent",
            date: new Date().toISOString().split('T')[0],
            size: "2.3 MB",
            type: "PDF"
          }
        ]);

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

  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    if (newAnnouncement.title && newAnnouncement.content) {
      const announcement = {
        id: announcements.length + 1,
        ...newAnnouncement,
        author: "Current User",
        date: new Date().toISOString().split('T')[0]
      };
      setAnnouncements([announcement, ...announcements]);
      setNewAnnouncement({ title: '', content: '', priority: 'medium' });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newFile = {
        id: momFiles.length + 1,
        name: file.name,
        date: new Date().toISOString().split('T')[0],
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        type: file.type.split('/')[1].toUpperCase()
      };
      setMomFiles([newFile, ...momFiles]);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#22c55e';
      case 'on-track': return '#22c55e';
      case 'upcoming': return '#3b82f6';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
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
          {role === 'coordinator' ? 'Coordinator' : 'Member'}
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
              <div className="stat-value">{events.length}</div>
              <div className="stat-label">Upcoming Events</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Target className="icon" />
            </div>
            <div className="stat-content">
              <div className="stat-value">{targets.length}</div>
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
            <div className="section-header">
              <h3>
                <Megaphone className="section-icon" />
                Announcements
              </h3>
              {role === 'coordinator' && (
                <button className="add-btn">
                  <Plus className="icon-sm" />
                  Make Announcement
                </button>
              )}
            </div>
            
            {role === 'coordinator' && (
              <div className="announcement-form">
                <form onSubmit={handleAnnouncementSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Announcement Title"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      placeholder="Announcement Content"
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                      rows="3"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <select
                      value={newAnnouncement.priority}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}
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
          </div>

          {/* MoMs Section */}
          <div className="section">
            <div className="section-header">
              <h3>
                <FileText className="section-icon" />
                Minutes of Meetings (MoMs)
              </h3>
              {role === 'coordinator' && (
                <label className="upload-btn">
                  <Upload className="icon-sm" />
                  Upload MoM
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
            
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
                  <button className="view-btn">
                    <Eye className="icon-sm" />
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Events Section */}
          <div className="section">
            <div className="section-header">
              <h3>
                <Calendar className="section-icon" />
                Events
              </h3>
              {role === 'coordinator' && (
                <button className="add-btn">
                  <Plus className="icon-sm" />
                  Create Event
                </button>
              )}
            </div>
            
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
                  <div className="event-details">
                    <div className="event-detail">
                      <Clock className="icon-sm" />
                      <span>{event.date} at {event.time}</span>
                    </div>
                    <div className="event-detail">
                      <Users className="icon-sm" />
                      <span>{event.attendees} attendees</span>
                    </div>
                    <div className="event-detail">
                      <span>📍 {event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Targets Section */}
          <div className="section">
            <div className="section-header">
              <h3>
                <Target className="section-icon" />
                Club Targets
              </h3>
              {role === 'coordinator' && (
                <button className="add-btn">
                  <Plus className="icon-sm" />
                  Set Target
                </button>
              )}
            </div>
            
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
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${(target.current / target.target) * 100}%`,
                        backgroundColor: target.current >= target.target ? '#22c55e' : '#3b82f6'
                      }}
                    />
                  </div>
                  <div className="target-stats">
                    <span className="current">{target.current}</span>
                    <span className="separator">/</span>
                    <span className="target">{target.target} {target.unit}</span>
                  </div>
                  <div className="target-deadline">
                    Deadline: {target.deadline}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Members Section */}
          <div className="section">
            <div className="section-header">
              <h3>
                <Users className="section-icon" />
                Club Members
              </h3>
              {role === 'coordinator' && (
                <button className="add-btn">
                  <UserPlus className="icon-sm" />
                  Add Member
                </button>
              )}
            </div>
            
            <div className="members-list">
              {members.length > 0 ? (
                members.map((member, index) => (
                  <div key={index} className="member-card">
                    <div className="member-avatar">
                      <Users className="icon" />
                    </div>
                    <div className="member-info">
                      <h4>{member.full_name}</h4>
                      <p className="member-role">{member.role}</p>
                      <p className="member-email">{member.mail}</p>
                      <p className="member-join-date">Joined: {member.joined_date ? new Date(member.joined_date).toLocaleDateString() : 'N/A'}</p>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDashboard;

