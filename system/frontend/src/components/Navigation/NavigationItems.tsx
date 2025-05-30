import React, { useContext } from "react";
import NavigationItem from "./NavigationItem";
import AuthContext from "../../store/auth/AuthContext";

const NavigationItems: React.FC = () => {
  const authCtx = useContext(AuthContext);

  return (
    <ul className="m-0 p-0 list-none flex flex-col items-center h-full md:flex-row">
      {authCtx.role === "Student" && (
        <>
          <NavigationItem link="/students">Dashboard</NavigationItem>
          <NavigationItem link="/students/exams">Exams</NavigationItem>
          <div className="m-0 h-full" onClick={authCtx.logout}>
            <NavigationItem link="/login">Logout</NavigationItem>
          </div>
        </>
      )}

      {authCtx.role === "Instructor" && (
        <>
          <NavigationItem link="/instructors">Dashboard</NavigationItem>
          <NavigationItem link="/instructors/exams">Exams</NavigationItem>
          <div className="m-0 h-full" onClick={authCtx.logout}>
            <NavigationItem link="/login">Logout</NavigationItem>
          </div>
        </>
      )}

      {!authCtx.role && <NavigationItem link="/login">Login</NavigationItem>}
    </ul>
  );
};

export default NavigationItems;
