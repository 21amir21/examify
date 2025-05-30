import React, { useState, ReactNode } from "react";
import Toolbar from "./Navigation/Toolbar";
import SideDrawer from "./Navigation/SideDrawer";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);

  const sideDrawerClosedHandler = () => {
    setSideDrawerIsVisible(false);
  };

  const sideDrawerToggleHandler = () => {
    setSideDrawerIsVisible((prevState) => !prevState);
  };

  return (
    <>
      <Toolbar drawerToggleClicked={sideDrawerToggleHandler} />
      <SideDrawer open={sideDrawerIsVisible} closed={sideDrawerClosedHandler} />
      <main className="pt-[120px] flex flex-col min-h-screen justify-center items-center">
        {children}
      </main>
    </>
  );
};

export default Layout;
