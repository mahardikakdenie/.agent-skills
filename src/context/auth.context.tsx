"use client";
import React, { createContext, useReducer, useContext, useEffect } from "react";
import { CookieService } from "@/services/masterdata/cookie.service";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  isAuthenticated: boolean | null;
}

interface Insurers {
  insurance: string;
}

interface AuthContextType {
  state: AuthState;
  login: (token: string) => void;
  logout: () => void;
  checkLogin: () => void;
}

interface JwtPayload {
  email: string;
  phone_number: string;
  sub: string;
  name: string;
  role: string;
  channel: string;
  permission_list: string[];
  account_insurers: Insurers[];
  iat: number;
  exp: number;
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
      localStorage.setItem("isAuthenticated", "true");
      return { isAuthenticated: true };
    case "LOGOUT":
      localStorage.setItem("isAuthenticated", "false");
      return { isAuthenticated: false };
    case "CHECK_LOGIN":
      localStorage.setItem(
        "isAuthenticated",
        action.isAuthenticated.toString()
      );
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

  const login = async (token: string) => {
    await cookieService
      .saveCookie({ name: "token", value: token, days: 1 })
      .then();
    dispatch({ type: "LOGIN", token });
  };

  const logout = async () => {
    await cookieService.deleteCookieByKey("token").then();
    dispatch({ type: "LOGOUT" });
  };

  const checkLogin = async () => {
    try {
      const token = await cookieService.getCookieByKey("token");
      dispatch({ type: "CHECK_LOGIN", isAuthenticated: !!token });
    } catch (e) {
      dispatch({ type: "CHECK_LOGIN", isAuthenticated: false });
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

export const setToken = (token: string) => {
  localStorage.setItem("authToken", token);
};

export const getClaims = async (): Promise<JwtPayload | null> => {
  const token = await cookieService.getCookieByKey("token");
  if (!token) return null;

  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const isTokenExpired = async (): Promise<boolean> => {
  const claims = await getClaims();
  if (!claims) {
    console.error("Token is missing or invalid.");
    return true;
  }

  if (!claims.exp) {
    console.error("Token does not contain an 'exp' field.");
    return true;
  }

  const now = Math.floor(Date.now() / 1000);
  return now >= claims.exp;
};

export const clearToken = () => {
  localStorage.removeItem("authToken");
};

export const hasPermission = async (
  requiredPermission: string
): Promise<boolean> => {
  const claims = await getClaims();
  return claims?.permission_list?.includes(requiredPermission) || false;
};

export const hasInsurers = async (): Promise<any> => {
  const claims = await getClaims();
  return claims?.account_insurers || false;
};

export const getUserId = async (): Promise<string | null> => {
  const claims = await getClaims();
  return claims?.sub || null;
};
