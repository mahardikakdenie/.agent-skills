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
import Loading from "@/components/ui/loading";
import { useLoading } from "@/context/loading.context";
import Header from "@/components/ui/header";

export default function WithSidebar(Component: React.ComponentType<any>) {
  const WithSidebarWrapper = (props: any) => {
    const { isLoading } = useLoading();
    const { logout, checkLogin } = useAuth();
    const handleLogout = () => {
      logout();
      checkLogin();
    };

    return (
      <div className="flex h-full">
        {isLoading && <Loading />}
        <div className="w-full relative flex flex-col h-full">
          <Header />
          <div className="flex min-w-full h-full">
            <Component {...props} />
          </div>
        </div>
      </div>
    );
  };

  WithSidebarWrapper.displayName = `WithSidebar(${
    Component.displayName || Component.name
  })`;

  return WithSidebarWrapper;
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
