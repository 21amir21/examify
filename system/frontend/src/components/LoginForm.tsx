import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Avatar, Modal } from "@mui/material";
import { LockOpenOutlined } from "@mui/icons-material";
import { useHttpClient } from "../hooks/http";
import AuthContext from "../store/auth/AuthContext";
import Spinner from "./ui/Spinner";

interface LoginFormInputs {
  username: string;
  password: string;
  role: "Student" | "Instructor";
}

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const { isLoading, errorTitle, errorDetails, sendRequest, clearError } =
    useHttpClient();

  const navigate = useNavigate();

  const authCtx = useContext(AuthContext);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (formData) => {
    try {
      const responseData = await sendRequest(
        "http://localhost:8080/auth/login",
        "POST",
        JSON.stringify(formData),
        {
          "Content-Type": "application/json",
        }
      );

      const { userId, username, role, token } = responseData;
      authCtx.login(userId, username, role, token);

      if (role === "Student") {
        navigate("/students");
      } else if (role === "Instructor") {
        navigate("/instructors");
      }
    } catch (err) {
      console.log("Error signing in.", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center bg-primary/70 px-20 py-20 m-20 rounded-[50px] shadow-[0_1px_20px_rgba(0,0,0,0.7)]"
    >
      <Avatar
        sx={{
          width: "80px",
          height: "80px",
          backgroundColor: "white",
          marginBottom: "30px",
          filter: "drop-shadow(0px 0px 20px rgba(204, 22, 113, 0.479))",
        }}
      >
        <LockOpenOutlined
          sx={{ fill: "#292f6b", width: "50px", height: "50px" }}
        />
      </Avatar>

      {/* Username */}
      <div className="flex flex-col items-center justify-center m-2.5 w-full">
        <input
          type="text"
          placeholder="Username"
          className="rounded-full w-72 h-8 p-2.5 border-none"
          {...register("username", { required: true })}
        />
        {errors.username && (
          <p className="text-white font-bold p-2.5 bg-black/80 rounded-full w-72 text-center mt-2">
            Username cannot be empty
          </p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col items-center justify-center m-2.5 w-full">
        <input
          type="password"
          placeholder="Password"
          className="rounded-full w-72 h-8 p-2.5 border-none"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <p className="text-white font-bold p-2.5 bg-black/80 rounded-full w-72 text-center mt-2">
            Password cannot be empty
          </p>
        )}
      </div>

      {/* Role Radio Buttons */}
      <div className="flex flex-row justify-center items-center mt-4">
        <div className="m-2 text-white cursor-pointer">
          <input
            type="radio"
            value="Student"
            id="role-student"
            defaultChecked
            className="accent-blue-600 mr-1"
            {...register("role", { required: true })}
          />
          <label htmlFor="role-student" className="cursor-pointer">
            Student
          </label>
        </div>
        <div className="m-2 text-white cursor-pointer">
          <input
            type="radio"
            value="Instructor"
            id="role-instructor"
            className="accent-blue-600 mr-1"
            {...register("role", { required: true })}
          />
          <label htmlFor="role-instructor" className="cursor-pointer">
            Instructor
          </label>
        </div>
      </div>
      {errors.role && (
        <p className="text-white font-bold p-2.5 bg-black/80 rounded-full w-72 text-center mt-2">
          Role cannot be empty
        </p>
      )}

      {/* Submit Button */}
      <input
        className="mt-8 rounded-full bg-white shadow-[0px_15px_50px_black] px-10 py-2 font-bold border-none hover:bg-white/90 hover:scale-110 transition-transform duration-200 filter drop-shadow-[0px_0px_10px_rgba(204,22,113,0.541)] cursor-pointer"
        type="submit"
        value="Login"
      />

      {/* Error Modal */}
      <Modal open={!!errorTitle} onClose={clearError}>
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <h1 className="text-xl font-bold mb-2">{errorTitle}</h1>
            <p className="mb-4">{errorDetails?.[0]}</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={clearError}
            >
              Ok
            </button>
          </div>
        </div>
      </Modal>

      {/* Loading Spinner Modal */}
      <Modal open={isLoading}>
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <Spinner />
        </div>
      </Modal>
    </form>
  );
};

export default LoginForm;
