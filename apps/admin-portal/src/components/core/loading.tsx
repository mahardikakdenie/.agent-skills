"use client";

import React from "react";
import { Box, Spinner } from "@repo/ui";

interface LoadingWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  loadingSize?: "sm" | "md" | "lg" | "xl";
  loadingColor?: "primary" | "white" | "gray";
  overlay?: boolean;
  fullScreen?: boolean;
  className?: string;
  loadingClassName?: string;
}

const spinnerSizeClassMap = {
  sm: "[&_[data-slot=spinner-icon]]:size-[30px]",
  md: "[&_[data-slot=spinner-icon]]:size-[50px]",
  lg: "[&_[data-slot=spinner-icon]]:size-[70px]",
  xl: "[&_[data-slot=spinner-icon]]:size-[100px]",
};

export default function LoadingWrapper({
  children,
  isLoading = false,
  loadingText = "Loading...",
  loadingSize = "lg",
  loadingColor = "primary",
  overlay = true,
  fullScreen = false,
  className = "",
  loadingClassName = "",
}: LoadingWrapperProps) {
  const sharedSpinnerSize =
    loadingSize === "sm" ? "sm" : loadingSize === "md" ? "md" : "lg";
  const iconColorClassName =
    loadingColor === "white"
      ? "[&_[data-slot=spinner-icon]]:text-white [&_[data-slot=spinner-label]]:text-white"
      : loadingColor === "gray"
        ? "[&_[data-slot=spinner-icon]]:text-gray-600 [&_[data-slot=spinner-label]]:text-gray-600"
        : "[&_[data-slot=spinner-icon]]:text-primary [&_[data-slot=spinner-label]]:text-primary";

  const LoadingSpinner = () => (
    <Box
      className={`flex w-full flex-col items-center justify-center gap-4 ${loadingClassName}`}
    >
      <Spinner
        size={sharedSpinnerSize}
        label={loadingText}
        aria-label={loadingText || "Loading"}
        className={`${iconColorClassName} ${spinnerSizeClassMap[loadingSize]} [&_[data-slot=spinner-label]]:text-base [&_[data-slot=spinner-label]]:font-semibold`}
      />
    </Box>
  );

  if (fullScreen && isLoading) {
    return (
      <Box className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <Box className={`relative w-full ${className}`}>
      {children}

      {isLoading && overlay && (
        <Box className="absolute inset-0 z-50 flex items-center justify-center bg-black/10">
          <LoadingSpinner />
        </Box>
      )}

      {isLoading && !overlay && !fullScreen && (
        <Box className="absolute inset-0 z-50 flex items-center justify-center bg-white/70">
          <LoadingSpinner />
        </Box>
      )}
    </Box>
  );
}

export const PageLoadingWrapper = ({
  children,
  isLoading,
  loadingText = "Loading page...",
}: Pick<LoadingWrapperProps, "children" | "isLoading" | "loadingText">) => (
  <LoadingWrapper
    isLoading={isLoading}
    fullScreen
    loadingText={loadingText}
    loadingSize="xl"
  >
    {children}
  </LoadingWrapper>
);

export const FormLoadingWrapper = ({
  children,
  isLoading,
  loadingText = "Processing...",
}: Pick<LoadingWrapperProps, "children" | "isLoading" | "loadingText">) => (
  <LoadingWrapper
    isLoading={isLoading}
    overlay={false}
    loadingText={loadingText}
    loadingSize="lg"
  >
    {children}
  </LoadingWrapper>
);

export const ContentLoadingWrapper = ({
  children,
  isLoading,
  loadingText = "Loading...",
  className = "",
}: Pick<
  LoadingWrapperProps,
  "children" | "isLoading" | "loadingText" | "className"
>) => (
  <LoadingWrapper
    isLoading={isLoading}
    overlay={false}
    loadingText={loadingText}
    loadingSize="md"
    className={className}
  >
    {children}
  </LoadingWrapper>
);
