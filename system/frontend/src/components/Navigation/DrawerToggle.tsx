import React from "react";

interface DrawerToggleProps {
  clicked: () => void;
}

const DrawerToggle: React.FC<DrawerToggleProps> = ({ clicked }) => {
  return (
    <div
      onClick={clicked}
      className="w-10 h-full flex flex-col justify-around items-center py-2 box-border cursor-pointer md:hidden"
    >
      <div className="w-[90%] h-[3px] bg-white"></div>
      <div className="w-[90%] h-[3px] bg-white"></div>
      <div className="w-[90%] h-[3px] bg-white"></div>
    </div>
  );
};

export default DrawerToggle;
