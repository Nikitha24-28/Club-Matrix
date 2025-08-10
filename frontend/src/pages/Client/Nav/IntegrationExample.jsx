import React from 'react';
import PageWrapper from './PageWrapper';
import Nav from './Nav';

// Example 1: Community Page (General Client)
export const CommunityPageExample = () => {
  return (
    <PageWrapper userRole="general">
      <div className="community-content">
        <h1>Discover Clubs</h1>
        <p>Find and join amazing clubs in your community</p>
        {/* Your existing community page content */}
      </div>
    </PageWrapper>
  );
};

// Example 2: Member Dashboard
export const MemberDashboardExample = () => {
  const currentClub = {
    name: "Tech Innovators",
    id: "tech-innovators-123"
  };

  return (
    <PageWrapper 
      userRole="member" 
      userStatus="member" 
      currentClub={currentClub}
    >
      <div className="member-dashboard">
        <h1>Member Dashboard</h1>
        <p>Welcome to Tech Innovators</p>
        {/* Your existing member dashboard content */}
      </div>
    </PageWrapper>
  );
};

// Example 3: Coordinator Dashboard
export const CoordinatorDashboardExample = () => {
  const currentClub = {
    name: "Design Studio",
    id: "design-studio-456"
  };

  return (
    <PageWrapper 
      userRole="coordinator" 
      userStatus="coordinator" 
      currentClub={currentClub}
    >
      <div className="coordinator-dashboard">
        <h1>Coordinator Dashboard</h1>
        <p>Manage Design Studio</p>
        {/* Your existing coordinator dashboard content */}
      </div>
    </PageWrapper>
  );
};

// Example 4: Direct Nav Usage (for custom layouts)
export const CustomLayoutExample = () => {
  return (
    <div className="custom-layout">
      <Nav userRole="general" />
      <div className="custom-content" style={{ marginLeft: '280px', padding: '2rem' }}>
        <h1>Custom Layout</h1>
        <p>This shows how to use Nav component directly without PageWrapper</p>
      </div>
    </div>
  );
};

// Example 5: How to update existing JoinRequests page
export const UpdatedJoinRequestsExample = () => {
  const currentClub = {
    name: "Tech Innovators"
  };

  return (
    <PageWrapper 
      userRole="coordinator" 
      userStatus="coordinator" 
      currentClub={currentClub}
    >
      <div className="join-requests-content">
        <div className="content-header">
          <h1>Join Requests</h1>
          <p>Manage incoming club membership requests</p>
        </div>
        
        {/* Your existing join requests table and content */}
        <div className="requests-table-container">
          {/* Existing table content */}
        </div>
      </div>
    </PageWrapper>
  );
};

// Example 6: How to update existing Announcements page
export const UpdatedAnnouncementsExample = () => {
  const currentClub = {
    name: "Design Studio"
  };

  return (
    <PageWrapper 
      userRole="coordinator" 
      userStatus="coordinator" 
      currentClub={currentClub}
    >
      <div className="announcements-content">
        <div className="content-header">
          <h1>Announcements</h1>
          <p>Stay updated with the latest club news and events</p>
        </div>
        
        {/* Your existing announcements content */}
        <div className="announcements-list-container">
          {/* Existing announcements list */}
        </div>
      </div>
    </PageWrapper>
  );
};
