import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Login/Login';
import Navbar from '../Navbar/Navbar';
import Dashboard from '../../pages/Admin/Dashboard/Dashboard';
import CommunityPage from '../../pages/Client/Common/CommunityPage/CommunityPage';
import CreateClub from '../../pages/Client/Common/CreateClub/CreateClub';

const AppLayout = () => {
  const role = localStorage.getItem("role");
  return (
    <Router>
      {role && <Navbar/>}
      <Routes>
        {!role ?
        (<>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>):
        (<>
          {role==="ADMIN" && (
            <>
              <Route path="/AdminDashboard" element={<Dashboard/>}/>
            </>
          )}

          {role==="CLIENT" && (
            <>
              <Route path="/CommunityPage" element={<CommunityPage/>}/>
              <Route path="/CreateClubPage" element={<CreateClub/>}/>
              <Route path="/ProfilePage" element={<div>Profile Page - Coming Soon</div>}/>
              <Route path="/JoinRequestsPage" element={<div>Join Requests Page - Coming Soon</div>}/>
              <Route path="/SettingsPage" element={<div>Settings Page - Coming Soon</div>}/>
            </>
          )}
        </>)}
      </Routes>
    </Router>
  )
}

export default AppLayout