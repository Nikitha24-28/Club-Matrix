# Reusable Navigation Component

This is a comprehensive, reusable navigation component that dynamically adapts based on user roles and status in the Club Matrix application.

## Features

- **Dynamic Navigation**: Automatically shows different menu items based on user role and status
- **Role-Based Access**: Supports three user types: general, member, and coordinator
- **Club Context**: Shows current club information when user is in a club context
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Active State Management**: Highlights the current active page
- **Smooth Animations**: Includes hover effects and smooth transitions

## User Roles & Status

### General Client (userRole: 'general')
- Public Clubs
- Profile
- Create Club
- My Join Requests
- Settings

### Club Member (userStatus: 'member')
- All general items (except Create Club)
- Club Dashboard
- Announcements
- Events
- Members
- Resources

### Club Coordinator (userStatus: 'coordinator')
- All member items
- Join Requests
- Minutes of Meeting
- Manage Announcements
- Analytics
- Club Settings

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `userRole` | string | 'general' | The user's general role ('general', 'member', 'coordinator') |
| `userStatus` | string | 'member' | The user's specific status within clubs ('member', 'coordinator') |
| `currentClub` | object | null | Current club object with name and other details |

## Usage Examples

### Basic Usage (General Client)
```jsx
import Nav from '../Nav/Nav';

function CommunityPage() {
  return (
    <div className="page-container">
      <Nav userRole="general" />
      <div className="main-content">
        {/* Your page content */}
      </div>
    </div>
  );
}
```

### Club Member Usage
```jsx
import Nav from '../Nav/Nav';

function MemberDashboard() {
  const currentClub = {
    name: "Tech Innovators",
    id: "tech-innovators-123"
  };

  return (
    <div className="page-container">
      <Nav 
        userRole="member" 
        userStatus="member" 
        currentClub={currentClub}
      />
      <div className="main-content">
        {/* Your page content */}
      </div>
    </div>
  );
}
```

### Coordinator Usage
```jsx
import Nav from '../Nav/Nav';

function CoordinatorDashboard() {
  const currentClub = {
    name: "Design Studio",
    id: "design-studio-456"
  };

  return (
    <div className="page-container">
      <Nav 
        userRole="coordinator" 
        userStatus="coordinator" 
        currentClub={currentClub}
      />
      <div className="main-content">
        {/* Your page content */}
      </div>
    </div>
  );
}
```

## Integration with Existing Pages

### 1. Update CommunityPage.jsx
Replace the existing sidebar with the new Nav component:

```jsx
import Nav from '../Nav/Nav';

const CommunityPage = () => {
  return (
    <div className="community-page">
      <Nav userRole="general" />
      {/* Rest of your content */}
    </div>
  );
};
```

### 2. Update JoinRequests.jsx
```jsx
import Nav from '../Nav/Nav';

const JoinRequests = () => {
  const currentClub = {
    name: "Tech Innovators"
  };

  return (
    <div className="join-requests-container">
      <Nav 
        userRole="coordinator" 
        userStatus="coordinator" 
        currentClub={currentClub}
      />
      {/* Rest of your content */}
    </div>
  );
};
```

### 3. Update Announcements.jsx
```jsx
import Nav from '../Nav/Nav';

const AnnouncementsPage = () => {
  const currentClub = {
    name: "Design Studio"
  };

  return (
    <div className="announcements-container">
      <Nav 
        userRole="coordinator" 
        userStatus="coordinator" 
        currentClub={currentClub}
      />
      {/* Rest of your content */}
    </div>
  );
};
```

## CSS Integration

The component includes its own CSS file (`Nav.css`). Make sure to:

1. Import the CSS file in your Nav component
2. Adjust your main content area to account for the sidebar width:

```css
.main-content {
  margin-left: 280px; /* Width of the sidebar */
  padding: 2rem;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
}
```

## Future Expansion

The component is designed to be easily extensible:

1. **Add New Navigation Items**: Simply add new items to the appropriate arrays (`generalNavItems`, `memberNavItems`, `coordinatorNavItems`)
2. **Add New Roles**: Extend the role system by adding new role types and their corresponding navigation items
3. **Custom Icons**: Use any Lucide React icons or custom SVG icons
4. **Additional Props**: Add new props for customization without breaking existing functionality

## Notes

- The component uses React Router for navigation
- All icons are from Lucide React library
- The component is fully responsive and mobile-friendly
- Active state is automatically managed based on current route
- No dummy links or placeholder logic included - only functional navigation items
