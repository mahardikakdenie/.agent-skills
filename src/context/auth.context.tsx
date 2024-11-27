"use client";
import React, { createContext, useReducer, useContext, useEffect } from "react";
import { CookieService } from "@/services/masterdata/cookie.service";
import { ClaimToken } from "@/context/token.dto";
import { jwtDecode } from "jwt-decode"; // Import for decoding the token
import { NextRequest, NextResponse } from "next/server";

interface JwtPayload {
  exp?: number;
}

interface AuthState {
  isAuthenticated: boolean | null;
  claims: ClaimToken | null;
}

interface AuthContextType {
  state: AuthState;
  login: (token: string) => void;
  logout: () => void;
  checkLogin: () => void;
  claims: ClaimToken | null;
}

const cookieService = new CookieService();

type AuthAction =
  | { type: "LOGIN"; token: string }
  | { type: "LOGOUT" }
  | { type: "CHECK_LOGIN"; isAuthenticated: boolean; claims: ClaimToken | null }
  | { type: "LOAD_STATE"; isAuthenticated: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN": {
      cookieService.saveCookie({ name: "token", value: action.token }).then();
      localStorage.setItem("isAuthenticated", "true");
      const decoded = jwtDecode<ClaimToken>(action.token);
      return { isAuthenticated: true, claims: decoded };
    }
    case "LOGOUT":
      cookieService.deleteCookieByKey("token").then();
      localStorage.setItem("isAuthenticated", "false");
      return { isAuthenticated: false, claims: null };
    case "CHECK_LOGIN":
      localStorage.setItem("isAuthenticated", action.isAuthenticated.toString());
      return { isAuthenticated: action.isAuthenticated, claims: action.claims };
    case "LOAD_STATE":
      return { isAuthenticated: action.isAuthenticated, claims: null };
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
    claims: null,
  });

  const login = (token: string) => {
    dispatch({ type: "LOGIN", token });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const checkLogin = async () => {
    const token = await cookieService.getCookieByKey("token");
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp && decoded.exp * 1000 >= Date.now()) {
        const claims = jwtDecode<ClaimToken>(token);
        dispatch({ type: "CHECK_LOGIN", isAuthenticated: true, claims });
      } else {
        dispatch({ type: "CHECK_LOGIN", isAuthenticated: false, claims: null });
      }
    } else {
      dispatch({ type: "CHECK_LOGIN", isAuthenticated: false, claims: null });
    }
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
        claims: state.claims,
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

export const hasPermission = (
  claims: ClaimToken | null,
  permission: string
): boolean => {
  return claims?.permission_list?.includes(permission) ?? false;
};