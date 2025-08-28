import React, { useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Users,
  Calendar,
  Shield,
  Globe,
  Lock,
  TrendingUp,
  UserCheck,
  UserX,
  CheckCircle,
  LogOut,
  Settings,
  Bell,
  Search,
  Menu,
  LayoutDashboard,
  FileBarChart2,
  ClipboardList
} from 'lucide-react';
import './AdminDashboard.css';

const CustomCard = ({ children, className = "" }) => (
  <div className={`custom-card ${className}`}>
    {children}
  </div>
);

const CustomCardHeader = ({ children, className = "" }) => (
  <div className={`custom-card-header ${className}`}>
    {children}
  </div>
);

const CustomCardTitle = ({ children, className = "" }) => (
  <h3 className={`custom-card-title ${className}`}>
    {children}
  </h3>
);

const CustomCardDescription = ({ children, className = "" }) => (
  <p className={`custom-card-description ${className}`}>
    {children}
  </p>
);

const CustomCardContent = ({ children, className = "" }) => (
  <div className={`custom-card-content ${className}`}>
    {children}
  </div>
);

const AdminSidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/");
  };
  const sidebarItems = [
    { title: 'Overview', icon: LayoutDashboard, url: '/AdminDashboard' },
    { title: 'Clubs', icon: Users, url: '/AdminDashboard/clubs' },
    { title: 'Events', icon: Calendar, url: '/AdminDashboard/events' },
    { title: 'Approve Clubs', icon: CheckCircle, url: '/AdminDashboard/approve' },
    { title: 'Block Clubs', icon: UserX, url: '/AdminDashboard/block' },
    { title: 'Unblock Clubs', icon: UserCheck, url: '/AdminDashboard/unblock' },
    { title: 'Reports', icon: FileBarChart2, url: '/AdminDashboard/reports' },
    { title: 'Settings', icon: Settings, url: '/AdminDashboard/settings' },
    { title: 'Notifications', icon: Bell, url: '/AdminDashboard/notifications' }
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-header-content">
          <div className="brand">
            <div className="brand-logo">CM</div>
            <h2 className="sidebar-title">Admin</h2>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <item.icon className="icon-sm" />
            <span className="sidebar-item-text">{item.title}</span>
          </NavLink>
        ))}

        <button className="sidebar-item logout" type="button" onClick={handleLogout}>
          <LogOut className="icon-sm" />
          <span className="sidebar-item-text">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

const DashboardMetrics = () => {
  const metrics = [
    { title: 'Clubs', value: '2,910', delta: '+2.1%', icon: Users },
    { title: 'Events', value: '16,004', delta: '+3.8%', icon: Calendar },
    { title: 'Public', value: '1,960', delta: '+1.9%', icon: Globe },
    { title: 'Private', value: '950', delta: '+0.8%', icon: Lock }
  ];

  return (
    <div className="kpis">
      {metrics.map((m) => (
        <div key={m.title} className="kpi">
          <div className="kpi-icon"><m.icon className="icon-sm" /></div>
          <div className="kpi-content">
            <div className="kpi-title">{m.title}</div>
            <div className="kpi-value-row">
              <div className="kpi-value">{m.value}</div>
              <div className="kpi-delta">{m.delta}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ClubGrowthChart = () => {
  const data = useMemo(() => ([
    { month: 'Jan', clubs: 400, events: 240 },
    { month: 'Feb', clubs: 500, events: 320 },
    { month: 'Mar', clubs: 650, events: 480 },
    { month: 'Apr', clubs: 800, events: 620 },
    { month: 'May', clubs: 950, events: 750 },
    { month: 'Jun', clubs: 1200, events: 890 },
    { month: 'Jul', clubs: 1450, events: 1020 },
    { month: 'Aug', clubs: 1680, events: 1200 },
    { month: 'Sep', clubs: 1920, events: 1350 },
    { month: 'Oct', clubs: 2150, events: 1480 },
    { month: 'Nov', clubs: 2400, events: 1650 },
    { month: 'Dec', clubs: 2650, events: 1820 }
  ]), []);

  const maxValue = Math.max(...data.map((d) => Math.max(d.clubs, d.events)));

  return (
    <CustomCard className="col-span-2">
      <CustomCardHeader>
        <CustomCardTitle>Growth (Last 12 months)</CustomCardTitle>
        <CustomCardDescription>Clubs vs Events</CustomCardDescription>
      </CustomCardHeader>
      <CustomCardContent>
        <div className="line-chart">
          {data.map((item, idx) => (
            <div key={item.month} className="line-point" style={{ left: `${(idx / (data.length - 1)) * 100}%` }}>
              <div className="line clubs" style={{ height: `${(item.clubs / maxValue) * 160 + 20}px` }} />
              <div className="line events" style={{ height: `${(item.events / maxValue) * 160 + 20}px` }} />
              <span className="point-label">{item.month}</span>
            </div>
          ))}
          <div className="line-gradient clubs" />
          <div className="line-gradient events" />
        </div>
        <div className="legend">
          <div className="legend-item"><div className="legend-color clubs"></div>Clubs</div>
          <div className="legend-item"><div className="legend-color events"></div>Events</div>
        </div>
      </CustomCardContent>
    </CustomCard>
  );
};

const ClubTypeDistribution = () => {
  const publicClubs = 1923;
  const privateClubs = 924;
  const total = publicClubs + privateClubs;
  const publicPercentage = (publicClubs / total) * 100;

  return (
    <CustomCard>
      <CustomCardHeader>
        <CustomCardTitle>Club Type Distribution</CustomCardTitle>
        <CustomCardDescription>Public vs Private clubs ratio</CustomCardDescription>
      </CustomCardHeader>
      <CustomCardContent>
        <div className="distribution-chart">
          <div
            className="pie-chart"
            style={{
              background: `conic-gradient(var(--primary) 0deg ${publicPercentage * 3.6}deg, var(--secondary) ${publicPercentage * 3.6}deg 360deg)`
            }}
          >
            <div className="pie-center">
              <div className="total">{total}</div>
              <div className="total-label">Total Clubs</div>
            </div>
          </div>
          <div className="distribution-details">
            <div className="distribution-item">
              <div className="legend-item"><div className="legend-color clubs"></div>Public Clubs</div>
              <div className="value">{publicClubs}</div>
              <div className="percentage">{publicPercentage.toFixed(1)}%</div>
            </div>
            <div className="distribution-item">
              <div className="legend-item"><div className="legend-color events"></div>Private Clubs</div>
              <div className="value">{privateClubs}</div>
              <div className="percentage">{(100 - publicPercentage).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </CustomCardContent>
    </CustomCard>
  );
};

const QuickActions = () => (
  <CustomCard>
    <CustomCardHeader>
      <CustomCardTitle>Quick Actions</CustomCardTitle>
      <CustomCardDescription>Moderate and manage faster</CustomCardDescription>
    </CustomCardHeader>
    <CustomCardContent>
      <div className="actions-grid">
        <NavLink to="/AdminDashboard/approve" className="action-btn"><CheckCircle className="icon-sm" /> Approve Clubs</NavLink>
        <NavLink to="/AdminDashboard/block" className="action-btn"><UserX className="icon-sm" /> Block Clubs</NavLink>
        <NavLink to="/AdminDashboard/unblock" className="action-btn"><UserCheck className="icon-sm" /> Unblock Clubs</NavLink>
        <NavLink to="/AdminDashboard/events" className="action-btn"><Calendar className="icon-sm" /> Create Event</NavLink>
        <NavLink to="/AdminDashboard/reports" className="action-btn"><FileBarChart2 className="icon-sm" /> View Reports</NavLink>
        <NavLink to="/AdminDashboard/settings" className="action-btn"><Settings className="icon-sm" /> Settings</NavLink>
      </div>
    </CustomCardContent>
  </CustomCard>
);

const ActivityChart = () => {
  const data = [
    { name: 'Mon', active: 120, pending: 30, blocked: 5 },
    { name: 'Tue', active: 145, pending: 25, blocked: 8 },
    { name: 'Wed', active: 130, pending: 35, blocked: 3 },
    { name: 'Thu', active: 160, pending: 20, blocked: 7 },
    { name: 'Fri', active: 180, pending: 15, blocked: 4 },
    { name: 'Sat', active: 200, pending: 18, blocked: 2 },
    { name: 'Sun', active: 175, pending: 22, blocked: 6 }
  ];

  const maxValue = Math.max(...data.map((d) => d.active + d.pending + d.blocked));

  return (
    <CustomCard>
      <CustomCardHeader>
        <CustomCardTitle>Weekly Club Activity</CustomCardTitle>
        <CustomCardDescription>Club status distribution by day</CustomCardDescription>
      </CustomCardHeader>
      <CustomCardContent>
        <div className="activity-chart">
          {data.map((item) => {
            const activeHeight = (item.active / maxValue) * 240;
            const pendingHeight = (item.pending / maxValue) * 240;
            const blockedHeight = (item.blocked / maxValue) * 240;

            return (
              <div key={item.name} className="activity-bar">
                <div className="activity-bar-inner">
                  <div className="bar active" style={{ height: `${activeHeight}px` }} />
                  <div className="bar pending" style={{ height: `${pendingHeight}px` }} />
                  <div className="bar blocked" style={{ height: `${blockedHeight}px` }} />
                </div>
                <span className="bar-label">{item.name}</span>
              </div>
            );
          })}
        </div>
        <div className="legend">
          <div className="legend-item"><div className="legend-color active"></div>Active</div>
          <div className="legend-item"><div className="legend-color pending"></div>Pending</div>
          <div className="legend-item"><div className="legend-color blocked"></div>Blocked</div>
        </div>
      </CustomCardContent>
    </CustomCard>
  );
};

const AdminDashboard = () => {
  const location = useLocation();
  const section = (location.pathname.split('/')[2] || '').toLowerCase();

  const headerTitle = (
    section === '' ? 'Overview' :
    section === 'approve' ? 'Approve Clubs' :
    section === 'block' ? 'Block Clubs' :
    section === 'unblock' ? 'Unblock Clubs' :
    section === 'events' ? 'Events' :
    section === 'users' ? 'User Management' :
    section === 'reports' ? 'Reports' :
    section === 'settings' ? 'Settings' :
    section === 'notifications' ? 'Notifications' :
    section === 'clubs' ? 'Clubs' : 'Overview'
  );

  const renderContent = () => {
    if (section === '' || section === 'overview') {
      return (
        <>
          <div className="intro">
            <h2 className="intro-title">Club Matrix Admin</h2>
            <p className="intro-subtitle">Manage and monitor club activities across the platform</p>
          </div>

          <DashboardMetrics />

          <div className="grid-3">
            <ClubGrowthChart />
            <QuickActions />
          </div>

          <div className="grid-2">
            <ActivityChart />
            <CustomCard>
              <CustomCardHeader>
                <CustomCardTitle>Recent Activities</CustomCardTitle>
                <CustomCardDescription>Latest club management actions</CustomCardDescription>
              </CustomCardHeader>
              <CustomCardContent>
                <div className="recent-activities">
                  {[
                    { action: 'New club approved', club: 'Tech Innovators', time: '2 minutes ago' },
                    { action: 'Club blocked', club: 'Spam Club 123', time: '15 minutes ago' },
                    { action: 'Event created', club: 'Book Readers', time: '1 hour ago' },
                    { action: 'Club unblocked', club: 'Photography Fans', time: '2 hours ago' },
                    { action: 'New club pending', club: 'Gaming Masters', time: '3 hours ago' }
                  ].map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-dot"></div>
                      <div className="activity-text">
                        <p className="activity-action">{activity.action}</p>
                        <p className="activity-club">{activity.club}</p>
                      </div>
                      <p className="activity-time">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </CustomCardContent>
            </CustomCard>
          </div>
        </>
      );
    }

    const Simple = ({ title }) => (
      <CustomCard>
        <CustomCardHeader>
          <CustomCardTitle>{title}</CustomCardTitle>
          <CustomCardDescription>Coming soon</CustomCardDescription>
        </CustomCardHeader>
        <CustomCardContent>
          <p>Build out the {title.toLowerCase()} workflow here.</p>
        </CustomCardContent>
      </CustomCard>
    );

    if (section === 'approve') return <Simple title="Approve Clubs" />;
    if (section === 'block') return <Simple title="Block Clubs" />;
    if (section === 'unblock') return <Simple title="Unblock Clubs" />;
    if (section === 'events') return <Simple title="Events" />;
    if (section === 'users') return <Simple title="User Management" />;
    if (section === 'reports') return <Simple title="Reports" />;
    if (section === 'settings') return <Simple title="Settings" />;
    if (section === 'notifications') return <Simple title="Notifications" />;
    if (section === 'clubs') return <Simple title="Clubs" />;

    return <Simple title="Overview" />;
  };

  return (
    <div className="dashboard-wrapper">
      <AdminSidebar />

      <div className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="header-title">{headerTitle}</h1>
            <div className="header-right">
              <div className="search-box">
                <Search className="search-icon" />
                <input className="search-input" placeholder="Search clubs..." />
              </div>
              <div className="profile-icon">
                <Shield className="icon-sm text-primary" />
              </div>
            </div>
          </div>
        </header>

        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;


