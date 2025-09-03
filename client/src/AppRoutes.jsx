// client/src/AppRoutes.jsx
import React, { useContext, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from "./context/AuthContext";

import PublicLayout from "@/components/layout/PublicLayout/PublicLayout";
import AppLayout from './AppLayout';
import NotificationContainer from "@/components/ui/Notification/Notification";

// Lazy load ONLY public-facing pages here
const LandingPage = React.lazy(() => import('@/features/landing/LandingPage'));
const LoginPage = React.lazy(() => import('@/features/authentication/LoginPage'));
const SignupPage = React.lazy(() => import('@/features/authentication/SignupPage'));

const AppRoutes = () => {
  const { token, isLoading: authLoading } = useContext(AuthContext);

  if (authLoading) {
    return <div className="loading-fullscreen">Initializing App...</div>;
  }

  return (
    <div className="app-container">
      <NotificationContainer />
      <Suspense fallback={<div className="loading-fullscreen">Loading Page...</div>}>
        <Routes>
          {token ? (
            // ALL logged-in users are handled by AppLayout
            <Route path="/*" element={<AppLayout />} />
          ) : (
            // Public routes for visitors
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          )}
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppRoutes;