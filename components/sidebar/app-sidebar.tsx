"use client";
import { Activity, BookText, History, Home } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Users, Hospital, Scan, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "./sidebar-user";
import { ModeToggle } from "../mode-toggle";
import { useCurrentUserQuery } from "@/hooks/useAuth";
import { useEffect } from "react";

const items = [
  { name: "Dashboard", href: "/home", icon: Home },
  { name: "Scan", href: "/scan", icon: Scan },
  { name: "Scan history", href: "/history", icon: History },
  { name: "Posts", href: "/posts", icon: BookText },
  { name: "Community", href: "/community", icon: Users },
  { name: "Trusted Clinics", href: "/clinics", icon: Hospital },
];
export function AppSidebar() {
  const { data: user } = useCurrentUserQuery();
  const pathname = usePathname();
  const isAdminButtonActive = pathname === "/admin";
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex h-14 items-center justify-between border-sidebar-border px-4">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-lg">DermaScan</span>
          </div>
          <ModeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild size="lg">
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2  font-medium transition-colors ${
                          isActive
                            ? "bg-primary! text-primary-foreground!"
                            : " "
                        }`}
                      >
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {user?.role === "ADMIN" && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild size="lg">
                    <Link
                      href="/admin"
                      className={`flex items-center gap-3 rounded-lg px-3 py-2  font-medium transition-colors ${
                        isAdminButtonActive
                          ? "bg-primary text-primary-foreground"
                          : " "
                      }`}
                    >
                      <Shield />
                      <span>Admin</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarMenu></SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {" "}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
