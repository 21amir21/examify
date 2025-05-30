import React from "react";
import { NavLink } from "react-router-dom";

interface NavigationItemProps {
  link: string;
  exact?: boolean;
  children: React.ReactNode;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ link, children }) => {
  return (
    <li className="w-full md:w-auto md:h-full flex items-center my-2 md:my-0 box-border">
      <NavLink
        to={link}
        className={({ isActive }) =>
          `text-white w-full flex items-center justify-center box-border
          md:h-full md:px-5 md:border-b-4 md:border-transparent
          hover:bg-[#0a0f42b2] hover:border-white hover:text-white
          ${
            isActive ? "bg-[#0a0f42b2] border-b-4 border-white text-white" : ""
          }`
        }
      >
        {children}
      </NavLink>
    </li>
  );
};

export default NavigationItem;
