import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import NavBar from "../components/NavBar";

const MainLayout = () => {
  return (
    <div className="flex flex-col w-screen h-screen bg-black">
      {/* <Header /> */}
      {/* <NavBar /> */}
      <Outlet />
    </div>
  );
};

export default MainLayout;
