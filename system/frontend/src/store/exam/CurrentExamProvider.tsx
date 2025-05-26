import { ReactNode, useState } from "react";
import CurrentExamContext, { ICurrentExamContext } from "./CurrentExamContext";

interface CurrentExamProviderProps {
  children: ReactNode;
}

const CurrentExamProvider: React.FC<CurrentExamProviderProps> = ({
  children,
}) => {
  const [examID, setExamID] = useState<string>("");
  const [instanceIP, setInstanceIP] = useState<string>("");
  const [tempPassword, setTempPassword] = useState<string>("");

  const currentExamContext: ICurrentExamContext = {
    examID,
    instanceIP,
    tempPassword,
    setCurrentExam: (examID: string, ip: string, tempPass: string) => {
      setExamID(examID);
      setInstanceIP(ip);
      setTempPassword(tempPass);

      // TODO: see if u are gonna need it
      // Optional: persist to localStorage if needed
      // localStorage.setItem(
      //   "currentExam",
      //   JSON.stringify({ ip, tempPass })
      // );
    },
    clearCurrentExam: () => {
      setExamID("");
      setInstanceIP("");
      setTempPassword("");

      // TODO: see if u are gonna need it
      // Optional: clear from localStorage
      // localStorage.removeItem("currentExam");
    },
  };

  return (
    <CurrentExamContext.Provider value={currentExamContext}>
      {children}
    </CurrentExamContext.Provider>
  );
};

export default CurrentExamProvider;
