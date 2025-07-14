

"use client";

import DashboardSidebar from "@/components/dashboard/sidebar";
import type React from "react";
import { useState, useEffect } from "react";
import { PermissionProvider } from "@/components/context/PermissionContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [username, setUsername] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  const handleLogout = () => {
    window.location.href = "/";
  };

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  if (!isClient) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-64 bg-primary text-primary-foreground border-r border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <main className="flex-1 p-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </main>
      </div>
    );
  }

  return (
    <PermissionProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardSidebar
          onLogout={handleLogout}
          username={username}
          onToggle={handleSidebarToggle}
        />
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? "ml-16" : "ml-64"
          } w-[calc(100%-${sidebarCollapsed ? "4rem" : "16rem"})] min-h-screen overflow-y-auto`}
        >
          <div className="p-6 max-w-full">{children}</div>
        </main>
      </div>
    </PermissionProvider>
  );
}



