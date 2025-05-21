import { createContext } from "react";

export interface IAuthContext {
  username: string;
  id: string;
  token: string;
  role: string;
  login: (
    id: string,
    username: string,
    role: string,
    token: string,
    existingExpiryDate?: Date
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({
  username: "",
  id: "",
  token: "",
  role: "",
  login: () => {},
  logout: () => {},
});

export default AuthContext;
