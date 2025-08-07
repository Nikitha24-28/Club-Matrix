import React, { useState } from 'react';
import './JoinRequests.css';

const JoinRequests = () => {
  // Dummy data for join requests
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      date: '2024-01-15',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      date: '2024-01-14',
      status: 'pending'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      date: '2024-01-13',
      status: 'pending'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      date: '2024-01-12',
      status: 'pending'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@example.com',
      date: '2024-01-11',
      status: 'pending'
    }
  ]);

  // Function to approve a request
  const approveRequest = (id) => {
    console.log(`Approving request with ID: ${id}`);
    setRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === id 
          ? { ...request, status: 'approved' }
          : request
      )
    );
  };

  // Function to reject a request
  const rejectRequest = (id) => {
    console.log(`Rejecting request with ID: ${id}`);
    setRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === id 
          ? { ...request, status: 'rejected' }
          : request
      )
    );
  };

  // Filter requests to show only pending ones
  const pendingRequests = requests.filter(request => request.status === 'pending');

  return (
    <div className="join-requests-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Club Dashboard</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item active">
              <span>Join Requests</span>
            </li>
            <li className="nav-item">
              <span>Members</span>
            </li>
            <li className="nav-item">
              <span>Events</span>
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
          <h1>Join Requests</h1>
          <p>Manage incoming club membership requests</p>
        </div>

        <div className="requests-table-container">
          {pendingRequests.length === 0 ? (
            <div className="no-requests">
              <p>No pending join requests</p>
            </div>
          ) : (
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Date of Request</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.name}</td>
                    <td>{request.email}</td>
                    <td>{new Date(request.date).toLocaleDateString()}</td>
                    <td className="action-buttons">
                      <button
                        className="approve-btn"
                        onClick={() => approveRequest(request.id)}
                        title="Approve Request"
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => rejectRequest(request.id)}
                        title="Reject Request"
                      >
                        ❌ Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Summary Section */}
        <div className="summary-section">
          <div className="summary-card">
            <h3>Total Requests</h3>
            <p className="summary-number">{requests.length}</p>
          </div>
          <div className="summary-card">
            <h3>Pending</h3>
            <p className="summary-number">{pendingRequests.length}</p>
          </div>
          <div className="summary-card">
            <h3>Approved</h3>
            <p className="summary-number">
              {requests.filter(r => r.status === 'approved').length}
            </p>
          </div>
          <div className="summary-card">
            <h3>Rejected</h3>
            <p className="summary-number">
              {requests.filter(r => r.status === 'rejected').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinRequests; 