import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Login/Login';
import CommunityPage from '../../pages/Client/Common/CommunityPage/CommunityPage';
import AdminDashboard from "../../pages/Admin/Dashboard/AdminDashboard";
import CreateClub from '../../pages/Client/Common/CreateClub/CreateClub';
import JoinRequests from "../../pages/Client/Common/JoinRequests/JoinRequests";
import PriorLogin from "../../pages/priorlogin/priorlogin";
import Signup from "../../pages/priorlogin/Signup";
import Profile from '../../pages/Client/Common/Profile/Profile';
import MyClubs from '../../pages/Client/Coordinator/MyClubs/MyClubs';
import ClientLayout from '../../pages/Client/Nav/ClientLayout';
import ClubDashboard from '../../pages/Client/ClubDashboard/ClubDashboard';
import MoM from '../../pages/Client/Coordinator/MoM/MoM';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'ADMIN' ? '/AdminDashboard' : '/CommunityPage'} replace />;
  }

  return children;
};

const AppLayout = () => {
  const role = localStorage.getItem('role');

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PriorLogin />} />
        <Route
          path="/signup"
          element={
            role
              ? <Navigate to={role === 'ADMIN' ? '/AdminDashboard' : '/CommunityPage'} replace />
              : <Signup />
          }
        />
        <Route
          path="/login"
          element={
            role
              ? <Navigate to={role === 'ADMIN' ? '/AdminDashboard' : '/CommunityPage'} replace />
              : <Login />
          }
        />

        {/* Admin routes */}
        <Route path="/AdminDashboard/*" element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Client routes */}
        <Route path="/CommunityPage" element={
          <ProtectedRoute allowedRole="CLIENT">
            <ClientLayout userRole="general"><CommunityPage /></ClientLayout>
          </ProtectedRoute>
        } />
        <Route path="/MyClubsPage" element={
          <ProtectedRoute allowedRole="CLIENT">
            <ClientLayout userRole="general"><MyClubs /></ClientLayout>
          </ProtectedRoute>
        } />
        <Route path="/ClubDashboard/:clubId" element={
          <ProtectedRoute allowedRole="CLIENT">
            <ClientLayout userRole="general"><ClubDashboard /></ClientLayout>
          </ProtectedRoute>
        } />
        <Route path="/ClubDashboard/:clubId/mom" element={
          <ProtectedRoute allowedRole="CLIENT">
            <ClientLayout userRole="general"><MoM /></ClientLayout>
          </ProtectedRoute>
        } />
        <Route path="/CreateClubPage" element={
          <ProtectedRoute allowedRole="CLIENT">
            <ClientLayout userRole="general"><CreateClub /></ClientLayout>
          </ProtectedRoute>
        } />
        <Route path="/ProfilePage" element={
          <ProtectedRoute allowedRole="CLIENT">
            <ClientLayout userRole="general"><Profile /></ClientLayout>
          </ProtectedRoute>
        } />
        <Route path="/JoinRequestsPage" element={
          <ProtectedRoute allowedRole="CLIENT">
            <ClientLayout userRole="general"><JoinRequests /></ClientLayout>
          </ProtectedRoute>
        } />
        <Route path="/SettingsPage" element={
          <ProtectedRoute allowedRole="CLIENT">
            <ClientLayout userRole="general"><div>Settings — coming soon</div></ClientLayout>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={
          <Navigate to={role === 'ADMIN' ? '/AdminDashboard' : role === 'CLIENT' ? '/CommunityPage' : '/'} replace />
        } />
      </Routes>
    </Router>
  );
};

export default AppLayout;