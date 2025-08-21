// client/src/components/Navbar.jsx (NEW FILE)

import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">SmartFinance</NavLink>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/transactions">Transactions</NavLink>
        </li>
        {/* <li>
          <NavLink to="/wishlist">Wishlist</NavLink>
        </li>
        <li>
          <NavLink to="/savings">Savings</NavLink>
        </li> */}
        <li>
          <NavLink to="/goals">Goals</NavLink>
        </li>{" "}
        {/* NEW: Unified Goals link */}
        <li>
          <NavLink to="/investments">Savings & Investments</NavLink>
        </li>
        <li>
          <NavLink to="/loans">Loans</NavLink>
        </li>{" "}
        {/* NEW: Loans link */}
      </ul>
      <button onClick={logout} className="navbar-logout">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
