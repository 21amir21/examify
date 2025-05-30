import React from "react";
import DrawerToggle from "./DrawerToggle";
import NavigationItems from "./NavigationItems";

interface ToolbarProps {
  drawerToggleClicked: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ drawerToggleClicked }) => {
  return (
    <header className="fixed top-0 left-0 w-full h-[100px] bg-primary flex justify-between items-center pl-5 z-[90] box-border">
      <DrawerToggle clicked={drawerToggleClicked} />
      <div className="flex items-center">
        <img src="/images/logo.png" alt="Logo" className="w-[250px] h-[90px]" />
      </div>
      <nav className="hidden sm:block h-full">
        <NavigationItems />
      </nav>
    </header>
  );
};

export default Toolbar;
