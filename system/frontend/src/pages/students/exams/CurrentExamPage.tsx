import React, { useEffect, useState, useRef, useContext } from "react";
import Peer from "simple-peer";
import { io, Socket } from "socket.io-client";
import AuthContext from "../../../store/auth/AuthContext";
import CurrentExamContext from "../../../store/exam/CurrentExamContext";
import { useHttpClient } from "../../../hooks/http";
import VNCScreen from "../../../components/VNC/VNCScreen";

const CurrentExamPage: React.FC = () => {
  const socket = useRef<Socket | null>(null);
  const [mySocketID, setMySocketID] = useState<string | null>(null);
  const [invigilationInstanceSocketID, setInvigilationInstanceSocketID] =
    useState<string | null>(null);

  const authCTX = useContext(AuthContext);
  const currentExamContext = useContext(CurrentExamContext);

  const { sendRequest } = useHttpClient();

  useEffect(() => {
    const fetchExamInvigilationInfo = async () => {
      try {
        const { exam } = await sendRequest(
          `http://localhost:8080/exam-management/?examID=${currentExamContext.examID}`,
          "GET"
        );
        if (exam.invigilationInstance) {
          setInvigilationInstanceSocketID(exam.invigilationInstance.socketID);
        }
      } catch (err) {
        console.error("Error fetching exam info:", err);
      }
    };

    fetchExamInvigilationInfo();

    socket.current = io("http://localhost:8080", {
      path: "/invigilation",
    });

    socket.current.on("givenSocketID", (id: string) => {
      setMySocketID(id);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [currentExamContext.examID, sendRequest]);

  useEffect(() => {
    if (invigilationInstanceSocketID) {
      shareStudentMediaToInvigilationInstance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invigilationInstanceSocketID]);

  const getStudentScreenMedia = async (constraints: MediaStreamConstraints) => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      return stream;
    } catch (err) {
      console.error("Error accessing screen media:", err);
      return null;
    }
  };

  const shareStudentMediaToInvigilationInstance = async () => {
    const media = await getStudentScreenMedia({ audio: true, video: true });
    if (
      !media ||
      !socket.current ||
      !mySocketID ||
      !invigilationInstanceSocketID
    )
      return;

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: media,
    });

    peer.on("signal", (data) => {
      socket.current?.emit("outgoingConnection", {
        fromStudentSocketID: mySocketID,
        toInvigilationSocketID: invigilationInstanceSocketID,
        signal: data,
        username: authCTX.username,
      });
    });

    socket.current.on("connectionAccepted", (signal: Peer.SignalData) => {
      peer.signal(signal);
    });
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
      <VNCScreen />
    </div>
  );
};

export default CurrentExamPage;
