"use client";

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { ProjectProvider } from "@/context/ProjectContext";
import { PromptProvider } from "@/context/PromptContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("AdminLayout: User not authenticated, redirecting to /signin");
      router.push('/signin');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading authentication...</p>
      </div>
    );
  }

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[350px]"
      : "lg:ml-[120px]";

  return (
    <ProjectProvider>
      <PromptProvider>
        <div className="min-h-screen xl:flex">
          <AppSidebar />
          <Backdrop />
          <div
            className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin} w-full`}
          >
            <AppHeader />
            <div className="p-6 mx-auto w-[95%] md:p-8">{children}</div>
          </div>
        </div>
      </PromptProvider>
    </ProjectProvider>
  );
}
