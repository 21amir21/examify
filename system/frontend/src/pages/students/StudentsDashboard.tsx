import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../store/auth/AuthContext";

const StudentsDashboard: React.FC = () => {
  const authCTX = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md shadow-[0px_0px_50px_black] rounded-[50px] p-24 text-white">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">
          Welcome back{" "}
          <span className="text-yellow-300">{authCTX.username}</span>!
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center">
        <p className="font-bold text-lg tracking-widest mb-4">
          Check upcoming exams...
        </p>
        <div className="bg-white rounded-[25px] px-8 py-4 m-2 cursor-pointer hover:shadow-[0px_0px_10px_rgba(204,22,113,0.541)] transition-shadow duration-300">
          <Link to="/students/exams">
            <span className="font-bold text-xl text-transparent bg-gradient-to-r from-blue-800 via-red-600 to-orange-500 bg-[length:280%] bg-clip-text animate-gradient-text">
              Go to Exams Page
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentsDashboard;
