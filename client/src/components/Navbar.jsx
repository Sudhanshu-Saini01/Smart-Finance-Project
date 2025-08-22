// // client/src/components/Navbar.jsx
// // /----- VERSION V2 -----/

// import React, { useContext } from "react";
// import { NavLink } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import "./Navbar.css";

// const Navbar = () => {
//   const { logout } = useContext(AuthContext);

//   return (
//     <nav className="navbar">
//       <div className="navbar-brand">
//         <NavLink to="/">SmartFinance</NavLink>
//       </div>
//       <ul className="navbar-links">
//         <li>
//           <NavLink to="/">Dashboard</NavLink>
//         </li>
//         <li>
//           <NavLink to="/transactions">Transactions</NavLink>
//         </li>
//         <li>
//           <NavLink to="/goals">Goals</NavLink>
//         </li>
//         <li>
//           <NavLink to="/investments">Savings & Investments</NavLink>
//         </li>
//         <li>
//           <NavLink to="/loans">Loans</NavLink>
//         </li>
//       </ul>
//       <button onClick={logout} className="navbar-logout">
//         Logout
//       </button>
//     </nav>
//   );
// };

// export default Navbar;
// // /----- END VERSION V2 -----/

// client/src/components/Navbar.jsx
// /----- VERSION V2.1 -----/ Difference is only it is addings icons to navbar
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
// 1. Import the icons we need
import {
  LayoutDashboard,
  ArrowRightLeft,
  Target,
  PiggyBank,
  Landmark,
  LogOut,
} from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">SmartFinance</NavLink>
      </div>
      <ul className="navbar-links">
        {/* 2. Add icons next to each link */}
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
      <button onClick={logout} className="navbar-logout">
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </nav>
  );
};

export default Navbar;
// /----- END VERSION V2 -----/
