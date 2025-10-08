import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './MoM.css';

const MoM = () => {
  // Get clubId from URL params OR localStorage as fallback
  const { clubId: urlClubId } = useParams();
  const [clubId, setClubId] = useState(urlClubId || localStorage.getItem("ClubId"));
  const [isResolvingClubId, setIsResolvingClubId] = useState(false);
  const [userRole, setUserRole] = useState(null); // ✅ Track user role
  
  const API_BASE_URL = 'http://localhost:5000/api';
  
  const [momList, setMomList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMoM, setSelectedMoM] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expanded, setExpanded] = useState({});

  const [newMoM, setNewMoM] = useState({
    club_id: clubId,
    meeting_title: '',
    meeting_date: '',
    start_time: '',
    end_time: '',
    location: '',
    organizer_email: '',
    attendees: '',
    agenda: '',
    discussions: '',
    decisions: '',
    action_items: '',
    notes: '',
    file: null
  });

  // ✅ First useEffect: Resolve club_id if it's a club name
  useEffect(() => {
    const resolveClubId = async () => {
      const currentClubId = urlClubId || localStorage.getItem("ClubId");
      console.log('Initial clubId:', currentClubId);
      
      // Check if clubId is numeric
      if (currentClubId && !isNaN(currentClubId)) {
        console.log('✅ ClubId is already numeric:', currentClubId);
        setClubId(currentClubId);
        return;
      }
      
      // If it's not numeric, fetch the numeric ID using club name
      if (currentClubId) {
        console.log('🔄 ClubId is a name, fetching numeric ID for:', currentClubId);
        setIsResolvingClubId(true);
        
        try {
          const response = await fetch(`http://localhost:5000/api/club/id/${encodeURIComponent(currentClubId)}`);
          if (!response.ok) {
            throw new Error('Failed to resolve club ID');
          }
          
          const data = await response.json();
          console.log('✅ Resolved club_id:', data.club_id);
          setClubId(data.club_id);
          localStorage.setItem("ClubId", data.club_id); // Store numeric ID
        } catch (err) {
          console.error('❌ Error resolving club ID:', err);
          setError('Could not resolve club ID. Please navigate from club dashboard.');
        } finally {
          setIsResolvingClubId(false);
        }
      }
    };
    
    resolveClubId();
  }, [urlClubId]);

  // ✅ Second useEffect: Fetch MoMs once we have numeric clubId
  useEffect(() => {
    if (!clubId || isResolvingClubId) {
      return;
    }
    
    // Ensure clubId is numeric before fetching
    if (isNaN(clubId)) {
      console.error('❌ ClubId is still not numeric:', clubId);
      setError('Invalid club ID format');
      setLoading(false);
      return;
    }
    
    console.log('📍 Fetching MoMs for numeric club_id:', clubId);
    fetchMoMs();
    fetchUserRole(); // ✅ Fetch user role
  }, [clubId, isResolvingClubId]);

  // ✅ Function to fetch user's role in this club
  const fetchUserRole = async () => {
    try {
      const userEmail = localStorage.getItem('email');
      if (!userEmail) {
        console.log('No user email found');
        return;
      }

      const response = await fetch(`http://localhost:5000/club/${clubId}?email=${userEmail}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user role');
      }

      const data = await response.json();
      console.log('User role:', data.userRole);
      setUserRole(data.userRole);
    } catch (err) {
      console.error('Error fetching user role:', err);
      // Don't set error, just continue without role (treat as member)
      setUserRole('Member');
    }
  };

  const fetchMoMs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Making fetch request to:', `${API_BASE_URL}/moms/${clubId}`);
      const response = await fetch(`${API_BASE_URL}/moms/${clubId}`);
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch MoMs: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Raw data from backend:', data);
      console.log('Number of MoMs received:', data.length);
      
      // Parse JSON fields if they're stored as strings
      const parsedData = data.map(mom => {
        let attendees = [];
        let action_items = [];
        
        // Parse attendees
        try {
          if (typeof mom.attendees === 'string' && mom.attendees) {
            attendees = JSON.parse(mom.attendees);
          } else if (Array.isArray(mom.attendees)) {
            attendees = mom.attendees;
          }
        } catch (e) {
          console.error('Error parsing attendees for MoM', mom.mom_id, e);
          attendees = [];
        }
        
        // Parse action_items
        try {
          if (typeof mom.action_items === 'string' && mom.action_items) {
            action_items = JSON.parse(mom.action_items);
          } else if (Array.isArray(mom.action_items)) {
            action_items = mom.action_items;
          }
        } catch (e) {
          console.error('Error parsing action_items for MoM', mom.mom_id, e);
          action_items = [];
        }
        
        return {
          ...mom,
          attendees,
          action_items
        };
      });
      
      console.log('Parsed data:', parsedData);
      setMomList(parsedData);
    } catch (err) {
      console.error('Error fetching MoMs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setNewMoM(prev => ({ ...prev, [field]: value }));
  };

  const handleAddMoM = async () => {
    if (!newMoM.meeting_title.trim() || !newMoM.meeting_date.trim()) {
      alert('Please fill in all required fields (Meeting Title and Date)');
      return;
    }

    try {
      const attendeesList = newMoM.attendees
        .split(',')
        .map(name => name.trim())
        .filter(name => name);

      const actionItemsList = newMoM.action_items
        .split('\n')
        .map(item => item.trim())
        .filter(item => item);

      const momData = {
        club_id: clubId,
        meeting_title: newMoM.meeting_title,
        meeting_date: newMoM.meeting_date,
        start_time: newMoM.start_time || null,
        end_time: newMoM.end_time || null,
        location: newMoM.location || null,
        organizer_email: newMoM.organizer_email || null,
        attendees: JSON.stringify(attendeesList),
        agenda: newMoM.agenda || null,
        discussions: newMoM.discussions || null,
        decisions: newMoM.decisions || null,
        action_items: JSON.stringify(actionItemsList),
        notes: newMoM.notes || null
      };

      console.log('Sending MoM data:', momData);

      const response = await fetch(`${API_BASE_URL}/moms/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(momData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error adding MoM:', errorText);
        throw new Error('Failed to add MoM');
      }

      const result = await response.json();
      console.log('MoM added successfully:', result);
      alert('MoM added successfully!');
      
      // Refresh the list
      await fetchMoMs();

      // Reset form
      setNewMoM({
        club_id: clubId,
        meeting_title: '',
        meeting_date: '',
        start_time: '',
        end_time: '',
        location: '',
        organizer_email: '',
        attendees: '',
        agenda: '',
        discussions: '',
        decisions: '',
        action_items: '',
        notes: '',
        file: null
      });

      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding MoM:', err);
      alert('Failed to add MoM. Please try again.');
    }
  };

  const handleDeleteMoM = async (momId) => {
    if (!window.confirm('Are you sure you want to delete this MoM?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/mom/${momId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete MoM');
      }

      alert('MoM deleted successfully!');
      await fetchMoMs();
    } catch (err) {
      console.error('Error deleting MoM:', err);
      alert('Failed to delete MoM. Please try again.');
    }
  };

  const handleViewMoM = (mom) => {
    setSelectedMoM(mom);
    setShowViewModal(true);
  };

  const handleDownload = (mom) => {
    const link = document.createElement('a');
    link.href = mom.fileUrl || '#';
    link.download = `${mom.meeting_title.replace(/\s+/g, '_')}_${mom.meeting_date}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAndSortedMoMs = momList
    .filter(mom =>
      mom.meeting_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mom.agenda && mom.agenda.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (mom.notes && mom.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'date') {
        comparison = new Date(a.meeting_date) - new Date(b.meeting_date);
      } else if (sortBy === 'title') {
        comparison = a.meeting_title.localeCompare(b.meeting_title);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleExpanded = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading || isResolvingClubId) {
    return (
      <div className="mom-container">
        <div className="loading-state">
          <h2>Loading MoMs...</h2>
          <p>Club ID: {clubId || 'Resolving...'}</p>
          <p>{isResolvingClubId ? 'Resolving club ID...' : 'Fetching MoMs...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mom-container">
        <div className="error-state">
          <h2>Error Loading MoMs</h2>
          <p><strong>Error:</strong> {error}</p>
          <p><strong>Club ID:</strong> {clubId || 'Not found'}</p>
          <p><strong>API URL:</strong> {API_BASE_URL}/moms/{clubId}</p>
          <button onClick={fetchMoMs} style={{
            padding: '10px 20px',
            marginTop: '20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mom-container">
      <div className="main-content">
        <div className="header-section">
          <div className="header-content">
            <div className="header-left">
              <h1>Minutes of Meeting (MoM)</h1>
              <div className="header-taglines">
                <span className="tagline">✅ Add your MoM</span>
                <span className="tagline">📅 Keep track of your meetings</span>
                <span className="tagline">🆔 Club ID: {clubId}</span>
                {userRole && <span className="tagline">👤 Role: {userRole}</span>}
              </div>
            </div>
            {userRole === 'Coordinator' && (
              <button
                className="add-mom-btn"
                onClick={() => setShowAddModal(true)}
              >
                ➕ Add MoM
              </button>
            )}
          </div>
        </div>

        <div className="search-sort-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search MoMs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="sort-controls">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>

            <button
              className="sort-order-btn"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        <div className="mom-list">
          {filteredAndSortedMoMs.length === 0 ? (
            <div className="no-mom">
              <p>No MoMs found for this club. Create your first MoM!</p>
              <p>Club ID: {clubId}</p>
            </div>
          ) : (
            filteredAndSortedMoMs.map((mom) => (
              <div key={mom.mom_id} className="mom-row">
                <div className="mom-row-header">
                  <h3 className="mom-row-title">{mom.meeting_title}</h3>
                  <span className="mom-row-date">{formatDate(mom.meeting_date)}</span>
                  <div className="mom-row-actions">
                    <button
                      className="view-btn"
                      onClick={() => handleViewMoM(mom)}
                    >
                      View
                    </button>
                    <button
                      className="download-btn"
                      onClick={() => handleDownload(mom)}
                      disabled={!mom.fileUrl}
                    >
                      📥 Download
                    </button>
                    {userRole === 'Coordinator' && (
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteMoM(mom.mom_id)}
                      >
                        🗑️ Delete
                      </button>
                    )}
                    <button
                      className="toggle-btn"
                      onClick={() => toggleExpanded(mom.mom_id)}
                    >
                      {expanded[mom.mom_id] ? '▲ Hide' : '▼ Details'}
                    </button>
                  </div>
                </div>

                {expanded[mom.mom_id] && (
                  <div className="mom-row-body">
                    <div className="detail-grid">
                      <div className="detail-item"><strong>MoM ID:</strong> {mom.mom_id}</div>
                      <div className="detail-item"><strong>Club ID:</strong> {mom.club_id || 'N/A'}</div>
                      <div className="detail-item"><strong>Start Time:</strong> {mom.start_time || 'N/A'}</div>
                      <div className="detail-item"><strong>End Time:</strong> {mom.end_time || 'N/A'}</div>
                      <div className="detail-item"><strong>Location:</strong> {mom.location || 'N/A'}</div>
                      <div className="detail-item"><strong>Organizer:</strong> {mom.organizer_email || 'N/A'}</div>
                    </div>
                    <div className="detail-section">
                      <h4>Agenda</h4>
                      <p>{mom.agenda || 'No agenda provided.'}</p>
                    </div>
                    <div className="detail-section">
                      <h4>Discussions</h4>
                      <p>{mom.discussions || 'No discussions provided.'}</p>
                    </div>
                    <div className="detail-section">
                      <h4>Decisions</h4>
                      <p>{mom.decisions || 'No decisions provided.'}</p>
                    </div>
                    {Array.isArray(mom.attendees) && mom.attendees.length > 0 && (
                      <div className="detail-section">
                        <h4>Attendees</h4>
                        <ul>
                          {mom.attendees.map((attendee, index) => (
                            <li key={index}>{attendee}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {Array.isArray(mom.action_items) && mom.action_items.length > 0 && (
                      <div className="detail-section">
                        <h4>Action Items</h4>
                        <ul>
                          {mom.action_items.map((item, index) =>
                            typeof item === 'object' ? (
                              <li key={index}>
                                <div><strong>Task:</strong> {item.task}</div>
                                <div><strong>Responsible:</strong> {item.responsible_email}</div>
                                <div><strong>Due Date:</strong> {item.due_date}</div>
                                <div><strong>Status:</strong> {item.status}</div>
                              </li>
                            ) : (
                              <li key={index}>{item}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                    
                    {mom.notes && (
                      <div className="detail-section">
                        <h4>Notes</h4>
                        <p>{mom.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New MoM</h2>
              <button
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>MoM ID (auto-generated)</label>
                <input
                  type="text"
                  value="Will be assigned on save"
                  readOnly
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Club ID</label>
                <input
                  type="text"
                  value={clubId}
                  readOnly
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Meeting Title *</label>
                <input
                  type="text"
                  value={newMoM.meeting_title}
                  onChange={(e) => handleInputChange('meeting_title', e.target.value)}
                  placeholder="Enter meeting title"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={newMoM.meeting_date}
                  onChange={(e) => handleInputChange('meeting_date', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  value={newMoM.start_time}
                  onChange={(e) => handleInputChange('start_time', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>End Time</label>
                <input
                  type="time"
                  value={newMoM.end_time}
                  onChange={(e) => handleInputChange('end_time', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={newMoM.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter location"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Organizer Email</label>
                <input
                  type="email"
                  value={newMoM.organizer_email}
                  onChange={(e) => handleInputChange('organizer_email', e.target.value)}
                  placeholder="Enter organizer email"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Agenda</label>
                <textarea
                  value={newMoM.agenda}
                  onChange={(e) => handleInputChange('agenda', e.target.value)}
                  placeholder="Enter meeting agenda"
                  rows="4"
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label>Discussions</label>
                <textarea
                  value={newMoM.discussions}
                  onChange={(e) => handleInputChange('discussions', e.target.value)}
                  placeholder="Enter discussions"
                  rows="4"
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label>Decisions</label>
                <textarea
                  value={newMoM.decisions}
                  onChange={(e) => handleInputChange('decisions', e.target.value)}
                  placeholder="Enter decisions"
                  rows="4"
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label>Attendees</label>
                <input
                  type="text"
                  value={newMoM.attendees}
                  onChange={(e) => handleInputChange('attendees', e.target.value)}
                  placeholder="Enter attendees (comma-separated)"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Action Items</label>
                <textarea
                  value={newMoM.action_items}
                  onChange={(e) => handleInputChange('action_items', e.target.value)}
                  placeholder="Enter action items (one per line)"
                  rows="4"
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={newMoM.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Enter additional notes"
                  rows="4"
                  className="form-textarea"
                />
              </div>

            </div>

            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="submit-btn"
                onClick={handleAddMoM}
              >
                Save MoM
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedMoM && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedMoM.meeting_title}</h2>
              <button
                className="close-btn"
                onClick={() => setShowViewModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="mom-details">
                <div className="detail-row">
                  <strong>MoM ID:</strong> {selectedMoM.mom_id}
                </div>
                <div className="detail-row">
                  <strong>Club ID:</strong> {selectedMoM.club_id}
                </div>
                <div className="detail-row">
                  <strong>Date:</strong> {formatDate(selectedMoM.meeting_date)}
                </div>
                <div className="detail-row">
                  <strong>Start Time:</strong> {selectedMoM.start_time || 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>End Time:</strong> {selectedMoM.end_time || 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>Location:</strong> {selectedMoM.location || 'N/A'}
                </div>
                <div className="detail-row">
                  <strong>Organizer Email:</strong> {selectedMoM.organizer_email || 'N/A'}
                </div>

                <div className="detail-section">
                  <h3>Agenda</h3>
                  <p>{selectedMoM.agenda || 'No agenda provided.'}</p>
                </div>

                <div className="detail-section">
                  <h3>Discussions</h3>
                  <p>{selectedMoM.discussions || 'No discussions provided.'}</p>
                </div>

                <div className="detail-section">
                  <h3>Decisions</h3>
                  <p>{selectedMoM.decisions || 'No decisions provided.'}</p>
                </div>

                <div className="detail-section">
                  <h3>Meeting Notes</h3>
                  <p>{selectedMoM.notes || 'No notes available.'}</p>
                </div>

                {selectedMoM.attendees && selectedMoM.attendees.length > 0 && (
                  <div className="detail-section">
                    <h3>Attendees</h3>
                    <ul>
                      {selectedMoM.attendees.map((attendee, index) => (
                        <li key={index}>{attendee}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedMoM.action_items && selectedMoM.action_items.length > 0 && (
                  <div className="detail-section">
                    <h3>Action Items</h3>
                    <ul>
                      {selectedMoM.action_items.map((item, index) => (
                        <li key={index}>
                          {typeof item === 'string' ? item : (item.task || JSON.stringify(item))}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="download-btn"
                onClick={() => handleDownload(selectedMoM)}
                disabled={!selectedMoM.fileUrl}
              >
                📥 Download
              </button>
              <button
                className="close-btn-secondary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoM;