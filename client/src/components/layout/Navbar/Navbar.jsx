// // client/src/components/layout/Navbar.jsx

// // --- Core Imports ---
// import React, { useContext } from "react";
// // NavLink is a special version of a link used with React Router. It's "aware" of the current URL
// // and can apply a special style (like an "active" class) to the link that matches the current page.
// import { NavLink } from "react-router-dom";
// // This imports the AuthContext to get access to the `logout` function.
// import { AuthContext } from "@/context/AuthContext";
// // This imports a library of clean, modern icons to be used in the navigation links.
// import {
//   LayoutDashboard,
//   ArrowRightLeft,
//   Target,
//   PiggyBank,
//   Landmark,
//   LogOut,
//   Wallet,
// } from "lucide-react";
// // --- Stylesheet Import ---
// import "./Navbar.css";

// /**
//  * @component Navbar
//  * @desc      The main navigation bar for the application. It is displayed on all pages
//  * once a user is logged in.
//  */
// const Navbar = () => {
//   // Accessing the `logout` function from the global AuthContext.
//   const { logout } = useContext(AuthContext);

//   return (
//     <nav className="navbar">
//       {/* The brand or logo section of the navbar, which links back to the dashboard. */}
//       <div className="navbar-brand">
//         <NavLink to="/">SmartFinance</NavLink>
//       </div>

//       {/* The main list of navigation links. */}
//       <ul className="navbar-links">
//         <li>
//           <NavLink to="/">
//             <LayoutDashboard size={18} />
//             <span>Dashboard</span>
//           </NavLink>
//         </li>
//         {/* == Income Page Link == */}
//         <li>
//           <NavLink
//             to="/income"
//             className={({ isActive }) => (isActive ? "active" : "")}
//           >
//             <Wallet size={18} />
//             <span>Income</span>
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to="/transactions">
//             <ArrowRightLeft size={18} />
//             <span>Transactions</span>
//           </NavLink>
//         </li>

//         <li>
//           <NavLink to="/investments">
//             <PiggyBank size={18} />
//             <span>Savings & Investments</span>
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to="/goals">
//             <Target size={18} />
//             <span>Goals</span>
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to="/loans">
//             <Landmark size={18} />
//             <span>Loans</span>
//           </NavLink>
//         </li>
//       </ul>

//       {/* The logout button, which is styled separately from the navigation links. */}
//       <button onClick={logout} className="navbar-logout">
//         <LogOut size={16} />
//         <span>Logout</span>
//       </button>
//     </nav>
//   );
// };

// export default Navbar;

// client/src/components/Navbar.jsx

// // --- Core Imports ---
// import React, { useContext } from "react";
// import { NavLink } from "react-router-dom";
// import { AuthContext } from "@/context/AuthContext";

// // --- Icon Imports ---
// // We've added new icons for the new navigation links.
// import {
//   LayoutDashboard, // For Dashboard
//   Wallet, // For Income
//   GanttChartSquare, // For Fixed Expenses
//   ShoppingBag, // For Variable Expenses
//   ArrowRightLeft, // For All Transactions
//   PiggyBank, // For Savings
//   TrendingUp, // For Investments
//   Landmark, // For Loans
//   ShieldCheck, // For Insurance
//   LogOut, // For Logout
// } from "lucide-react";

// // --- Stylesheet Import ---
// import "./Navbar.css";

// /**
//  * @component Navbar
//  * @desc      The main navigation bar for the application, organized in a logical financial flow.
//  */
// const Navbar = () => {
//   // Accessing the `logout` function from the global AuthContext.
//   const { logout } = useContext(AuthContext);

//   return (
//     <nav className="navbar">
//       {/* The brand logo, linking back to the main dashboard. */}
//       <div className="navbar-brand">
//         <NavLink to="/">SmartFinance</NavLink>
//       </div>

//       {/* Main navigation links, ordered for an intuitive user journey. */}
//       <ul className="navbar-links">
//         {/* 1. Dashboard - The overview page */}
//         <li>
//           <NavLink to="/">
//             <LayoutDashboard size={18} />
//             <span>Dashboard</span>
//           </NavLink>
//         </li>

//         {/* 2. Income - Where money comes in */}
//         <li>
//           <NavLink to="/income">
//             <Wallet size={18} />
//             <span>Income</span>
//           </NavLink>
//         </li>

//         {/* 3. Fixed Expenses - Recurring, predictable costs */}
//         <li>
//           <NavLink to="/fixedExpenses">
//             <GanttChartSquare size={18} />
//             <span>Fixed Expenses</span>
//           </NavLink>
//         </li>

//         {/* 4. Variable Expenses - Day-to-day spending */}
//         <li>
//           <NavLink to="/variableExpenses">
//             <ShoppingBag size={18} />
//             <span>Variable Expenses</span>
//           </NavLink>
//         </li>

//         {/* 5. All Transactions - Detailed log of all movements */}
//         <li>
//           <NavLink to="/transactions">
//             <ArrowRightLeft size={18} />
//             <span>All Transactions</span>
//           </NavLink>
//         </li>

//         {/* 6. Savings - Setting money aside */}
//         <li>
//           <NavLink to="/savings">
//             <PiggyBank size={18} />
//             <span>Savings</span>
//           </NavLink>
//         </li>

//         {/* 7. Investments - Growing your wealth */}
//         <li>
//           <NavLink to="/investments">
//             <TrendingUp size={18} />
//             <span>Investments</span>
//           </NavLink>
//         </li>

//         {/* 8. Loans - Managing debt */}
//         <li>
//           <NavLink to="/loans">
//             <Landmark size={18} />
//             <span>Loans</span>
//           </NavLink>
//         </li>

//         {/* 9. Insurance - Financial protection */}
//         <li>
//           <NavLink to="/insurance">
//             <ShieldCheck size={18} />
//             <span>Insurance</span>
//           </NavLink>
//         </li>
//       </ul>

//       {/* The logout button at the bottom of the navigation. */}
//       <button onClick={logout} className="navbar-logout">
//         <LogOut size={16} />
//         <span>Logout</span>
//       </button>
//     </nav>
//   );
// };

// export default Navbar;

// client/src/components/Navbar.jsx

// --- Core Imports ---
import React, { useState, useContext, useEffect, useRef } from "react"; // Added useState
import { NavLink } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

// --- Icon Imports ---
import {
  LayoutDashboard,
  Wallet,
  ArrowRightLeft,
  TrendingUp,
  PiggyBank,
  Landmark,
  ShieldCheck,
  GanttChartSquare,
  ShoppingBag,
  LogOut,
  ChevronDown, // New icon for the dropdown button
  UserCircle2,
} from "lucide-react";

// --- Stylesheet Import ---
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  // State to manage the visibility of the dropdown menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // // Function to toggle the menu's visibility
  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  // A helper to close the dropdown when a link is clicked
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">SmartFinance</NavLink>
      </div>

      <ul className="navbar-links">
        {/* ---- VISIBLE LINKS ---- */}
        <li>
          <NavLink to="/">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/income">
            <Wallet size={18} />
            <span>Income</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/transactions">
            <ArrowRightLeft size={18} />
            <span>All Transactions</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/investments">
            <TrendingUp size={18} />
            <span>Investments</span>
          </NavLink>
        </li>

        {/* ---- "MORE" DROPDOWN MENU ---- */}
        {/* <li className="navbar-menu-container">
          <button onClick={toggleMenu} className="navbar-menu-button">
            <span>More</span>
            <ChevronDown size={16} />
          </button> */}

        <li className="navbar-menu-container" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="navbar-menu-button"
          >
            <span>More</span>
            <ChevronDown
              size={16}
              className={`chevron-icon ${isMenuOpen ? "open" : ""}`}
            />
          </button>

          {/* Conditionally render the dropdown menu if isMenuOpen is true */}
          {isMenuOpen && (
            <ul className="dropdown-menu">
              <li>
                <NavLink to="/fixedExpenses" onClick={handleLinkClick}>
                  <GanttChartSquare size={18} />
                  <span>Fixed Expenses</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/variableExpenses" onClick={handleLinkClick}>
                  <ShoppingBag size={18} />
                  <span>Variable Expenses</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/savings" onClick={handleLinkClick}>
                  <PiggyBank size={18} />
                  <span>Savings</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/loans" onClick={handleLinkClick}>
                  <Landmark size={18} />
                  <span>Loans</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/insurance" onClick={handleLinkClick}>
                  <ShieldCheck size={18} />
                  <span>Insurance</span>
                </NavLink>
              </li>
            </ul>
          )}
        </li>
      </ul>

      {/* --- 2. UPDATED USER ACTIONS SECTION --- */}
      <div className="navbar-user-actions">
        <NavLink to="/profile" className="navbar-profile-link" title="Profile">
          <UserCircle2 size={22} />
          <span>{user?.name}</span>
        </NavLink>
        <button onClick={logout} className="navbar-logout" title="Logout">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
