"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard immediately
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
