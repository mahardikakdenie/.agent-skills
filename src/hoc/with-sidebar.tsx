"use client";
import React from "react";
import { useAuth } from "@/context/auth.context";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";

export default function WithSidebar(Component: any) {
  return Object.assign(
    (props?: any) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { logout, checkLogin } = useAuth();
      const handleLogout = () => {
        logout();
        checkLogin();
      };
      return (
        <div>
          <NavigationMenu>
            <NavigationMenuList className="p-5">
              <NavigationMenuLink className="p-5" href="/home">
                Home
              </NavigationMenuLink>
              <NavigationMenuLink className="p-5" href="/transactions">
                Transactions
              </NavigationMenuLink>
              <NavigationMenuLink className="p-5" href="/promotion">
                Promotions
              </NavigationMenuLink>
              <NavigationMenuLink
                className="p-5"
                href="#"
                onClick={handleLogout}
              >
                Logout
              </NavigationMenuLink>
            </NavigationMenuList>
          </NavigationMenu>
          <div>
            <Component {...props} />
          </div>
        </div>
      );
    },
    { displayName: `WithSidebar(${Component.displayName})` }
  );
}
