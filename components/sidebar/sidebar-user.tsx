"use client";

import { useRouter } from "next/navigation";
import { FILES_URL } from "@/constants/backend-url";
import { useCurrentUserQuery, useLogoutMutation } from "@/hooks/useAuth";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SidebarMenu, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

import {
  UserRound,
  CreditCard,
  Settings2,
  LogOut,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  MoonStar,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useMemo } from "react";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data: user, isLoading } = useCurrentUserQuery();
  const { mutateAsync: logout } = useLogoutMutation();
  const { theme, setTheme, systemTheme } = useTheme();
  const router = useRouter();

  const effectiveTheme = useMemo(
    () => (theme === "system" ? systemTheme ?? "light" : theme),
    [theme, systemTheme],
  );

  const initials =
    (user?.name ?? "U")
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  const avatarSrc = user?.profilePicture ? `${FILES_URL}${user.profilePicture}` : undefined;

  async function handleLogOut() {
    await logout();
  }

  // Skeleton (loading) state
  if (isLoading || !user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
            <div className="flex-1 space-y-1">
              <div className="h-3 w-28 animate-pulse rounded bg-muted" />
              <div className="h-2.5 w-40 animate-pulse rounded bg-muted/70" />
            </div>
            <div className="h-4 w-4 animate-pulse rounded bg-muted" />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const roleTone =
    user.role === "ADMIN"
      ? "bg-primary/15 text-primary border-primary/20"
      : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {/* -------- Trigger: Account Card -------- */}
          <DropdownMenuTrigger asChild>
            <button
              className="group relative w-full rounded-2xl border p-3 text-left transition
                         hover:bg-muted/60"
            >
              {/* subtle glow grid */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-40
                           [mask-image:radial-gradient(70%_85%_at_50%_20%,#000_40%,transparent_100%)]"
              >
                <svg className="absolute inset-0 h-full w-full">
                  <defs>
                    <pattern id="grid-acc" width="28" height="28" patternUnits="userSpaceOnUse">
                      <path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeWidth=".5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-acc)" className="text-foreground/15" />
                </svg>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-9 w-9 rounded-lg ring-1 ring-border">
                    <AvatarImage src={avatarSrc} alt={user.name} />
                    <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                  </Avatar>
                  {/* presence dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold">{user.name}</span>
                    <Badge variant="outline" className={`h-5 shrink-0 border ${roleTone}`}>
                      {user.role}
                    </Badge>
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{user.email}</div>
                </div>

                <ChevronRight className="ml-auto size-4 text-muted-foreground transition group-data-[state=open]:rotate-90" />
              </div>
            </button>
          </DropdownMenuTrigger>

          {/* -------- Menu Content -------- */}
          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
            className="w-80 rounded-xl border p-0"
          >
            {/* Top summary block with gradient */}
            <DropdownMenuLabel className="p-0">
              <div className="relative rounded-t-xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 rounded-lg ring-1 ring-border">
                    <AvatarImage src={avatarSrc} alt={user.name} />
                    <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{user.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="outline" className={`border ${roleTone}`}>
                    {user.role}
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    Member
                  </Badge>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Quick actions grid */}
            <div className="grid grid-cols-3 gap-2 p-3">
              <QuickAction
                icon={<UserRound className="h-4 w-4" />}
                label="Profile"
                onClick={() => router.push("/profile")}
              />
              <QuickAction
                icon={<CreditCard className="h-4 w-4" />}
                label="Billing"
                onClick={() => router.push("/billing")}
              />
              <QuickAction
                icon={<Settings2 className="h-4 w-4" />}
                label="Settings"
                onClick={() => router.push("/settings")}
              />
              {user.role === "ADMIN" && (
                <QuickAction
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="Admin"
                  onClick={() => router.push("/admin")}
                />
              )}
              <QuickAction
                icon={<HelpCircle className="h-4 w-4" />}
                label="Help"
                onClick={() => router.push("/help")}
              />
              <ThemeToggleCompact
                theme={effectiveTheme}
                onSetTheme={setTheme}
              />
            </div>

            <DropdownMenuSeparator />

            {/* Rich list group */}
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <UserRound className="mr-2 h-4 w-4" />
                <span>Account</span>
                <DropdownMenuShortcut>↵</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings2 className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogOut} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

/* -------------------- Helpers -------------------- */

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className="flex h-20 flex-col items-center justify-center gap-2 rounded-xl border bg-background/60 hover:bg-muted/60"
    >
      <div className="grid h-8 w-8 place-items-center rounded-md border bg-background">
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
}

function ThemeToggleCompact({
  theme,
  onSetTheme,
}: {
  theme: string | undefined;
  onSetTheme: (v: string) => void;
}) {
  const isDark = theme === "dark";
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => onSetTheme(isDark ? "light" : "dark")}
      className="flex h-20 flex-col items-center justify-center gap-2 rounded-xl border bg-background/60 hover:bg-muted/60"
    >
      <div className="grid h-8 w-8 place-items-center rounded-md border bg-background">
        {isDark ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
      </div>
      <span className="text-xs font-medium">{isDark ? "Light" : "Dark"} mode</span>
    </Button>
  );
}
