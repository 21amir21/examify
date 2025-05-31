import React from "react";
import CreateExamForm from "../../../components/CreateExamForm";

const CreateExamPage: React.FC = () => {
  return (
    <>
      <h1 className="text-white text-3xl font-semibold mb-6">
        Create Exam Form
      </h1>
      <CreateExamForm />
    </>
  );
};

export default CreateExamPage;
