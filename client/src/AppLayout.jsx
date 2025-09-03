// client/src/AppLayout.jsx
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from '@/context/AuthContext';

import Navbar from "@/components/layout/Navbar/Navbar"; // Your logged-in Navbar
import AdminSidebar from '@/components/layout/AdminSidebar/AdminSidebar'; // The new admin sidebar
import AdminPage from '@/features/admin/AdminPage';

// Import all your page components here
import DashboardPage from "./features/dashboard/DashboardPage";
import TransactionsPage from "@/features/transactions/TransactionsPage";
import GoalsPage from "@/features/goals/GoalsPage";
import InvestmentsPage from "@/features/investments/InvestmentsPage";
import SavingsPage from "@/features/savings/SavingsPage";
import InsurancePage from "@/features/insurance/InsurancePage";
import LoansPage from "@/features/loans/LoansPage";
import IncomePage from "@/features/income/IncomePage";
import FixedExpensesPage from "@/features/expenses/FixedExpensesPage";
import VariableExpensesPage from "@/features/expenses/VariableExpensesPage";

const AppLayout = () => {
  const { user } = useContext(AuthContext); // Get the user object


  return (
    <div className="app-layout">
      
      {user?.role === 'admin' ? <AdminSidebar /> : <Navbar />}

      <main className="main-content-area">
        {/* All your authenticated routes are now cleanly defined here */}
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/investments" element={<InvestmentsPage />} />
          <Route path="/savings" element={<SavingsPage />} />
          <Route path="/insurance" element={<InsurancePage />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="/fixedExpenses" element={<FixedExpensesPage />} />
          <Route path="/variableExpenses" element={<VariableExpensesPage />} />

          {/* Admin-Only Routes */}
          <Route path="/admin" element={user?.role === 'admin' ? <AdminPage /> : <Navigate to="/" />} />
          {/* Add other admin routes like /admin/users here later */}

          {/* Any other unknown route for a logged-in user redirects to the dashboard */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppLayout;
