"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/auth.context";
import { LoadingProvider } from "@/context/loading.context";
import Sidebar from "@/components/ui/sidebar";

function AuthChecker({ children }: { children: React.ReactNode }) {
  const { checkLogin } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    // Prevent triggering checkLogin on login page
    if (pathname === "/") return;

    checkLogin();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return <>{children}</>;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex">
      <LoadingProvider>
        {pathname !== "/" && <Sidebar />}
        <div className="w-full h-screen overflow-auto">
          <AuthProvider>
            <AuthChecker>{children}</AuthChecker>
          </AuthProvider>
        </div>
      </LoadingProvider>
    </div>
  );
}
