import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../store/auth/AuthContext";
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    if (authCtx.role === "Student") {
      navigate("/students");
    } else if (authCtx.role === "Instructor") {
      navigate("/instructors");
    }
  }, [authCtx.role, navigate]);

  return <LoginForm />;
};

export default LoginPage;
