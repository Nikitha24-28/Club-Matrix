import React from 'react';
import Nav from './Nav';

const ClientLayout = ({ children, userRole = 'general', userStatus = 'member', currentClub = null }) => {
  return (
    <div className="client-layout">
      <Nav 
        userRole={userRole}
        userStatus={userStatus}
        currentClub={currentClub}
      />
      <div className="client-content" style={{ marginLeft: '280px' }}>
        {children}
      </div>
    </div>
  );
};

export default ClientLayout;
