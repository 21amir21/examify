import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center my-5">
      <div className="relative w-10 h-10 rotate-45">
        <div className="absolute w-1/2 h-1/2 animate-foldingCube origin-bottom-right bg-primary sk-cube sk-cube1" />
        <div className="absolute w-1/2 h-1/2 animate-foldingCube origin-bottom-right bg-primary sk-cube sk-cube2 rotate-90" />
        <div className="absolute w-1/2 h-1/2 animate-foldingCube origin-bottom-right bg-primary sk-cube sk-cube3 rotate-180" />
        <div className="absolute w-1/2 h-1/2 animate-foldingCube origin-bottom-right bg-primary sk-cube sk-cube4 rotate-[270deg]" />
      </div>
    </div>
  );
};

export default Spinner;
