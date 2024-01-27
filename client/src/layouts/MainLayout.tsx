import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
      MainLayout
      <Outlet />
    </div>
  );
};

export default MainLayout;
