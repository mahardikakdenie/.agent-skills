"use client";

import React from "react";

/**
 * OAuth routes have their own layout that bypasses the main LayoutView.
 * This allows OAuth callback pages to render without requiring authentication.
 */
export default function OAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("[OAuthLayout] Rendering OAuth layout");
  return <>{children}</>;
}
