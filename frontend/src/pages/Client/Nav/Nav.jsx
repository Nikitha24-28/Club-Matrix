import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Calendar,
  Settings,
  TrendingUp,
  Plus,
  FileText,
  Bell,
  UserCheck,
  BarChart3,
  MessageSquare,
  BookOpen,
  Shield,
  Star
} from 'lucide-react';
import './Nav.css';

const Nav = ({ userRole = 'general', userStatus = 'member', currentClub = null }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/");  // React Router redirect
  };
  

  // Base navigation items for general clients
  const generalNavItems = [
    { 
      icon: <Home size={20} />, 
      label: "Public Clubs", 
      link: "/CommunityPage",
      roles: ['general', 'member', 'coordinator']
    },
    { 
      icon: <TrendingUp size={20} />, 
      label: "Profile", 
      link: "/ProfilePage",
      roles: ['general', 'member', 'coordinator']
    },
    { 
      icon: <Users size={20} />, 
      label: "Create Club", 
      link: "/CreateClubPage",
      roles: ['general']
    },
    { 
      icon: <Calendar size={20} />, 
      label: "My Join Requests", 
      link: "/JoinRequestsPage",
      roles: ['general', 'member']
    },
    { 
      icon: <Settings size={20} />, 
      label: "Settings", 
      link: "/SettingsPage",
      roles: ['general', 'member', 'coordinator']
    },
    {
      icon: <Settings size={20} />,
      label: "Logout", 
      link: "{}",
      roles: ['general', 'member', 'coordinator']
    }
  ];

  // Club-specific navigation items for members
  const memberNavItems = [
    { 
      icon: <Home size={20} />, 
      label: "Club Dashboard", 
      link: "/MemberDash",
      roles: ['member', 'coordinator']
    },
    { 
      icon: <MessageSquare size={20} />, 
      label: "Announcements", 
      link: "/Announcements",
      roles: ['member', 'coordinator']
    },
    { 
      icon: <Calendar size={20} />, 
      label: "Events", 
      link: "/Events",
      roles: ['member', 'coordinator']
    },
    { 
      icon: <Users size={20} />, 
      label: "Members", 
      link: "/Members",
      roles: ['member', 'coordinator']
    },
    { 
      icon: <BookOpen size={20} />, 
      label: "Resources", 
      link: "/Resources",
      roles: ['member', 'coordinator']
    }
  ];

  // Coordinator-specific navigation items
  const coordinatorNavItems = [
    { 
      icon: <UserCheck size={20} />, 
      label: "Join Requests", 
      link: "/JoinRequests",
      roles: ['coordinator']
    },
    { 
      icon: <FileText size={20} />, 
      label: "Minutes of Meeting", 
      link: "/MoM",
      roles: ['coordinator']
    },
    { 
      icon: <Bell size={20} />, 
      label: "Manage Announcements", 
      link: "/ManageAnnouncements",
      roles: ['coordinator']
    },
    { 
      icon: <BarChart3 size={20} />, 
      label: "Analytics", 
      link: "/Analytics",
      roles: ['coordinator']
    },
    { 
      icon: <Shield size={20} />, 
      label: "Club Settings", 
      link: "/ClubSettings",
      roles: ['coordinator']
    }
  ];

  // Combine navigation items based on user role and status
  const getNavItems = () => {
    let items = [];

    // Add general items based on role
    items = items.concat(generalNavItems.filter(item => 
      item.roles.includes(userRole)
    ));

    // Add member items if user is a member or coordinator
    if (currentClub && (userStatus === 'member' || userStatus === 'coordinator')) {
      items = items.concat(memberNavItems.filter(item => 
        item.roles.includes(userStatus)
      ));
    }

    // Add coordinator items if user is a coordinator
    if (currentClub && userStatus === 'coordinator') {
      items = items.concat(coordinatorNavItems.filter(item => 
        item.roles.includes(userStatus)
      ));
    }

    return items;
  };

  const navItems = getNavItems();

  const handleNavClick = (link) => {
    navigate(link);
  };

  const isActive = (link) => {
    return location.pathname === link;
  };

  return (
    <div className="sidebar-nav">
      <div className="sidebar-header">
        <div className="logo-title">
          <div className="logo">
            <span>CM</span>
          </div>
          <h1>Club Matrix</h1>
        </div>
        {currentClub && (
          <div className="current-club">
            <div className="club-badge">
              <Star size={16} />
              <span>{currentClub.name}</span>
            </div>
            <div className="user-role">
              {userStatus === 'coordinator' ? 'Coordinator' : 'Member'}
            </div>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        <div className="nav-items">
          {navItems.map(({ icon, label, link }, idx) => (
            <div
              key={idx}
              className={`nav-item ${isActive(link) ? "active" : ""}`}
              onClick={() => handleNavClick(link)}
            >
              {icon}
              <span>{label}</span>
            </div>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="logout-wrapper">
            <button className="logout" onClick={handleLogout}>
            Logout
            </button>
          </div>
        
          <div className="user-avatar">
            <span>JD</span>
          </div>
          <div className="user-details">
            <p>John Doe</p>
            <p className="role">
              {userStatus === 'coordinator' ? 'Coordinator' : 
               userStatus === 'member' ? 'Member' : 'Student'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
