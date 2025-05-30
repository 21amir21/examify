import React, { useRef, useEffect } from "react";

interface StudentMediaVideoProps {
  studentStream: MediaStream | null;
  studentUsername: string;
}

const StudentMediaVideo: React.FC<StudentMediaVideoProps> = ({
  studentStream,
  studentUsername,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && studentStream) {
      videoRef.current.srcObject = studentStream;
    }
  }, [studentStream]);

  return (
    <li className="relative inline-block border border-black w-1/3 h-1/3">
      <div className="absolute top-0 left-0 w-full bg-black bg-opacity-80 text-white text-center text-lg p-1">
        <p>{studentUsername}</p>
      </div>
      <video ref={videoRef} autoPlay className="w-full h-full" />
    </li>
  );
};

export default StudentMediaVideo;
