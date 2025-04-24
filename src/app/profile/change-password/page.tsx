"use client"

import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
} from "react-feather";
import Image from "next/image";
import { AxiosError } from "axios";
import iconChecked from "/public/images/icon-checked.svg";
import iconCross from "/public/images/icon-cross.svg";

import useRequireAuth from "@/hooks/useRequireAuth";
import WithSidebar from "@/hoc/with-sidebar";
import { getUserId } from "@/context/auth.context"
import { UserService } from "@/services/masterdata/user.service";
import {
  toastNotification,
} from "@/lib/toast";
import { useLoading } from "@/context/loading.context"
import { useAuth } from "@/context/auth.context";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ChangePasswordPage = () => {
  useRequireAuth();
  const userService = new UserService();
  const { setLoading } = useLoading();
  const { logout, checkLogin } = useAuth();

  // Data state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [isOldPasswordIncorrect, setIsOldPasswordIncorrect] = useState<boolean>(false);
  const [isConfirmPasswordMismatch, setIsConfirmPasswordMismatch] = useState<boolean>(false);
  const [disableChangePasswordBtn, setDisableChangePasswordBtn] = useState<boolean>(true);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState<boolean>(false);
  const [validations, setValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const isAllFieldsFilled =
      oldPassword.trim() !== "" &&
      newPassword.trim() !== "" &&
      confirmNewPassword.trim() !== "";
  
    const isAllValidationsPassed = Object.values(validations).every((value) => value);
  
    const isPasswordConfirmed = newPassword === confirmNewPassword;

    setIsConfirmPasswordMismatch(confirmNewPassword.trim() !== "" && !isPasswordConfirmed);
  
    setDisableChangePasswordBtn(!(isAllFieldsFilled && isAllValidationsPassed && isPasswordConfirmed));
  }, [oldPassword, newPassword, confirmNewPassword, validations]);
  

  const validatePassword = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password),
    };
  }

  const togglePasswordVisibility = (field: "oldPassword" | "newPassword" | "confirmNewPassword") => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChangeNewPassword = (value: string) => {
    setShowPasswordRequirements(true);
    setNewPassword(value);
    setValidations(validatePassword(value));
  }

  const handleChangePassword = async () => {
    setIsOldPasswordIncorrect(false);
    
    const userId = await getUserId();
  
    if (!userId) {
      toastNotification("Error: User ID is null", "error");
      return;
    }
    
    setLoading(true);
    try {
      const result = await userService.changePassword(userId,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
      );
      if (result) setIsSuccessModalOpen(true);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;

      if (axiosError.response?.data?.message === "Invalid old password") {
        setIsOldPasswordIncorrect(true);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    checkLogin();
  };

  const renderPasswordRequirements = () => {
    const requirements = [
      { text: "Minimum 8 characters", isValid: validations.minLength },
      { text: "At least one uppercase letter", isValid: validations.hasUpperCase },
      { text: "At least one lowercase letter", isValid: validations.hasLowerCase },
      { text: "At least one number", isValid: validations.hasNumber },
      { text: "At least one special character", isValid: validations.hasSpecialChar },
    ];
  
    return (
      <>
        <div className="text-sm font-medium my-3">Password Requirements</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <Image
                alt={req.isValid ? "check icon" : "cross icon"}
                src={req.isValid ? iconChecked : iconCross}
                width={16}
                height={16}
              />
              {req.text}
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderSuccessModal = () => {
    return (
      <Dialog open={isSuccessModalOpen}>
        <DialogContent className="w-[90vw] md:w-[600px]">
          <DialogHeader className="items-center">
            <DialogTitle className="sm:text-center">
              <span className="font-normal text-base">Your password has been successfully changed to</span>
              <span className="font-bold"> {newPassword}</span>
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              For security reason, please log in again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-4">
            <Button
              className="btn min-w-[108px] rounded-full bg-[#F5BA41] hover:bg-[#e6a92d] text-black"
              onClick={() => handleLogout()}
            >
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
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
        <div className="text-sm">Choose a strong password and don't reuse it for other accounts.</div>

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
          {
            isOldPasswordIncorrect ? (
              <div className="text-red-500 text-xs">
                Password incorrect, contact admin for support
              </div>
            ) : null
          }
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
              onChange={(e) => handleChangeNewPassword(e.target.value)}
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
          {showPasswordRequirements ? renderPasswordRequirements() : null}
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
          {
            isConfirmPasswordMismatch ? (
              <div className="text-red-500 text-xs">
                Passwords do not match. Please re-enter your confirmation password.
              </div>
            ) : null
          }
        </div>

        <div className="text-sm">Once your password has been changed, please log back in with the new password on all your devices.</div>
        <div>
          <Button
            type="submit"
            disabled={disableChangePasswordBtn}
            onClick={() => handleChangePassword()}
            className="bg-[#F5BA41] text-black hover:bg-[#e6a92d] font-normal rounded-full"
          >
            Change Password
          </Button>
        </div>
      </div>
      {renderSuccessModal()}
    </div>
  );
};

ChangePasswordPage.displayName = "ChangePasswordPage";

const ChangePasswordWithSidebar = (params: any) => WithSidebar(ChangePasswordPage)(params);
export default ChangePasswordWithSidebar;
