import React from "react";

interface BackdropProps {
  show: boolean;
  clicked: () => void;
}

const Backdrop: React.FC<BackdropProps> = ({ show, clicked }) => {
  if (!show) return null;

  return (
    <div
      onClick={clicked}
      className="fixed inset-0 z-[100] bg-black/50 w-full h-full"
    />
  );
};

export default Backdrop;
