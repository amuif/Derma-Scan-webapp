import type React from "react";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../sidebar/app-sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <AppSidebar />
        {/* Top-left trigger keeps working; nudged spacing to align with new rounding */}
        <div className="pt-7 pl-2">
          <SidebarTrigger />
        </div>

        <main className="flex-1 overflow-auto">
          {/* Wider container for the modern look */}
          <div className="mx-auto max-w-7xl p-6">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
