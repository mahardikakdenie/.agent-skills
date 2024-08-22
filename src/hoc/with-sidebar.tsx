"use client";
import React from "react";
import { useAuth } from "@/context/auth.context";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
        <div className="">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-row p-5">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/home"
                  className={navigationMenuTriggerStyle()}
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/transactions"
                  className={navigationMenuTriggerStyle()}
                >
                  Transactions
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/promotion"
                  className={navigationMenuTriggerStyle()}
                >
                  Promotions
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="relative">
                <NavigationMenuTrigger className="cursor-pointer">
                  Product Catalog
                </NavigationMenuTrigger>
                <NavigationMenuContent className="absolute left-0 top-10 bg-white rounded-md shadow-lg z-50">
                  <ul className="grid w-[200px] gap-3 p-4 md:w-[200px] md:grid-cols-1 lg:w-[200px]">
                    <ListItem href="/product-catalog/travel">Travel</ListItem>
                    <ListItem href="/product-catalog/personal-accident">
                      Personal Accident
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  onClick={handleLogout}
                  href="#"
                >
                  Logout
                </NavigationMenuLink>
              </NavigationMenuItem>
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

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
