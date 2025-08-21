import React from 'react';
import Nav from './Nav';
import './PageWrapper.css';

const PageWrapper = ({ 
  children, 
  userRole = 'general', 
  userStatus = 'member', 
  currentClub = null,
  className = ''
}) => {
  return (
    <div className={`page-wrapper ${className}`}>
      <Nav 
        userRole={userRole}
        userStatus={userStatus}
        currentClub={currentClub}
      />
      <div className="page-content">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;

