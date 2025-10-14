import React from 'react';
import { Search } from 'lucide-react';
import './AdminUI.css';

const AdminNav = ({ title }) => {
  return (
    <div className="admin-nav">
      <div className="admin-nav-left">
        <span className="admin-nav-title">{title}</span>
        <span className="admin-nav-badge">Admin</span>
      </div>
      <div className="admin-nav-right">
        <div className="search-box">
          <Search className="search-icon" />
          <input className="search-input" placeholder="Search..." />
        </div>
      </div>
    </div>
  );
};

export default AdminNav;



