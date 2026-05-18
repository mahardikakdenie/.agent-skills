import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import React, { Suspense } from "react";
import Loader from "@/components/loader";
import { AuthProvider } from "@/context/auth.context";
import { LayoutView } from "@/views/layout/layout.view";
import { ScreenProvider } from "@/context/screen.context";
import { Toaster } from "react-hot-toast";
import QueryProvider from "@/provider/query-provider";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Portal",
  description: "Admin Powered by Friendsuretech",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {process.env.NEXT_PUBLIC_LOGO_SQUARE ? (
          <link rel="icon" href={process.env.NEXT_PUBLIC_LOGO_SQUARE} />
        ) : (
          <link rel="icon" href="/favicon-globe.ico" />
        )}
        <title>{String(metadata.title)}</title>
      </head>
      <body className={`${montserrat.className} sm:scrollable`}>
        <Suspense fallback={<Loader />}>
          <QueryProvider>
            <Toaster />
            <AuthProvider>
              <ScreenProvider>
                <LayoutView>{children}</LayoutView>
              </ScreenProvider>
            </AuthProvider>
          </QueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
