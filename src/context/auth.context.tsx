"use client";
import React, { createContext, useReducer, useContext, useEffect } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

interface AuthState {
  isAuthenticated: boolean | null;
}

interface AuthContextType {
  state: AuthState;
  login: (token: string) => void;
  logout: () => void;
  checkLogin: () => void;
}

const initialState: AuthState = {
  isAuthenticated: null,
};

type AuthAction =
  | { type: "LOGIN"; token: string }
  | { type: "LOGOUT" }
  | { type: "CHECK_LOGIN" }
  | { type: "LOAD_STATE"; isAuthenticated: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  const token = cookies.get("token");
  switch (action.type) {
    case "LOGIN":
      cookies.set("token", action.token);
      localStorage.setItem("isAuthenticated", "true");
      return { isAuthenticated: true };
    case "LOGOUT":
      cookies.remove("token");
      localStorage.setItem("isAuthenticated", "false");
      return { isAuthenticated: false };
    case "CHECK_LOGIN":
      localStorage.setItem("isAuthenticated", (!!token).toString());
      return { isAuthenticated: !!token };
    case "LOAD_STATE":
      return { isAuthenticated: action.isAuthenticated };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated:
      typeof window !== "undefined" &&
      localStorage.getItem("isAuthenticated") === "true",
  });

  const login = (token: string) => {
    dispatch({ type: "LOGIN", token });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const checkLogin = () => {
    dispatch({ type: "CHECK_LOGIN" });
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        checkLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
