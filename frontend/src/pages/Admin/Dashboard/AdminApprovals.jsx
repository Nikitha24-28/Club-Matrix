import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import './AdminUI.css';

const mockRequests = [
  { id: 'c1', name: 'Tech Innovators', owner: 'anita@college.edu', type: 'Public', submittedAt: '2h ago', status: 'Pending' },
  { id: 'c2', name: 'Photography Fans', owner: 'mark@college.edu', type: 'Private', submittedAt: '4h ago', status: 'Pending' },
  { id: 'c3', name: 'Gaming Masters', owner: 'jules@college.edu', type: 'Public', submittedAt: '1d ago', status: 'Pending' }
];

const AdminApprovals = () => {
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState(mockRequests);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return rows.filter(r => r.name.toLowerCase().includes(q) || r.owner.toLowerCase().includes(q));
  }, [query, rows]);

  const approve = (id) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const reject = (id) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="approvals-wrapper">
      <div className="approvals-toolbar">
        <div className="approvals-search">
          <Search className="search-icon" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search club or owner" />
        </div>
        <span className="status-badge">{filtered.length} pending</span>
      </div>

      <div className="approval-list">
        <div className="approval-row header">
          <span>Club</span>
          <span>Owner</span>
          <span>Type</span>
          <span>Actions</span>
        </div>
        {filtered.map((r) => (
          <div className="approval-row" key={r.id}>
            <span>{r.name}</span>
            <span>{r.owner}</span>
            <span>{r.type}</span>
            <div className="approval-actions">
              <button className="btn btn-primary" onClick={() => approve(r.id)}>Approve</button>
              <button className="btn btn-danger" onClick={() => reject(r.id)}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminApprovals;



