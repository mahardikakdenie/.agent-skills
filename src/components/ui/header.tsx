"use client";
import { useState } from "react";
import { ChevronDown } from "react-feather";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth.context";

const Header = () => {
  const { logout, checkLogin } = useAuth();
  const handleLogout = () => {
    logout();
    checkLogin();
  };

  return (
    <>
      <div className="bg-[#006EA7] flex items-center w-full px-4 h-16">
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center text-white gap-2">
              Hi, Super Admin <ChevronDown className="w-4 h-4" />
              <span className="text-[#5D5FEF] bg-white w-8 h-8 rounded-full inline-flex items-center justify-center font-semibold text-base">
                S
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem key="logout" onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default Header;
