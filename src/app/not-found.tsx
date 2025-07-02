"use client";

import { useSetNotFound } from "@/context/not-found.context";
import { useEffect } from "react";

export default function NotFound() {
  const setNotFound = useSetNotFound();

  useEffect(() => {
    setNotFound(true);
  }, [setNotFound]);
  
  return (
    <main className="flex gap-4 items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-2xl font-bold">404</h1>
      <p>This page could not be found.</p>
    </main>
  );
}
