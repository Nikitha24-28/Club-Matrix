import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Login/Login';
import Dashboard from '../../pages/Admin/Dashboard/Dashboard';
import CommunityPage from '../../pages/Client/Common/CommunityPage/CommunityPage';
import CreateClub from '../../pages/Client/Common/CreateClub/CreateClub';
import PriorLogin from "../../pages/priorlogin/priorlogin"; // import landing page
import Nav from '../../pages/Client/Nav/Nav';

const AppLayout = () => {
  const role = localStorage.getItem("role");

  return (
    <Router>
      
      <Routes>
        {/* Landing page (always public) */}
        <Route path="/" element={<PriorLogin />} />

        {/* Login page (only if not logged in) */}
        {!role && (
          <>
            <Route path="/login" element={<Login />} />
            {/* Redirect all unknown routes to landing */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}

        {/* If logged in */}
        {role && <Nav /> && (
          <>
            {role === "ADMIN" && (
              <>
                <Route path="/AdminDashboard" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/AdminDashboard" />} />
              </>
            )}

            {role === "CLIENT" && (
              <>
                <Route path="/CommunityPage" element={<CommunityPage />} />
                <Route path="/CreateClubPage" element={<CreateClub />} />
                <Route path="/ProfilePage" element={<div>Profile Page - Coming Soon</div>} />
                <Route path="/JoinRequestsPage" element={<div>Join Requests Page - Coming Soon</div>} />
                <Route path="/SettingsPage" element={<div>Settings Page - Coming Soon</div>} />
                <Route path="*" element={<Navigate to="/CommunityPage" />} />
              </>
            )}
          </>
        )}
      </Routes>
    </Router>
  );
};

export default AppLayout;