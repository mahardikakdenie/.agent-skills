import { primary, primaryRed } from "@/constants/app-common.const";
import toast, { type Renderable } from "react-hot-toast";

export const toastNotification = (
  text: string,
  type: "success" | "error" = "success"
) => {
  toast[type](text, {
    style: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      border: `1px solid ${type === "error" ? primaryRed : primary}`,
      borderRadius: "100px",
      padding: "16px",
      color: type === "error" ? primaryRed : primary,
    },
    iconTheme: {
      primary: type === "error" ? primaryRed : primary,
      secondary: "#FFF",
    },
  });
};

// Use toast promise if you need a toast that has a loading animation (for promises)
export const toastPromise = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success?: Renderable;
    error?: Renderable;
  }
) => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success || "Success!",
    error: (error) => {
      console.error("Backend Error:", error); // Log the full error for debugging

      // Get error message from the backend response.
      // Priority:
      // 1. Backend response message
      // 2. JS error message
      // 3. Fallback default error message
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        messages.error ||
        "Something went wrong.";

      return errorMessage;
    },
  });
};
