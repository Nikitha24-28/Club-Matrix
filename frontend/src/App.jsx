import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClientLayout from './pages/Client/Nav/ClientLayout';
import CommunityPage from "./pages/Client/Common/CommunityPage/CommunityPage";
import CreateClub from "./pages/Client/Common/CreateClub/CreateClub";
import PriorLogin from "./pages/priorlogin/priorlogin";

const App = () => {
  return (
    <PriorLogin/>
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Navigate to="/CommunityPage" />} />
    //     <Route path="/CommunityPage" element={
    //       <ClientLayout userRole="general">
    //         <CommunityPage />
    //       </ClientLayout>
    //     } />
    //     <Route path="/CreateClubPage" element={
    //       <ClientLayout userRole="general">
    //         <CreateClub />
    //       </ClientLayout>
    //     } />
    //     <Route path="/ProfilePage" element={
    //       <ClientLayout userRole="general">
    //         <div>Profile Page - Coming Soon</div>
    //       </ClientLayout>
    //     } />
    //     <Route path="/JoinRequestsPage" element={
    //       <ClientLayout userRole="general">
    //         <div>Join Requests Page - Coming Soon</div>
    //       </ClientLayout>
    //     } />
    //     <Route path="/SettingsPage" element={
    //       <ClientLayout userRole="general">
    //         <div>Settings Page - Coming Soon</div>
    //       </ClientLayout>
    //     } />
    //     <Route path="*" element={<Navigate to="/CommunityPage" />} />
    //   </Routes>
    // </Router>
  )
}

export default App