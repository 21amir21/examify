import { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../../hooks/http";
import { Modal } from "@mui/material";
import AuthContext from "../../../store/auth/AuthContext";
import { Exam } from "../../../types/Exam";
import ExamsList from "../../../components/Exams/ExamList";
import Spinner from "../../../components/ui/Spinner";

const StudentExamsPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[] | null>(null);
  const { isLoading, errorTitle, errorDetails, sendRequest, clearError } =
    useHttpClient();
  const authCTX = useContext(AuthContext);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:8080/student/exams?username=${authCTX.username}`,
          "GET"
        );
        setExams(data.studentExams);
      } catch (err) {
        console.error(err);
      }
    };
    fetchExams();
  }, [sendRequest, authCTX.username]);

  return (
    <div className="flex flex-col w-full items-center justify-center">
      {/* Logout Button */}
      <div className="bg-[#292f6bce]/30 rounded-[50px] w-4/5 flex justify-center items-center p-5 m-5">
        <button
          className="px-12 py-5 bg-white rounded-[25px] text-xl font-bold hover:cursor-pointer hover:drop-shadow-md hover:shadow-pink-400"
          onClick={authCTX.logout}
        >
          Logout
        </button>
      </div>

      {/* Exams List */}
      <div className="bg-white/40 drop-shadow-lg rounded-[50px] w-4/5 m-5">
        {!isLoading && exams && (
          <ExamsList exams={exams} previewType="StudentPreview" />
        )}
      </div>

      {/* Error Modal */}
      <Modal
        open={!!errorTitle}
        onClose={clearError}
        className="flex justify-center items-center"
      >
        <div className="bg-white/95 p-12 w-[30%] min-h-[400px] rounded-[50px] flex flex-col justify-center items-center text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {errorTitle}
          </h1>
          <p className="text-lg font-semibold text-gray-700">
            {errorDetails?.[0]}
          </p>
          <div className="flex justify-center items-center mt-8">
            <button
              onClick={clearError}
              className="mt-4 rounded-[25px] bg-[#292f6bce]/80 px-6 py-2 text-white text-lg hover:bg-[#4c5183ee]"
            >
              Ok
            </button>
          </div>
        </div>
      </Modal>

      {/* Loading Modal */}
      <Modal open={isLoading} className="flex justify-center items-center">
        <div className="bg-white/95 p-12 w-[30%] min-h-[400px] rounded-[50px] flex justify-center items-center">
          <Spinner />
        </div>
      </Modal>
    </div>
  );
};

export default StudentExamsPage;
