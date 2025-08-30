// client/src/components/layout/PublicLayout/PublicLayout.jsx

import React from "react";
import { Outlet } from "react-router-dom"; // Outlet is a placeholder for the child page content
import LandingNavbar from "../LandingNavbar/LandingNavbar";
import LandingFooter from "../LandingFooter/LandingFooter";

const PublicLayout = () => {
  return (
    <>
      <LandingNavbar />
      <main>
        {/* The Outlet component will render the specific page 
            (e.g., LandingPage, LoginPage, etc.) */}
        <Outlet />
      </main>
      <LandingFooter />
    </>
  );
};

export default PublicLayout;
