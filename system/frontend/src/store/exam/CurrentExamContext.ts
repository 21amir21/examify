import { createContext } from "react";

export interface ICurrentExamContext {
  examID: string;
  instanceIP: string;
  tempPassword: string;
  setCurrentExam: (
    examID: string,
    instanceIP: string,
    tempPassword: string
  ) => void;
  clearCurrentExam: () => void;
}

// Default values just for type inference and IDE support
const CurrentExamContext = createContext<ICurrentExamContext>({
  examID: "",
  instanceIP: "",
  tempPassword: "",
  setCurrentExam: () => {},
  clearCurrentExam: () => {},
});

export default CurrentExamContext;
