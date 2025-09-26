import type React from "react";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../sidebar/app-sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen ">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
