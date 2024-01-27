import React from "react";
import { Outlet } from "react-router-dom";
import RealHeader from "../components/RealHeader";
import NavBar from "../components/NavBar";

const MainLayout = () => {
  return (
    <div>
      <RealHeader />
      <NavBar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
