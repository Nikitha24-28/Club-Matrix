import React, { useState } from 'react';
import './MoM.css';

const MoM = () => {
  // Dummy MoM data
  const [momList, setMomList] = useState([
    {
      id: 1,
      title: 'Weekly Team Standup Meeting',
      date: '2024-01-15',
      summary: 'Team discussed project progress, identified blockers, and planned next sprint. Key decisions made regarding upcoming feature release.',
      notes: 'Discussed project progress, identified blockers, and planned next sprint. Team members shared updates on their respective tasks. Key decisions made regarding the upcoming feature release. John reported 80% completion on authentication module. Jane shared UI mockups for review. Mike identified database performance issues that need addressing. Sarah proposed new testing strategy for better coverage.',
      attendees: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'],
      actionItems: [
        'Complete user authentication module by Friday',
        'Review and approve UI mockups',
        'Schedule client demo for next week',
        'Address database performance issues'
      ],
      fileUrl: '/sample-mom-1.pdf'
    },
    {
      id: 2,
      title: 'Project Kickoff Meeting',
      date: '2024-01-12',
      summary: 'Initial project planning session with scope definition, timeline creation, and resource allocation. Established communication protocols.',
      notes: 'Initial project planning session. Defined project scope, timeline, and resource allocation. Established communication protocols and reporting structure. Discussed budget allocation and risk assessment. Team roles were clearly defined and responsibilities assigned. Timeline was set for 6 months with monthly milestones. Communication channels were established including weekly updates and monthly reviews.',
      attendees: ['Project Manager', 'Tech Lead', 'Design Lead', 'Stakeholders'],
      actionItems: [
        'Set up project repository',
        'Create project timeline',
        'Assign team roles and responsibilities',
        'Establish communication channels'
      ],
      fileUrl: '/sample-mom-2.pdf'
    },
    {
      id: 3,
      title: 'Client Requirements Review',
      date: '2024-01-10',
      summary: 'Detailed discussion of client requirements and expectations. Clarified technical specifications and agreed on project milestones.',
      notes: 'Detailed discussion of client requirements and expectations. Clarified technical specifications and identified potential challenges. Agreed on project milestones. Client provided detailed feedback on initial proposals. Technical team raised concerns about scalability requirements. Design team presented mockups for client approval. Timeline was adjusted based on client feedback and technical constraints.',
      attendees: ['Client Representative', 'Project Manager', 'Technical Team'],
      actionItems: [
        'Finalize requirements document',
        'Create technical specification',
        'Schedule follow-up meeting',
        'Update project timeline'
      ],
      fileUrl: '/sample-mom-3.pdf'
    },
    {
      id: 4,
      title: 'Sprint Retrospective',
      date: '2024-01-08',
      summary: 'Team retrospective for Sprint 3. Discussed improvements and identified process enhancements for better efficiency.',
      notes: 'Team retrospective for Sprint 3. Discussed what went well, what could be improved, and action items for next sprint. Identified process improvements. Team celebrated successful completion of user stories. Identified bottlenecks in code review process. Discussed ways to improve communication between team members. Agreed on implementing automated testing to reduce manual testing time.',
      attendees: ['Development Team', 'Scrum Master', 'Product Owner'],
      actionItems: [
        'Implement automated testing',
        'Improve code review process',
        'Reduce meeting duration',
        'Enhance team communication'
      ],
      fileUrl: '/sample-mom-4.pdf'
    },
    {
      id: 5,
      title: 'Architecture Design Review',
      date: '2024-01-05',
      summary: 'Technical architecture review meeting. Discussed system design, database schema, and made decisions on technology stack.',
      notes: 'Technical architecture review meeting. Discussed system design, database schema, and API specifications. Made decisions on technology stack and implementation approach. Evaluated different database solutions for scalability. Discussed microservices vs monolithic architecture. Reviewed security requirements and compliance needs. Agreed on using cloud infrastructure for better scalability and cost-effectiveness.',
      attendees: ['Architects', 'Senior Developers', 'DevOps Engineer'],
      actionItems: [
        'Create detailed architecture document',
        'Set up development environment',
        'Begin prototype development',
        'Document security requirements'
      ],
      fileUrl: '/sample-mom-5.pdf'
    }
  ]);

  // State for new MoM form
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMoM, setSelectedMoM] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // New MoM form state
  const [newMoM, setNewMoM] = useState({
    title: '',
    date: '',
    summary: '',
    notes: '',
    attendees: '',
    actionItems: '',
    file: null
  });

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setNewMoM(prev => ({ ...prev, [field]: value }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewMoM(prev => ({ ...prev, file }));
  };

  // Add new MoM
  const handleAddMoM = () => {
    if (!newMoM.title.trim() || !newMoM.date.trim() || !newMoM.summary.trim() || !newMoM.notes.trim()) {
      alert('Please fill in all required fields (Title, Date, Summary, and Notes)');
      return;
    }

    const attendeesList = newMoM.attendees.split(',').map(name => name.trim()).filter(name => name);
    const actionItemsList = newMoM.actionItems.split('\n').map(item => item.trim()).filter(item => item);

    const newMoMEntry = {
      id: Date.now(),
      title: newMoM.title,
      date: newMoM.date,
      summary: newMoM.summary,
      notes: newMoM.notes,
      attendees: attendeesList,
      actionItems: actionItemsList,
      fileUrl: newMoM.file ? URL.createObjectURL(newMoM.file) : null
    };

    setMomList(prev => [newMoMEntry, ...prev]);
    
    // Reset form
    setNewMoM({
      title: '',
      date: '',
      summary: '',
      notes: '',
      attendees: '',
      actionItems: '',
      file: null
    });
    
    setShowAddModal(false);
  };

  // View MoM details
  const handleViewMoM = (mom) => {
    setSelectedMoM(mom);
    setShowViewModal(true);
  };

  // Download MoM file
  const handleDownload = (mom) => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = mom.fileUrl || '#';
    link.download = `${mom.title.replace(/\s+/g, '_')}_${mom.date}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter and sort MoMs
  const filteredAndSortedMoMs = momList
    .filter(mom => 
      mom.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mom.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mom.notes.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="mom-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Club Matrixx</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item">
              <span>Dashboard</span>
            </li>
            <li className="nav-item">
              <span>Announcements</span>
            </li>
            <li className="nav-item active">
              <span>Minutes of Meeting</span>
            </li>
            <li className="nav-item">
              <span>Events</span>
            </li>
            <li className="nav-item">
              <span>Members</span>
            </li>
            <li className="nav-item">
              <span>Join Requests</span>
            </li>
            <li className="nav-item">
              <span>Settings</span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header Section */}
        <div className="header-section">
          <div className="header-content">
            <div className="header-left">
              <h1>Minutes of Meeting (MoM)</h1>
              <div className="header-taglines">
                <span className="tagline">✅ Add your MoM</span>
                <span className="tagline">📅 Keep track of your meetings</span>
              </div>
            </div>
            <button 
              className="add-mom-btn"
              onClick={() => setShowAddModal(true)}
            >
              ➕ Add MoM
            </button>
          </div>
        </div>

        {/* Search and Sort Section */}
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

        {/* MoM List */}
        <div className="mom-list">
          {filteredAndSortedMoMs.length === 0 ? (
            <div className="no-mom">
              <p>No MoMs found. Create your first MoM!</p>
            </div>
          ) : (
            filteredAndSortedMoMs.map((mom) => (
              <div key={mom.id} className="mom-card">
                <div className="mom-header">
                  <h3 className="mom-title">{mom.title}</h3>
                  <span className="mom-date">{formatDate(mom.date)}</span>
                </div>
                
                <div className="mom-preview">
                  <div className="mom-summary">
                    <strong>Summary:</strong> {mom.summary}
                  </div>
                  <p className="mom-notes-preview">{mom.notes.substring(0, 120)}...</p>
                </div>
                
                <div className="mom-actions">
                  <button 
                    className="view-btn"
                    onClick={() => handleViewMoM(mom)}
                  >
                    View Full MoM
                  </button>
                  
                  <button 
                    className="download-btn"
                    onClick={() => handleDownload(mom)}
                  >
                    📥 Download
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add MoM Modal */}
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
                <label>Meeting Title *</label>
                <input
                  type="text"
                  value={newMoM.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter meeting title"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={newMoM.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Summary *</label>
                <textarea
                  value={newMoM.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="Enter a brief summary of the meeting..."
                  rows="3"
                  className="form-textarea"
                />
              </div>
              
              <div className="form-group">
                <label>Detailed Notes *</label>
                <textarea
                  value={newMoM.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Enter detailed meeting notes..."
                  rows="6"
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
                  value={newMoM.actionItems}
                  onChange={(e) => handleInputChange('actionItems', e.target.value)}
                  placeholder="Enter action items (one per line)"
                  rows="4"
                  className="form-textarea"
                />
              </div>
              
              <div className="form-group">
                <label>Upload File (Optional)</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt"
                  className="form-file"
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

      {/* View MoM Modal */}
      {showViewModal && selectedMoM && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedMoM.title}</h2>
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
                  <strong>Date:</strong> {formatDate(selectedMoM.date)}
                </div>
                
                <div className="detail-section">
                  <h3>Summary</h3>
                  <p className="summary-text">{selectedMoM.summary}</p>
                </div>
                
                <div className="detail-section">
                  <h3>Meeting Notes</h3>
                  <p>{selectedMoM.notes}</p>
                </div>
                
                {selectedMoM.attendees.length > 0 && (
                  <div className="detail-section">
                    <h3>Attendees</h3>
                    <ul>
                      {selectedMoM.attendees.map((attendee, index) => (
                        <li key={index}>{attendee}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedMoM.actionItems.length > 0 && (
                  <div className="detail-section">
                    <h3>Action Items</h3>
                    <ul>
                      {selectedMoM.actionItems.map((item, index) => (
                        <li key={index}>{item}</li>
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