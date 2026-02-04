"use client";

import React from "react";
import { Oval } from "react-loader-spinner";

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

const sizeMap = {
  sm: { height: 30, width: 30 },
  md: { height: 50, width: 50 },
  lg: { height: 70, width: 70 },
  xl: { height: 100, width: 100 },
};

const colorMap = {
  primary: "#016da1",
  white: "#FFFFFF",
  gray: "#6B7280",
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
  const spinnerProps = sizeMap[loadingSize];
  const spinnerColor = colorMap[loadingColor];

  const LoadingSpinner = () => (
    <div
      className={`flex flex-col items-center justify-center gap-4 w-full ${loadingClassName}`}
    >
      <Oval
        height={spinnerProps.height}
        width={spinnerProps.width}
        color={spinnerColor}
        secondaryColor={loadingColor === "white" ? "#E5E7EB" : "#aacee0"}
        strokeWidth={5}
        strokeWidthSecondary={5}
        ariaLabel="oval-loading"
        visible={true}
      />
      {loadingText && (
        <p
          className={`text-base font-semibold ${
            loadingColor === "white"
              ? "text-white"
              : loadingColor === "primary"
              ? "text-primary"
              : "text-gray-600"
          }`}
        >
          {loadingText}
        </p>
      )}
    </div>
  );

  if (fullScreen && isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      {children}

      {isLoading && overlay && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10">
          <LoadingSpinner />
        </div>
      )}

      {isLoading && !overlay && !fullScreen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70">
          <LoadingSpinner />
        </div>
      )}
    </div>
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
