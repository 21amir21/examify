import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "./store/auth/AuthProvider";
import CurrentExamProvider from "./store/exam/CurrentExamProvider";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import StudentsDashboard from "./pages/students/StudentsDashboard";
import InstructorsDashboard from "./pages/instructors/InstructorsDashboard";
import InstructorExamsPage from "./pages/instructors/exams/InstructorExamsPage";
import CreateExamPage from "./pages/instructors/exams/CreateExamPage";
import StudentExamsPage from "./pages/students/exams/StudentExamsPage";
import CurrentExamPage from "./pages/students/exams/CurrentExamPage";
import InvigilationPage from "./pages/instructors/exams/InvigilationPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CurrentExamProvider>
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/students" element={<StudentsDashboard />} />
              <Route path="/students/exams" element={<StudentExamsPage />} />
              <Route
                path="/students/exams/current-exam"
                element={<CurrentExamPage />}
              />
              <Route path="/instructors" element={<InstructorsDashboard />} />
              <Route
                path="/instructors/exams"
                element={<InstructorExamsPage />}
              />
              <Route
                path="/instructors/exams/create-exam"
                element={<CreateExamPage />}
              />
              <Route
                path="/instructors/exams/invigilation"
                element={<InvigilationPage />}
              />
            </Routes>
          </Layout>
        </CurrentExamProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
