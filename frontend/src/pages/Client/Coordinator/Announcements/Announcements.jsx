import React, { useState } from 'react';
import './Announcements.css';

const AnnouncementsPage = () => {
  // Dummy user data - change isCoordinator to test different roles
  const currentUser = {
    id: 1,
    name: 'John Coordinator',
    isCoordinator: true
  };

  // Dummy announcements data
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Welcome to Club Matrixx!',
      message: 'We are excited to welcome all new members to our club. This semester promises to be filled with amazing events and opportunities for growth.',
      postedBy: 'Sarah Wilson',
      timestamp: '2024-01-15T10:30:00',
      reactions: {
        '👍': ['user1', 'user2', 'user3'],
        '❤️': ['user1', 'user4'],
        '😂': ['user2']
      },
      poll: null
    },
    {
      id: 2,
      title: 'Upcoming Workshop: Web Development',
      message: 'Join us this Saturday for an intensive web development workshop. Learn HTML, CSS, and JavaScript basics. All skill levels welcome!',
      postedBy: 'Mike Johnson',
      timestamp: '2024-01-14T14:20:00',
      reactions: {
        '👍': ['user1', 'user2', 'user3', 'user4', 'user5'],
        '❤️': ['user1', 'user3'],
        '🎉': ['user2', 'user4']
      },
      poll: {
        question: 'What time works best for you?',
        options: [
          { id: 1, text: '10:00 AM', votes: ['user1', 'user2'] },
          { id: 2, text: '2:00 PM', votes: ['user3', 'user4', 'user5'] },
          { id: 3, text: '6:00 PM', votes: ['user1'] }
        ]
      }
    },
    {
      id: 3,
      title: 'Club Meeting This Friday',
      message: 'Don\'t forget about our monthly club meeting this Friday at 3 PM in the Student Center. We\'ll be discussing upcoming events and electing new officers.',
      postedBy: 'David Brown',
      timestamp: '2024-01-13T09:15:00',
      reactions: {
        '👍': ['user1', 'user2'],
        '📅': ['user3', 'user4']
      },
      poll: null
    },
    {
      id: 4,
      title: 'Hackathon Registration Open',
      message: 'Our annual hackathon is just around the corner! Registration is now open. Teams of 2-4 members. Prizes include cash rewards and internship opportunities.',
      postedBy: 'Emma Davis',
      timestamp: '2024-01-12T16:45:00',
      reactions: {
        '👍': ['user1', 'user2', 'user3', 'user4', 'user5', 'user6'],
        '❤️': ['user1', 'user2', 'user3'],
        '🚀': ['user4', 'user5']
      },
      poll: {
        question: 'What type of project interests you most?',
        options: [
          { id: 1, text: 'Mobile App', votes: ['user1', 'user2', 'user3'] },
          { id: 2, text: 'Web Application', votes: ['user4', 'user5'] },
          { id: 3, text: 'AI/ML Project', votes: ['user6'] },
          { id: 4, text: 'Game Development', votes: ['user1'] }
        ]
      }
    }
  ]);

  // New announcement form state
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    hasPoll: false,
    pollQuestion: '',
    pollOptions: ['', '']
  });

  // Handle reaction toggle
  const toggleReaction = (announcementId, reaction) => {
    setAnnouncements(prev => prev.map(announcement => {
      if (announcement.id === announcementId) {
        const currentReactions = announcement.reactions[reaction] || [];
        const hasReacted = currentReactions.includes(currentUser.id);
        
        if (hasReacted) {
          // Remove reaction
          const updatedReactions = { ...announcement.reactions };
          updatedReactions[reaction] = currentReactions.filter(id => id !== currentUser.id);
          if (updatedReactions[reaction].length === 0) {
            delete updatedReactions[reaction];
          }
          return { ...announcement, reactions: updatedReactions };
        } else {
          // Add reaction
          const updatedReactions = { ...announcement.reactions };
          updatedReactions[reaction] = [...currentReactions, currentUser.id];
          return { ...announcement, reactions: updatedReactions };
        }
      }
      return announcement;
    }));
  };

  // Handle poll vote
  const voteOnPoll = (announcementId, optionId) => {
    setAnnouncements(prev => prev.map(announcement => {
      if (announcement.id === announcementId && announcement.poll) {
        const updatedPoll = { ...announcement.poll };
        updatedPoll.options = updatedPoll.options.map(option => {
          const hasVoted = option.votes.includes(currentUser.id);
          if (option.id === optionId && !hasVoted) {
            return { ...option, votes: [...option.votes, currentUser.id] };
          }
          return option;
        });
        return { ...announcement, poll: updatedPoll };
      }
      return announcement;
    }));
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setNewAnnouncement(prev => ({ ...prev, [field]: value }));
  };

  // Handle poll option changes
  const handlePollOptionChange = (index, value) => {
    const updatedOptions = [...newAnnouncement.pollOptions];
    updatedOptions[index] = value;
    setNewAnnouncement(prev => ({ ...prev, pollOptions: updatedOptions }));
  };

  // Add/remove poll options
  const addPollOption = () => {
    setNewAnnouncement(prev => ({
      ...prev,
      pollOptions: [...prev.pollOptions, '']
    }));
  };

  const removePollOption = (index) => {
    if (newAnnouncement.pollOptions.length > 2) {
      const updatedOptions = newAnnouncement.pollOptions.filter((_, i) => i !== index);
      setNewAnnouncement(prev => ({ ...prev, pollOptions: updatedOptions }));
    }
  };

  // Post new announcement
  const postAnnouncement = () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.message.trim()) {
      alert('Please fill in both title and message');
      return;
    }

    if (newAnnouncement.hasPoll && (!newAnnouncement.pollQuestion.trim() || newAnnouncement.pollOptions.some(opt => !opt.trim()))) {
      alert('Please fill in poll question and all options');
      return;
    }

    const newAnnouncementObj = {
      id: Date.now(),
      title: newAnnouncement.title,
      message: newAnnouncement.message,
      postedBy: currentUser.name,
      timestamp: new Date().toISOString(),
      reactions: {},
      poll: newAnnouncement.hasPoll ? {
        question: newAnnouncement.pollQuestion,
        options: newAnnouncement.pollOptions.map((option, index) => ({
          id: index + 1,
          text: option,
          votes: []
        }))
      } : null
    };

    setAnnouncements(prev => [newAnnouncementObj, ...prev]);
    
    // Reset form
    setNewAnnouncement({
      title: '',
      message: '',
      hasPoll: false,
      pollQuestion: '',
      pollOptions: ['', '']
    });
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Check if user has voted on a poll
  const hasVotedOnPoll = (poll) => {
    return poll.options.some(option => option.votes.includes(currentUser.id));
  };

  return (
    <div className="announcements-container">
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
            <li className="nav-item active">
              <span>Announcements</span>
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
        <div className="content-header">
          <h1>Announcements</h1>
          <p>Stay updated with the latest club news and events</p>
        </div>

        {/* Scrollable Announcements List */}
        <div className="announcements-list-container">
          <div className="announcements-list">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="announcement-card">
                <div className="announcement-header">
                  <h3 className="announcement-title">{announcement.title}</h3>
                  <span className="timestamp">{formatTimestamp(announcement.timestamp)}</span>
                </div>
                
                <div className="announcement-content">
                  <p className="announcement-message">{announcement.message}</p>
                </div>

                <div className="announcement-meta">
                  <span className="posted-by">Posted by {announcement.postedBy}</span>
                </div>

                {/* Poll Section */}
                {announcement.poll && (
                  <div className="poll-section-display">
                    <h4 className="poll-question-display">{announcement.poll.question}</h4>
                    <div className="poll-options-display">
                      {announcement.poll.options.map((option) => {
                        const totalVotes = announcement.poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
                        const percentage = totalVotes > 0 ? Math.round((option.votes.length / totalVotes) * 100) : 0;
                        const hasVoted = option.votes.includes(currentUser.id);
                        
                        return (
                          <div
                            key={option.id}
                            className={`poll-option ${hasVoted ? 'voted' : ''} ${!hasVotedOnPoll(announcement.poll) ? 'clickable' : ''}`}
                            onClick={() => !hasVotedOnPoll(announcement.poll) && voteOnPoll(announcement.id, option.id)}
                          >
                            <div className="poll-option-content">
                              <span className="option-text">{option.text}</span>
                              <span className="vote-count">{option.votes.length} votes</span>
                            </div>
                            <div className="poll-progress-bar">
                              <div 
                                className="poll-progress-fill"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="percentage">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Reactions */}
                <div className="reactions-section">
                  <div className="reaction-buttons">
                    {['👍', '❤️', '😂', '🎉', '🚀', '📅'].map((reaction) => {
                      const hasReacted = announcement.reactions[reaction]?.includes(currentUser.id);
                      const reactionCount = announcement.reactions[reaction]?.length || 0;
                      
                      return (
                        <button
                          key={reaction}
                          onClick={() => toggleReaction(announcement.id, reaction)}
                          className={`reaction-btn ${hasReacted ? 'active' : ''}`}
                        >
                          <span className="reaction-emoji">{reaction}</span>
                          {reactionCount > 0 && (
                            <span className="reaction-count">{reactionCount}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Announcement Form - Compact at Bottom */}
        <div className="new-announcement-section">
          <div className={`announcement-form ${!currentUser.isCoordinator ? 'disabled' : ''}`}>
            <div className="form-content">
              <div className="form-main">
                <input
                  type="text"
                  placeholder="Announcement title..."
                  value={newAnnouncement.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  disabled={!currentUser.isCoordinator}
                  className="title-input"
                />
                
                <textarea
                  placeholder="Write your announcement message..."
                  value={newAnnouncement.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  disabled={!currentUser.isCoordinator}
                  className="message-input"
                  rows="2"
                />

                {/* Poll Section */}
                {newAnnouncement.hasPoll && (
                  <div className="poll-form">
                    <input
                      type="text"
                      placeholder="Poll question..."
                      value={newAnnouncement.pollQuestion}
                      onChange={(e) => handleInputChange('pollQuestion', e.target.value)}
                      disabled={!currentUser.isCoordinator}
                      className="poll-question"
                    />
                    
                    <div className="poll-options">
                      {newAnnouncement.pollOptions.map((option, index) => (
                        <div key={index} className="poll-option-input">
                          <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handlePollOptionChange(index, e.target.value)}
                            disabled={!currentUser.isCoordinator}
                          />
                          {newAnnouncement.pollOptions.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removePollOption(index)}
                              disabled={!currentUser.isCoordinator}
                              className="remove-option-btn"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <label className="poll-toggle">
                  <input
                    type="checkbox"
                    checked={newAnnouncement.hasPoll}
                    onChange={(e) => handleInputChange('hasPoll', e.target.checked)}
                    disabled={!currentUser.isCoordinator}
                  />
                  Add a poll
                </label>

                {currentUser.isCoordinator && (
                  <button
                    onClick={postAnnouncement}
                    className="post-btn"
                    disabled={!newAnnouncement.title.trim() || !newAnnouncement.message.trim()}
                  >
                    Post Announcement
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage; 