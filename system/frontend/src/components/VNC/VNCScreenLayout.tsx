// VNCScreenLayout.tsx
import React, { useState, useContext, RefObject, ReactNode } from "react";
import CurrentExamContext from "../../store/exam/CurrentExamContext";
import { VncScreenHandle } from "react-vnc";

interface VNCScreenLayoutProps {
  screenRef: RefObject<VncScreenHandle | null>;
  children: ReactNode;
}

const VNCScreenLayout: React.FC<VNCScreenLayoutProps> = ({
  screenRef,
  children,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const currentExamContext = useContext(CurrentExamContext);

  const sendCtrlAltDelSequence = () => {
    const ref = screenRef.current;
    if (ref?.connected) {
      ref.sendCtrlAltDel();
    }
  };

  return (
    <div className="w-[75vw] h-[75vh]">
      <div className="bg-primary/80 rounded-[50px] flex justify-center items-center py-2 mb-5">
        <div className="mx-4">
          <button
            onClick={sendCtrlAltDelSequence}
            className="bg-secondary hover:drop-shadow-[0_0_10px_rgba(204,22,113,0.541)] text-white font-bold px-5 py-2 rounded-full text-lg"
          >
            Send Ctrl+Alt+Del Command
          </button>
        </div>
        <div className="flex items-center justify-center text-white mx-4">
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="bg-secondary hover:drop-shadow-[0_0_10px_rgba(204,22,113,0.541)] text-white font-bold px-5 py-2 rounded-full text-lg mr-6"
          >
            {showPassword ? "Hide" : "Show"} Temporary Password
          </button>
          <p className="min-w-[200px] text-white">
            {showPassword ? currentExamContext.tempPassword : "********"}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
};

export default VNCScreenLayout;
