"use client";
import React, { createContext, useReducer, useContext } from "react";
import { CookieService } from "@/services/masterdata/cookie.service";
import { jwtDecode } from "jwt-decode";
import { getGlobalToken, setGlobalToken } from "@/lib/token-storage";

interface AuthState {
  token: string | null;
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
  | { type: "CHECK_LOGIN"; token: string | null };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { token: action.token };
    case "LOGOUT":
      return { token: null };
    case "CHECK_LOGIN":
      return { token: action.token };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    token: null,
  });

  const login = async (token: string) => {
    await cookieService.saveCookie({ name: "token", value: token, days: 1 });
    setGlobalToken(token);
    dispatch({ type: "LOGIN", token });
  };

  const logout = async () => {
    await cookieService.deleteCookieByKey("token");
    setGlobalToken(null);
    dispatch({ type: "LOGOUT" });
  };

  const checkLogin = async () => {
    const token = await cookieService.getCookieByKey("token");
    if (token) {
      setGlobalToken(token);
      dispatch({ type: "CHECK_LOGIN", token });
    } else {
      dispatch({ type: "CHECK_LOGIN", token: null });
    }
  };

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
  setGlobalToken(token);
};

export const getClaims = async (): Promise<JwtPayload | null> => {
  const token = getGlobalToken();
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
  setGlobalToken(null);
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
