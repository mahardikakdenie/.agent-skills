"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getCookie,
  removeAllLocalStorage,
  removeCookie,
  setCookie,
  toastNotification,
} from "@/helpers/app.helper";
import { AUTH_TOKEN } from "@/constants/app-common.const";
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/api.service";
import ApiURL from "@/constants/api-url.const";
import { LoginResponse } from "@/types/common";
import { AxiosResponse } from "axios";
import AppMenu from "@/constants/app-menu.const";
import { authToken } from "@/types/auth-token";
import { setGlobalToken } from "@/lib/token-storage";

interface AuthContextType {
  user: JwtPayload;
  menuList: any[];
  submenuList: any[];
  permissionList: any[];
  isAuthenticated: boolean;
  isForbidden: boolean;
  isNetworkActive: boolean;
  login: (data: any) => void;
  logout: () => void;
  handleChangeNetwork: (value: boolean) => void;
  handleResponseError: (error: any) => void;
}

interface Insurers {
  insurance: string;
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
  account_channels?: { channel: string }[];
  iat: number;
  exp: number;
  all_channels: any;
  all_insurances: any;
  token: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
let isOnce = false;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isForbidden, setIsForbidden] = useState<boolean>(false);
  const [isNetworkActive, setIsNetworkActive] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [menuList, setMenuList] = useState<any[]>([]);
  const [submenuList, setSubmenuList] = useState<any[]>([]);
  const [permissionList, setPermissionList] = useState<any[]>([]);
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchTokenAndUserInfo = async () => {
      try {
        const token = await getCookie(AUTH_TOKEN);
        if (token) await getUserInformation(token);
        setIsAuthenticated(!!token);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    fetchTokenAndUserInfo().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsForbidden(false);
    setIsNetworkActive(true);
  }, [path]);

  const findMenuByUrl = (currentPath: string) => {
    for (let item of AppMenu.menu) {
      if (item.url === currentPath) return item.name;

      if (item.submenu) {
        for (let subItem of item.submenu) {
          if (subItem.url === currentPath) return subItem.name;

          if (subItem.additionalPages) {
            for (let page of subItem.additionalPages) {
              if (page.url === currentPath) return page.name;
            }
          }
        }
      }
    }
    return null;
  };

  const login = async (data: any) => {
    if (!isOnce) {
      isOnce = true;
      try {
        const response: AxiosResponse<LoginResponse> = await authService.post(
          ApiURL.login,
          { username: data.email, password: data.password }
        );
        if (response && response.data && response.data.access_token) {
          const token = response.data.access_token;
          await setCookie(AUTH_TOKEN, token);
          authToken.token = token;
          setGlobalToken(token);
          if (token) await getUserInformation(token, true);
        }
      } catch (error: any) {
        toastNotification(
          error?.response?.data?.message || "Failed to login.",
          "error"
        );
        isOnce = false;
      }
    }
  };

  const logout = async () => {
    await removeCookie(AUTH_TOKEN);
    removeAllLocalStorage();
    authToken.clearToken();
    setGlobalToken(null);
    setUser(null);
    setIsAuthenticated(false);
    isOnce = false;
    router.push("/");
  };

  const getUserInformation = async (
    token: string,
    isLogin: boolean = false
  ) => {
    setGlobalToken(token);
    const decodedToken: any = jwtDecode(token);
    const userdata = JSON.parse(JSON.stringify(decodedToken));
    userdata.all_channels = [
      ...new Set([
        ...(decodedToken.channel ? [decodedToken.channel] : []),
        ...decodedToken.account_channels.map((c: any) => c.channel),
      ]),
    ];
    userdata.all_insurances = [
      ...new Set([
        ...decodedToken.account_insurers.map((i: any) => i.insurance),
      ]),
    ];
    setUser(userdata);

    const permissions: any[] = decodedToken.permission_list || [];
    const normalizeKey = (value?: string) =>
      value
        ?.toString()
        .toLowerCase()
        .replace(/[\s_-]/g, "") ?? "";
    const compareKeys = (a: string, b: string) => {
      const normalizedA = normalizeKey(a);
      const normalizedB = normalizeKey(b);
      return (
        normalizedA === normalizedB ||
        normalizedA.startsWith(normalizedB) ||
        normalizedB.startsWith(normalizedA)
      );
    };
    const menuAccess = new Set<string>();
    const submenuAccess = new Set<string>();

    permissions.forEach((item: any) => {
      if (!item) return;

      const parts = `${item}`.split(".");
      const rawMenu = parts[0];
      const rawSubmenuParts = parts.slice(1);
      const submenuCandidates = [
        ...(rawSubmenuParts.length > 0
          ? [
              rawSubmenuParts.join("."),
              rawSubmenuParts.join(""),
              ...rawSubmenuParts,
            ]
          : [rawMenu]),
      ].filter(Boolean);

      const addAllSubmenus = (menuItem: any) => {
        menuItem.submenu?.forEach((submenuItem: any) =>
          submenuAccess.add(submenuItem.name)
        );
      };

      const matchedMenusByName =
        rawMenu && rawMenu.length
          ? AppMenu.menu.filter((menuItem) =>
              compareKeys(menuItem.name, rawMenu)
            )
          : [];

      matchedMenusByName.forEach((menuItem) => {
        menuAccess.add(menuItem.name);

        if (menuItem.submenu?.length) {
          const sortedCandidates = [...submenuCandidates].sort(
            (a, b) => b.length - a.length
          );
          const matchedSubmenuInMenu = menuItem.submenu.find(
            (submenuItem: any) =>
              sortedCandidates.some((candidate) =>
                candidate ? compareKeys(submenuItem.name, candidate) : false
              )
          );

          if (matchedSubmenuInMenu) {
            submenuAccess.add(matchedSubmenuInMenu.name);
          } else {
            addAllSubmenus(menuItem);
          }
        }
      });
    });

    const menus = Array.from(menuAccess);
    const submenus = Array.from(submenuAccess);

    if (path.split("/").length < 4) {
      const currentMenuName = findMenuByUrl(path);
      const hasAccessToCurrent = currentMenuName
        ? submenus.some((submenuName) =>
            compareKeys(submenuName, currentMenuName)
          )
        : false;
      if (currentMenuName && !hasAccessToCurrent) setIsForbidden(true);
    }
    console.log("permissions", permissions);
    setMenuList(menus);
    setSubmenuList(submenus);
    setPermissionList(permissions);

    if (isLogin) {
      const matchingMenu = AppMenu.menu.find((menuItem) =>
        menus.some((menuName) => compareKeys(menuName, menuItem.name))
      );
      const matchingSubmenu = matchingMenu?.submenu?.find((submenuItem: any) =>
        submenus.some((submenuName) =>
          compareKeys(submenuName, submenuItem.name)
        )
      );

      if (matchingSubmenu) {
        setIsAuthenticated(true);
        router.push(matchingSubmenu.url);
      } else if (matchingMenu) {
        setIsAuthenticated(true);
        router.push(matchingMenu.url);
      } else {
        logout().then();
      }
    }
  };

  const handleResponseError = (error: any) => {
    if (!error.response) setIsNetworkActive(false);
    else
      setIsForbidden(
        ApiURL.errorStatusCodeToGetToken.includes(
          error?.response?.data?.statusCode
        )
      );
  };

  const handleChangeNetwork = (value: boolean) => setIsNetworkActive(value);

  return (
    <AuthContext.Provider
      value={{
        user,
        menuList,
        submenuList,
        permissionList,
        isAuthenticated,
        isForbidden,
        isNetworkActive,
        login,
        logout,
        handleChangeNetwork,
        handleResponseError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
