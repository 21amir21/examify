import React from "react";
import { Card, CardActions, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Exam } from "../../types/Exam";

interface InstructorExamPreviewProps {
  exam: Exam;
}

const InstructorExamPreview: React.FC<InstructorExamPreviewProps> = ({
  exam,
}) => {
  const navigate = useNavigate();
  const formattedDate = new Date(exam.startDateTime).toLocaleString();

  const handleClick = () => {
    navigate(`/instructors/exams/invigilation?examID=${exam.id}`);
  };

  return (
    <Card className="m-8 min-w-[320px] max-w-[35rem] rounded-[2.5rem] shadow-lg">
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
        <button
          onClick={handleClick}
          className="bg-primary text-white text-lg font-bold px-8 py-4 rounded-full hover:drop-shadow-[0_0_25px_gray] transition-all"
        >
          Go to Invigilation Page
        </button>
      </CardActions>
    </Card>
  );
};

export default InstructorExamPreview;
