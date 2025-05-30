import React, { useContext } from "react";
import { Card, CardActions, CardContent, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStopwatch } from "react-timer-hook";
import AuthContext from "../../store/auth/AuthContext";
import CurrentExamContext from "../../store/exam/CurrentExamContext";
import { useHttpClient } from "../../hooks/http";
import Spinner from "../ui/Spinner";
import { Exam } from "../../types/Exam";

interface StudentExamPreviewProps {
  exam: Exam;
}

const isExamWithin10Mins = (exam: Exam) => {
  const now = new Date();
  const examDate = new Date(exam.startDateTime);
  const diffInMins = (examDate.getTime() - now.getTime()) / (1000 * 60);
  return diffInMins <= 10;
};

const isExamEnded = (exam: Exam) => {
  const now = new Date();
  const examEnd = new Date(exam.startDateTime);
  examEnd.setMinutes(examEnd.getMinutes() + exam.duration);
  return now > examEnd;
};

const formatNumberTwoDigits = (number: number) => {
  return number.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });
};

const StudentExamPreview: React.FC<StudentExamPreviewProps> = ({ exam }) => {
  const authCTX = useContext(AuthContext);
  const currentExamCTX = useContext(CurrentExamContext);
  const navigate = useNavigate();

  const { isLoading, errorTitle, errorDetails, sendRequest, clearError } =
    useHttpClient();
  const { seconds, minutes, start, reset } = useStopwatch({ autoStart: false });

  const formattedDate = new Date(exam.startDateTime).toLocaleString();

  const connectToExam = async () => {
    try {
      start();
      const data = await sendRequest(
        "http://localhost:8080/student/connect-to-exam",
        "PATCH",
        JSON.stringify({
          username: authCTX.username,
          examID: exam.id,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      reset();
      const { publicIP, tempPassword } = data;
      currentExamCTX.setCurrentExam(exam.id, publicIP, tempPassword);

      if (!data.error) {
        navigate("/students/exams/current-exam");
      }
    } catch (err) {
      console.error(err);
    }
  };

  let examCardAction;
  if (isExamEnded(exam)) {
    examCardAction = (
      <p className="text-white font-bold text-center">Exam ended.</p>
    );
  } else if (isExamWithin10Mins(exam) && !exam.invigilationInstanceSocketID) {
    examCardAction = (
      <button
        className="bg-primary text-white text-lg font-bold px-6 py-4 rounded-full hover:shadow-lg transition-all"
        onClick={connectToExam}
      >
        Connect to Exam
      </button>
    );
  } else {
    examCardAction = (
      <p className="text-white font-bold text-center max-w-[30rem]">
        Connecting to the exam is allowed only 10 minutes before its start time,
        and an Instructor must have started invigilation.
      </p>
    );
  }

  return (
    <>
      <Card className="m-8 min-w-[320px] max-w-[35rem] rounded-[2.5rem]">
        <CardContent className="p-0 text-center rounded-[2.5rem]">
          <div className="bg-primary text-white py-5 rounded-t-[2.5rem]">
            <h1 className="m-0 text-xl font-bold">{exam.courseName}</h1>
          </div>
          <div className="py-6 px-8 space-y-2">
            <h2 className="text-lg font-semibold">{exam.name}</h2>
            <h2>Duration: {exam.duration} minutes</h2>
            <h3>Date: {formattedDate}</h3>
          </div>
        </CardContent>
        <CardActions className="flex justify-center items-center py-6">
          {examCardAction}
        </CardActions>
      </Card>

      <Modal open={!!errorTitle} onClose={clearError}>
        <div className="bg-white p-8 rounded-2xl w-[90%] max-w-md mx-auto mt-40 text-center shadow-2xl space-y-4">
          <h1 className="text-xl font-bold text-red-600">{errorTitle}</h1>
          <p className="text-gray-700">{errorDetails?.[0]}</p>
          <button
            onClick={clearError}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-full font-semibold"
          >
            Ok
          </button>
        </div>
      </Modal>

      <Modal open={isLoading}>
        <div className="bg-white p-8 rounded-2xl w-[90%] max-w-md mx-auto mt-40 text-center shadow-2xl space-y-4">
          <p className="text-gray-800">
            Creating the exam instance for the first time takes about 2 and a
            half minutes.
          </p>
          <Spinner />
          <p className="text-gray-700 font-semibold">Elapsed Time</p>
          <p className="text-xl font-mono">
            {`${formatNumberTwoDigits(minutes)}:${formatNumberTwoDigits(
              seconds
            )}`}
          </p>
        </div>
      </Modal>
    </>
  );
};

export default StudentExamPreview;
