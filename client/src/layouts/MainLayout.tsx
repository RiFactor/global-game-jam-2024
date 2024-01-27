import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import NavBar from "../components/NavBar";

const MainLayout = () => {
  return (
    <div>
      <Header />
      {/* <NavBar /> */}
      <Outlet />
    </div>
  );
};

export default MainLayout;
