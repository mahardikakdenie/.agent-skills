"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/auth.context";
import { ScreenProvider, useScreen } from "@/context/screen.context";
import Sidebar from "@/components/ui/sidebar";

const AuthChecker = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex">
      <ScreenProvider>
        <LoadedContent pathname={pathname}>
          {children}
        </LoadedContent>
      </ScreenProvider>
    </div>
  );
}

function LoadedContent({ children, pathname }: { children: React.ReactNode, pathname: string }) {
  const { isLoading } = useScreen();
  const shouldShowSidebar = pathname !== "/";

  return (
    <>
      {shouldShowSidebar && <Sidebar />}
      {/* Loader handled globally via ScreenProvider */}
      <div className="w-full h-screen overflow-auto">
        <AuthProvider>
          <AuthChecker>{children}</AuthChecker>
        </AuthProvider>
      </div>
    </>
  );
}
