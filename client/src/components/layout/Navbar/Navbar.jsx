// client/src/components/Navbar.jsx

// --- Core Imports ---
import React, { useContext } from "react";
// NavLink is a special version of a link used with React Router. It's "aware" of the current URL
// and can apply a special style (like an "active" class) to the link that matches the current page.
import { NavLink } from "react-router-dom";
// This imports the AuthContext to get access to the `logout` function.
import { AuthContext } from "@/context/AuthContext";
// This imports a library of clean, modern icons to be used in the navigation links.
import {
  LayoutDashboard,
  ArrowRightLeft,
  Target,
  PiggyBank,
  Landmark,
  LogOut,
  // ===================================================================
  // == UPDATE: 2025-08-23 | Add Income Page Link ==
  // We import a new icon for our "Income" page link.
  Wallet,
  // ===================================================================
} from "lucide-react";
// --- Stylesheet Import ---
import "./Navbar.css";

/**
 * @component Navbar
 * @desc      The main navigation bar for the application. It is displayed on all pages
 * once a user is logged in.
 */
const Navbar = () => {
  // Accessing the `logout` function from the global AuthContext.
  const { logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      {/* The brand or logo section of the navbar, which links back to the dashboard. */}
      <div className="navbar-brand">
        <NavLink to="/">SmartFinance</NavLink>
      </div>

      {/* The main list of navigation links. */}
      <ul className="navbar-links">
        <li>
          <NavLink to="/">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/transactions">
            <ArrowRightLeft size={18} />
            <span>Transactions</span>
          </NavLink>
        </li>
        {/* =================================================================== */}
        {/* == UPDATE: 2025-08-23 | Add Income Page Link == */}
        {/* This is the new link to our dedicated Income management page. */}
        <li>
          <NavLink to="/income">
            <Wallet size={18} />
            <span>Income</span>
          </NavLink>
        </li>
        {/* =================================================================== */}
        <li>
          <NavLink to="/investments">
            <PiggyBank size={18} />
            <span>Savings & Investments</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/goals">
            <Target size={18} />
            <span>Goals</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/loans">
            <Landmark size={18} />
            <span>Loans</span>
          </NavLink>
        </li>
      </ul>

      {/* The logout button, which is styled separately from the navigation links. */}
      <button onClick={logout} className="navbar-logout">
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </nav>
  );
};

export default Navbar;
