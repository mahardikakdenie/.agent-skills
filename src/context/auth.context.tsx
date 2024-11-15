"use client";
import React, { createContext, useReducer, useContext, useEffect } from "react";
import {CookieService} from "@/services/masterdata/cookie.service";

interface AuthState {
  isAuthenticated: boolean | null;
}

interface AuthContextType {
  state: AuthState;
  login: (token: string) => void;
  logout: () => void;
  checkLogin: () => void;
}

const cookieService = new CookieService();

type AuthAction =
  | { type: "LOGIN"; token: string }
  | { type: "LOGOUT" }
  | { type: "CHECK_LOGIN"; isAuthenticated: boolean }
  | { type: "LOAD_STATE"; isAuthenticated: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      cookieService.saveCookie({name: "token", value: action.token}).then();
      localStorage.setItem("isAuthenticated", "true");
      return { isAuthenticated: true };
    case "LOGOUT":
      cookieService.deleteCookieByKey("token").then();
      localStorage.setItem("isAuthenticated", "false");
      return { isAuthenticated: false };
    case "CHECK_LOGIN":
      localStorage.setItem("isAuthenticated", action.isAuthenticated.toString());
      return { isAuthenticated: action.isAuthenticated };
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

  const checkLogin = async () => {
    const token = await cookieService.getCookieByKey("token");
    dispatch({ type: "CHECK_LOGIN", isAuthenticated: !!token });
  };

  useEffect(() => {
    checkLogin().then();
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
