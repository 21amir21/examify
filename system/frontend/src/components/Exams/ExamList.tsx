import React from "react";
import InstructorExamPreview from "./InstructorExamPreview";
import StudentExamPreview from "./StudentExamPreview";
import { Exam } from "../../types/Exam";

interface ExamsListProps {
  exams: Exam[];
  previewType: "StudentPreview" | "InstructorPreview";
}

const ExamsList: React.FC<ExamsListProps> = ({ exams, previewType }) => {
  const sortedExams = [...exams].sort((a, b) =>
    a.startDateTime < b.startDateTime ? -1 : 1
  );

  const examPreviews = {
    StudentPreview: sortedExams.map((exam) => (
      <StudentExamPreview key={exam.id} exam={exam} />
    )),
    InstructorPreview: sortedExams.map((exam) => (
      <InstructorExamPreview key={exam.id} exam={exam} />
    )),
  };

  return (
    <div className="flex flex-wrap justify-center items-center py-20 text-white">
      {examPreviews[previewType]}
    </div>
  );
};

export default ExamsList;
