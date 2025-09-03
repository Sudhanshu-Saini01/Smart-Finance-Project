// client/src/components/layout/AdminSidebar/AdminSidebar.jsx
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { LayoutDashboard, Users, LogOut } from "lucide-react";
import "./AdminSidebar.css"; // We'll use the same styles as the main sidebar

const AdminSidebar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <NavLink to="/admin">A.</NavLink>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/admin" className="nav-link" end>
              <LayoutDashboard size={20} />
              <span className="link-text">Admin Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users" className="nav-link">
              <Users size={20} />
              <span className="link-text">Manage Users</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button onClick={logout} className="nav-link logout-btn" title="Logout">
          <LogOut size={20} />
          <span className="link-text">Logout</span>
        </button>
      </div>
    </aside>
  );
};
export default AdminSidebar;
