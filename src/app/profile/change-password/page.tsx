"use client"

import { useState } from "react";
import { Eye, EyeOff } from "react-feather";

import useRequireAuth from "@/hooks/useRequireAuth";
import WithSidebar from "@/hoc/with-sidebar";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";

const ChangePasswordPage = () => {
  useRequireAuth();

  // Data state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const togglePasswordVisibility = (field: "oldPassword" | "newPassword" | "confirmNewPassword") => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-6">
      <div className="flex flex-col justify-start pb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>Profile</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Change Password</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-black font-bold text-2xl mt-2 sm:w-auto w-full">
          Change Password
        </h1>
      </div>

      <div className="flex flex-col block bg-white rounded-xl gap-6 p-6">
        <div>Choose a strong password and don't reuse it for other accounts.</div>

        <div className="flex flex-col gap-1.5 w-full md:w-1/2">
          <div className="text-xs">
            Old Password<span className="text-red-500">*</span>
          </div>
          <div className="relative">
            <Input
              type={passwordVisibility.oldPassword ? "text" : "password"}
              placeholder="Input password"
              className="placeholder-gray-300"
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("oldPassword")}
              className="absolute inset-y-0 right-3 flex items-center"
            >
              {passwordVisibility.oldPassword ? (
                <Eye className="w-3.5 h-3.5 text-[#015B86]" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-[#015B86]" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 w-full md:w-1/2">
          <div className="text-xs">
            New Password<span className="text-red-500">*</span>
          </div>
          <div className="relative">
            <Input
              type={passwordVisibility.newPassword ? "text" : "password"}
              placeholder="Input password"
              className="placeholder-gray-300"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("newPassword")}
              className="absolute inset-y-0 right-3 flex items-center"
            >
              {passwordVisibility.newPassword ? (
                <Eye className="w-3.5 h-3.5 text-[#015B86]" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-[#015B86]" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 w-full md:w-1/2">
          <div className="text-xs">
            Confirm New Password<span className="text-red-500">*</span>
          </div>
          <div className="relative">
            <Input
              type={passwordVisibility.confirmNewPassword ? "text" : "password"}
              placeholder="Input password"
              className="placeholder-gray-300"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirmNewPassword")}
              className="absolute inset-y-0 right-3 flex items-center"
            >
              {passwordVisibility.confirmNewPassword ? (
                <Eye className="w-3.5 h-3.5 text-[#015B86]" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-[#015B86]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ChangePasswordPage.displayName = "ChangePasswordPage";

const ChangePasswordWithSidebar = (params: any) => WithSidebar(ChangePasswordPage)(params);
export default ChangePasswordWithSidebar;
