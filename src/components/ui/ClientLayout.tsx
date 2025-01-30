"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/auth.context";
import { LoadingProvider } from "@/context/loading.context";
import Sidebar from "@/components/ui/sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex">
      <LoadingProvider>
        {pathname !== "/" && <Sidebar />}
        <div className="w-full h-screen overflow-auto">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </LoadingProvider>
    </div>
  );
}
