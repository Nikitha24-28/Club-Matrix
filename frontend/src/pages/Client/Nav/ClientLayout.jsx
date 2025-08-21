import React from 'react';
import Nav from './Nav';
import './ClientLayout.css';

const ClientLayout = ({ children, userRole = 'general', userStatus = 'member', currentClub = null }) => {
  return (
    <div className="client-layout">
      <Nav 
        userRole={userRole}
        userStatus={userStatus}
        currentClub={currentClub}
      />
      <div className="client-content">
        {children}
      </div>
    </div>
  );
};

export default ClientLayout;

