import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface IProps {
  name?: string;
  to?: any;
  children?: ReactNode;
}

const NavButton = ({ name, to, children }: IProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-link font-bold w-18 ${isActive && "dark:text-cyan-300 underline "} `}
    >
      {name}
      {children}
    </NavLink>
  );
};

export default NavButton;
