"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth.context";

const MsalCallbackPage = () => {
  const searchParams = useSearchParams();
  const { loginEntra } = useAuth();
  const code = searchParams.get("code");

  useEffect(() => {
    if (code) {
      loginEntra(code).catch((err) => {
          // Error handling is done in loginEntra via toast
      });
    }
  }, [code, loginEntra]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Authenticating with Microsoft...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
};

export default MsalCallbackPage;
