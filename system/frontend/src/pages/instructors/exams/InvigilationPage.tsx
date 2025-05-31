import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "@mui/material";
import Peer from "simple-peer";
import { io, Socket } from "socket.io-client";
import { useHttpClient } from "../../../hooks/http";
import StudentsMediaVideoList from "../../../components/Invigilation/StudentsMediaVideoList";
import Spinner from "../../../components/ui/Spinner";

const InvigilationPage: React.FC = () => {
  const socket = useRef<Socket | null>(null);
  const [isWaitingForStudents, setIsWaitingForStudents] = useState(true);
  const [studentStreams, setStudentStreams] = useState<
    Map<string, MediaStream>
  >(new Map());

  const { examID } = useParams();
  const { sendRequest } = useHttpClient();

  const putInStudentStreamsMap = (username: string, stream: MediaStream) => {
    setStudentStreams((prev) => new Map(prev.set(username, stream)));
  };

  const getIPAddress = async () => {
    return await sendRequest("https://geolocation-db.com/json/", "GET");
  };

  const updateInvigilationInstanceInfo = async (socketID: string) => {
    const { IPv4 } = await getIPAddress();
    const invigilationInfoUpdate = {
      socketID,
      instanceIP: IPv4,
      examID,
    };

    await sendRequest(
      "http://localhost:8080/exam-management/update-exam-invigilation-info",
      "PATCH",
      JSON.stringify(invigilationInfoUpdate),
      { "Content-Type": "application/json" }
    );
  };

  useEffect(() => {
    socket.current = io("http://localhost:8080", {
      path: "/invigilation",
    });

    socket.current.on("givenSocketID", async (id: string) => {
      await updateInvigilationInstanceInfo(id);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.current.on("incomingConnection", (data: any) => {
      const { studentSocketID, username, signal } = data;
      acceptIncomingConnection(username, studentSocketID, signal);
    });

    return () => {
      socket.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptIncomingConnection = (
    studentUsername: string,
    studentSocketID: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    studentSignal: any
  ) => {
    const peer = new Peer({ initiator: false });

    peer.on("signal", (data) => {
      socket.current?.emit("acceptIncomingConnection", {
        signal: data,
        toStudentSocketID: studentSocketID,
      });
    });

    peer.on("stream", (stream: MediaStream) => {
      putInStudentStreamsMap(studentUsername, stream);
      setIsWaitingForStudents(false);
    });

    peer.signal(studentSignal);
  };

  return (
    <div className="w-full h-full">
      <StudentsMediaVideoList studentStreams={studentStreams} />

      <Modal open={isWaitingForStudents}>
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white/95 p-12 w-[30%] min-h-[400px] rounded-[50px] flex flex-col justify-center items-center text-center">
            <Spinner />
            <p className="text-lg font-semibold mt-6">
              Waiting for students to connect to their exams...
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InvigilationPage;
