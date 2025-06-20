import React from "react";
import { NavLink } from "react-router-dom";

import "./Navbar.css";

const Navbar = () => {
  const role = localStorage.getItem("role") || "CLIENT";

  const pages = {
    CLIENT: [
      { text: "Community", link: "/CommunityPage" },
    ],
    ADMIN: [
      { text: "Dashboard", link: "/AdminDashboard" },
    ],
  };

  const navLinks = pages[role] || [];

  const handleLogout = () => {
    localStorage.removeItem("role");
    window.location.href = "/Login";
  };

  return (
    <>
      <div className="top-navbar">
        <div className="logo-title">
          <span className="title-text">Club Matrix</span>
        </div>
      </div>

      <div className="sidebar">
        <div>
          <ul className="nav-links">
            {navLinks.map((item, index) => (
              <li key={index} className="navbox">
                <NavLink
                  to={item.link}
                  className={({ isActive }) =>
                    isActive ? "navlink active" : "navlink"
                  }
                >
                  {item.icon && <span className="nav-icon">{item.icon}</span>}
                  {item.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="logout-wrapper">
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;