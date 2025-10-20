"use client";

import {
  Activity,
  BookText,
  History,
  Home,
  Users,
  Hospital,
  Scan,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUserQuery } from "@/hooks/useAuth";
import { ModeToggle } from "../mode-toggle";
import { NavUser } from "./sidebar-user";

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

// ---------- Config ----------
const NAV_ITEMS = [
  { name: "Dashboard", href: "/home", icon: Home },
  { name: "Scan", href: "/scan", icon: Scan },
  { name: "Scan history", href: "/history", icon: History },
  { name: "Posts", href: "/posts", icon: BookText },
  { name: "Community", href: "/community", icon: Users },
  { name: "Trusted Clinics", href: "/clinics", icon: Hospital },
] as const;

// ---------- Component ----------
export function AppSidebar() {
  const { data: user } = useCurrentUserQuery();
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <Sidebar className="border-r bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Brand */}
      <SidebarHeader>
        <div className="relative mx-3 mt-3 rounded-xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-3">
          {/* soft grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(60%_70%_at_50%_40%,#000_40%,transparent_100%)]"
          >
            <svg className="absolute inset-0 h-full w-full">
              <defs>
                <pattern
                  id="grid-sb"
                  width="28"
                  height="28"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 28 0 L 0 0 0 28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth=".5"
                  />
                </pattern>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="url(#grid-sb)"
                className="text-foreground/20"
              />
            </svg>
          </div>

          <div className="flex h-12 items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <span className="text-base">DermaScan</span>
            </div>
            <ModeToggle />
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild size="lg">
                      <Link
                        href={item.href}
                        className={[
                          "group flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-colors border",
                          active
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "border-transparent hover:bg-muted/60 text-muted-foreground",
                        ].join(" ")}
                      >
                        <Icon className={active ? "text-primary" : ""} />
                        <span className="truncate">{item.name}</span>
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
                      className={[
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-colors border",
                        isActive("/admin")
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "border-transparent hover:bg-muted/60 text-muted-foreground",
                      ].join(" ")}
                    >
                      <Shield
                        className={isActive("/admin") ? "text-primary" : ""}
                      />
                      <span>Admin</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* spacer group for push-down if needed */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent />
        </SidebarGroup>
      </SidebarContent>

      {/* User footer */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
