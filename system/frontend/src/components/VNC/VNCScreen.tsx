// VNCScreen.tsx
import React, { useRef, useContext } from "react";
import { VncScreen as ReactVncScreen, VncScreenHandle } from "react-vnc";
import CurrentExamContext from "../../store/exam/CurrentExamContext";
import VNCScreenLayout from "./VNCScreenLayout";

const VNCScreen: React.FC = () => {
  const vncScreenRef = useRef<VncScreenHandle>(null);
  const currentExamCTX = useContext(CurrentExamContext);

  const credentials = {
    username: "user", // can be dummy
    password: "testing@Password1",
    target: "vnc", // can be a dummy value if not used by your server
  };

  return (
    <VNCScreenLayout screenRef={vncScreenRef}>
      <ReactVncScreen
        ref={vncScreenRef}
        url={`ws://${currentExamCTX.instanceIP}:6080`}
        scaleViewport
        retryDuration={1000}
        rfbOptions={{ credentials }}
        className="w-full h-full"
      />
    </VNCScreenLayout>
  );
};

export default VNCScreen;
