"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "react-feather";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <div className="bg-[#006EA7] flex items-center w-full px-4 h-16 min-h-16">
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center text-white gap-2 text-sm">
              Hi, Super Admin <ChevronDown className="w-4 h-4" />
              <span className="text-[#5D5FEF] bg-white w-8 h-8 rounded-full inline-flex items-center justify-center font-semibold text-base">
                S
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 p-4">
              <Link
                href="/profile/change-password"
                className="justify-center flex text-sm p-2 bg-gray-300 rounded-full"
              >
                Change Password
              </Link>
              <DropdownMenuItem
                key="logout"
                onClick={handleLogout}
                className="justify-center flex bg-red-500 text-white focus:bg-red-600 focus:text-white mt-4 cursor-pointer py-2 rounded-full"
              >
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
