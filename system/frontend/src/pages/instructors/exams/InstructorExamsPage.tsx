import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Modal } from "@mui/material";
import { Exam } from "../../../types/Exam";
import { useHttpClient } from "../../../hooks/http";
import AuthContext from "../../../store/auth/AuthContext";
import ExamsList from "../../../components/Exams/ExamList";
import Spinner from "../../../components/ui/Spinner";

const InstructorExamsPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[] | null>(null);
  const { isLoading, errorTitle, errorDetails, sendRequest, clearError } =
    useHttpClient();
  const authCTX = useContext(AuthContext);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:8080/instructor/exams?username=${authCTX.username}`,
          "GET"
        );
        setExams(data.instructorExams);
      } catch (err) {
        console.error(err);
      }
    };
    fetchExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendRequest]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Create Exam Button */}
      <div className="bg-[#292f6bce] rounded-[50px] w-4/5 flex justify-center items-center p-5 my-5">
        <div className="bg-white text-black font-bold text-xl py-5 px-12 rounded-[25px] hover:drop-shadow-[0_0_10px_rgba(204,22,113,0.54)] transition-shadow">
          <Link to="/instructors/exams/create-exam">Create Exam</Link>
        </div>
      </div>

      {/* Exams List */}
      <div className="bg-white/35 drop-shadow-[0_0_20px_[#292f6b]] rounded-[50px] w-4/5 my-5">
        {!isLoading && exams && (
          <ExamsList exams={exams} previewType="InstructorPreview" />
        )}
      </div>

      {/* Error Modal */}
      <Modal
        open={!!errorTitle}
        onClose={clearError}
        className="flex items-center justify-center"
      >
        <div className="bg-white/95 p-12 w-[30%] min-h-[400px] rounded-[50px] flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold mb-4">{errorTitle}</h1>
          <p className="text-lg font-semibold">{errorDetails?.[0]}</p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={clearError}
              className="mt-6 bg-[#292f6bce]/30 text-white font-medium py-2 px-6 rounded-[25px] hover:bg-[#4c5183ee] transition-colors"
            >
              Ok
            </button>
          </div>
        </div>
      </Modal>

      {/* Loading Modal */}
      <Modal open={isLoading} className="flex items-center justify-center">
        <div className="bg-white/95 p-12 w-[30%] min-h-[400px] rounded-[50px] flex items-center justify-center">
          <Spinner />
        </div>
      </Modal>
    </div>
  );
};

export default InstructorExamsPage;
