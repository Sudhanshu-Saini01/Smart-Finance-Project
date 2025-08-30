// client/src/components/layout/Sidebar/Sidebar.jsx

import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Wallet,
  ArrowRightLeft,
  TrendingUp,
  PiggyBank,
  Landmark,
  ShieldCheck,
  GanttChartSquare,
  LogOut,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);

  const navLinks = [
    { to: "/", icon: <LayoutDashboard size={20} />, text: "Dashboard" },
    { to: "/income", icon: <Wallet size={20} />, text: "Income" },
    {
      to: "/transactions",
      icon: <ArrowRightLeft size={20} />,
      text: "Transactions",
    },
    { to: "/investments", icon: <TrendingUp size={20} />, text: "Investments" },
    { to: "/savings", icon: <PiggyBank size={20} />, text: "Savings" },
    { to: "/loans", icon: <Landmark size={20} />, text: "Loans" },
    { to: "/insurance", icon: <ShieldCheck size={20} />, text: "Insurance" },
    {
      to: "/fixedExpenses",
      icon: <GanttChartSquare size={20} />,
      text: "Fixed Expenses",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <NavLink to="/">W.</NavLink>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className="nav-link" title={link.text}>
                {link.icon}
                <span className="link-text">{link.text}</span>
              </NavLink>
            </li>
          ))}
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

export default Sidebar;
