import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../store/auth/AuthContext";

const InstructorsDashboard: React.FC = () => {
  const authCTX = useContext(AuthContext);

  return (
    <div className="flex flex-col justify-center items-center bg-[#292f6bce]/30 drop-shadow-[0_0_50px_black] rounded-[50px] p-[100px] text-white text-center">
      {/* Welcome */}
      <div className="mb-12">
        <h1 className="text-3xl font-semibold">
          Welcome back{" "}
          <span className="font-bold text-white">{authCTX.username}</span>!
        </h1>
      </div>

      {/* Exams Navigation */}
      <div className="flex flex-col justify-center items-center">
        <p className="font-bold text-lg tracking-wider mb-4">
          Check assigned exams...
        </p>
        <div className="bg-white rounded-[25px] px-8 py-5 cursor-pointer hover:drop-shadow-[0_0_10px_rgba(204,22,113,0.541)] transition-shadow">
          <Link to="/instructors/exams">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-900 via-red-600 to-orange-500 bg-[length:280%] bg-clip-text text-transparent animate-animated-text">
              Go to Exams Page
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InstructorsDashboard;
