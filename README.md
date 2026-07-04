# Club Matrix

A full-stack club management platform for colleges — built with React, Node.js, Express, and MySQL.

## What it does

Club Matrix lets students discover, join, and manage college clubs through a role-based system with three access levels:

- **Admin** — block/unblock clubs, view platform-wide analytics
- **Coordinator** — manage club members, post announcements, create events, set targets, record MoMs, handle join requests
- **Member** — view club activity, track events and announcements, submit join requests

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router, Axios, Sonner |
| Backend | Node.js, Express 5, MySQL2 |
| Auth | JWT (jsonwebtoken), bcrypt |
| Styling | CSS Modules, Lucide React icons |
| Scheduling | node-cron |

## Architecture
Club-Matrix/               
├── frontend/                  # React + Vite                   
│   └── src/                                                         
│       ├── api/               # Axios instance with JWT interceptor                                
│       ├── pages/                                                       
│       │   ├── Admin/         # Admin dashboard                                  
│       │   ├── Client/                                  
│       │   │   ├── ClubDashboard/                                               
│       │   │   │   ├── components/   # Announcements, Events, Targets, Members                              
│       │   │   │   └── hooks/        # useClubDashboard custom hook                                           
│       │   │   ├── Common/    # CommunityPage, Profile, JoinRequests                                          
│       │   │   └── Coordinator/      # MoM, MyClubs                                            
│       │   └── priorlogin/   # Login, Signup                                                   
│       └── components/        # Shared layout components                                                     
└── backend/                                                          
├── server.js              # Entry point (~55 lines)                                     
└── src/                                                             
├── config/            # DB connection pool                                                    
├── middleware/        # JWT auth + role verification                                          
├── routes/            # auth, clubs, moms, admin                                               
└── controllers/      # Business logic per domain                                              

 
## Security

- Passwords hashed with **bcrypt** (salt rounds: 10)
- **JWT authentication** on all protected routes (24h expiry)
- **Role-based access control** — admin routes verify `req.user.role === 'ADMIN'`
- `.env` excluded from version control via `.gitignore`
- Parameterized SQL queries throughout (no SQL injection risk)
- Axios interceptor auto-attaches Bearer token; auto-redirects on 401/403

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+

### 1. Clone the repo
```bash
git clone https://github.com/Nikitha24-28/Club-Matrix.git
cd Club-Matrix
```

### 2. Set up the backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=club_matrix
DB_DIALECT=mysql
JWT_SECRET=your_secret_key_here
```

```bash
node server.js
```

### 3. Set up the frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Create the database
Import your MySQL schema into a database named `club_matrix`.

The app runs at `http://localhost:5173` with the backend at `http://localhost:5000`.

## Key Features

- JWT-secured REST API with role-based middleware
- Club lifecycle management — creation, membership, blocking, auto-deletion after 30 days
- Coordinator dashboard with announcements, events, targets, MoMs, join request handling
- Admin panel with club analytics, block/unblock controls
- Automated cron job deletes clubs blocked for 30+ days
- Axios interceptor layer handles auth token injection and session expiry

## Roadmap

- [ ] Cloudinary integration for MoM file uploads
- [ ] Email notifications via Nodemailer
- [ ] Deployment — Render (backend) + Vercel (frontend)
- [ ] Input validation with express-validator
- [ ] Jest + Supertest integration tests
