import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Login/Login';
import Dashboard from '../../pages/Admin/Dashboard/Dashboard';
import CommunityPage from '../../pages/Client/Common/CommunityPage/CommunityPage';
import CreateClub from '../../pages/Client/Common/CreateClub/CreateClub';
import PriorLogin from "../../pages/priorlogin/priorlogin"; // import landing page
import Nav from '../../pages/Client/Nav/Nav';
import ClientLayout from '../../pages/Client/Nav/ClientLayout';

const AppLayout = () => {
  const role = localStorage.getItem("role");

  return (
    <Router>
      
      <Routes>
        {/* Landing page (always public) */}
        <Route path="/" element={<PriorLogin />} />

        {/* Login page: always available; redirect if already logged in */}
        <Route
          path="/login"
          element={
            role
              ? (role === "ADMIN" ? <Navigate to="/AdminDashboard" /> : <Navigate to="/CommunityPage" />)
              : <Login />
          }
        />

        {/* If logged in */}
        {role && (
          <>
            {role === "ADMIN" && (
              <>
                <Route path="/AdminDashboard" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/AdminDashboard" />} />
              </>
            )}

            {role === "CLIENT" && (
              <>
                <Route path="/CommunityPage" element={
                  <ClientLayout userRole="general">
                    <CommunityPage />
                  </ClientLayout>
                } />
                <Route path="/CreateClubPage" element={
                  <ClientLayout userRole="general">
                    <CreateClub />
                  </ClientLayout>
                } />
                <Route path="/ProfilePage" element={
                  <ClientLayout userRole="general">
                    <div>Profile Page - Coming Soon</div>
                  </ClientLayout>
                } />
                <Route path="/JoinRequestsPage" element={
                  <ClientLayout userRole="general">
                    <div>Join Requests Page - Coming Soon</div>
                  </ClientLayout>
                } />
                <Route path="/SettingsPage" element={
                  <ClientLayout userRole="general">
                    <div>Settings Page - Coming Soon</div>
                  </ClientLayout>
                } />
                <Route path="*" element={<Navigate to="/CommunityPage" />} />
              </>
            )}
          </>
        )}

        {/* Fallback when not logged in: send unknown routes to landing */}
        {!role && <Route path="*" element={<Navigate to="/" />} />}
      </Routes>
    </Router>
  );
};

export default AppLayout;