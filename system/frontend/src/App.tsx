import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "./store/auth/AuthProvider";
import CurrentExamProvider from "./store/exam/CurrentExamProvider";
import Layout from "./components/Layout";
// import MainRoutes from "./MainRoutes"; // Assuming you're using React Router
import LoginPage from "./pages/LoginPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CurrentExamProvider>
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </Layout>
        </CurrentExamProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
