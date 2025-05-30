import React from "react";
import Backdrop from "../ui/Backdrop";
import NavigationItems from "./NavigationItems";

interface SideDrawerProps {
  open: boolean;
  closed: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ open, closed }) => {
  return (
    <>
      <Backdrop show={open} clicked={closed} />
      <div
        onClick={closed}
        className={`fixed top-0 left-0 z-[200] w-[280px] max-w-[70%] h-full bg-black/90 p-8 box-border transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-[11%] mb-8 text-white">
          <h1>Examify</h1>
        </div>
        <nav>
          <NavigationItems />
        </nav>
      </div>
    </>
  );
};

export default SideDrawer;
