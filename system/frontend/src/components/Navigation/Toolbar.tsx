import React from "react";
import DrawerToggle from "./DrawerToggle";
import NavigationItems from "./NavigationItems";
import classes from "../../styles/Toolbar.module.css";

interface ToolbarProps {
  drawerToggleClicked: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ drawerToggleClicked }) => {
  return (
    <header className={classes.Toolbar}>
      <DrawerToggle clicked={drawerToggleClicked} />
      <div className={classes.Logo}>
        <img src="/logo.jpeg" alt="Logo" />
      </div>
      <nav className={classes.DesktopOnly}>
        <NavigationItems />
      </nav>
    </header>
  );
};

export default Toolbar;
