"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Clock,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Users,
  ImageIcon,
  MessageSquareText,
} from "lucide-react";

import type { Scan } from "@/types/scan";
import { useAuthStore } from "@/stores/auth";
import { useScanHistory } from "@/hooks/useScan";
import { FILES_URL } from "@/constants/backend-url";

/* ----------------------------- helpers ----------------------------- */
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function formatDate(dateLike?: string | Date) {
  if (!dateLike) return "Unknown";
  const date = new Date(dateLike);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH} hour${diffH === 1 ? "" : "s"} ago`;
  if (diffH < 48) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function riskBadge(riskRaw?: string) {
  const risk = String(riskRaw ?? "").toUpperCase();
  switch (risk) {
    case "HIGH":
      return {
        className: "bg-rose-500/10 text-rose-600 border-rose-500/20",
        Icon: AlertTriangle,
        label: "High Risk",
      };
    case "MEDIUM":
      return {
        className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        Icon: AlertCircle,
        label: "Medium Risk",
      };
    case "LOW":
      return {
        className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        Icon: CheckCircle,
        label: "Low Risk",
      };
    default:
      return {
        className: "bg-muted text-muted-foreground",
        Icon: undefined,
        label: risk || "Unknown",
      };
  }
}

/* -------------------------- skeleton loader ------------------------- */
function SkeletonCard() {
  return (
    <Card className="rounded-2xl border-border/60 bg-background/60 backdrop-blur">
      <CardContent className="p-5">
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-3 w-28 animate-pulse rounded bg-muted/80" />
        <div className="mt-4 h-48 w-full animate-pulse rounded-xl bg-muted" />
        <div className="mt-4 h-8 w-full animate-pulse rounded-lg bg-muted/60" />
      </CardContent>
    </Card>
  );
}

/* ----------------------------- component ---------------------------- */
export function Community() {
  const { user } = useAuthStore();
  const { data: scans, isLoading, isError } = useScanHistory();
  const [communityScans, setCommunityScans] = useState<Scan[]>([]);

  useEffect(() => {
    if (!user || !scans) return;
    const community =
      scans.filter((post) => {
        const uid = user.id;
        return (
          post?.userId !== uid &&
          (post as any)?.authorId !== uid &&
          (post as any)?.ownerId !== uid &&
          (post as any)?.createdById !== uid &&
          post?.user?.id !== uid
        );
      }) ?? [];
    setCommunityScans(community);
  }, [scans, user]);

  const header = useMemo(
    () => ({
      title: "Community & History",
      subtitle:
        "Track progress and connect with others on their skin health journey.",
    }),
    [],
  );

  /* ------------------------------- loading ------------------------------ */
  if (isLoading) {
    return (
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border bg-background/80 p-2 backdrop-blur">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {header.title}
              </h1>
              <p className="text-sm text-muted-foreground">{header.subtitle}</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  /* -------------------------------- error ------------------------------- */
  if (isError) {
    return (
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border bg-background/80 p-2 backdrop-blur">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {header.title}
              </h1>
              <p className="text-sm text-muted-foreground">{header.subtitle}</p>
            </div>
          </div>
        </section>

        <Card className="rounded-2xl border-rose-500/20 bg-rose-500/5">
          <CardContent className="flex items-center gap-2 p-6 text-rose-600">
            <AlertCircle className="h-5 w-5" />
            <span>Failed to fetch community posts. Please try again.</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* -------------------------------- empty ------------------------------- */
  if (!communityScans || communityScans.length === 0) {
    return (
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(60%_70%_at_50%_40%,#000_40%,transparent_100%)]"
          >
            <svg className="absolute inset-0 h-full w-full">
              <defs>
                <pattern
                  id="grid-comm-empty"
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
                fill="url(#grid-comm-empty)"
                className="text-foreground/20"
              />
            </svg>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border bg-background/80 p-2 backdrop-blur">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {header.title}
              </h1>
              <p className="text-sm text-muted-foreground">{header.subtitle}</p>
            </div>
          </div>
        </section>

        <Card className="rounded-2xl border-dashed">
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
            <div className="space-y-1">
              <p className="font-medium">No posts available</p>
              <p className="text-sm text-muted-foreground">
                Community scans will appear here once others share their
                results.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ------------------------------- content ------------------------------ */
  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(60%_70%_at_50%_40%,#000_40%,transparent_100%)]"
        >
          <svg className="absolute inset-0 h-full w-full">
            <defs>
              <pattern
                id="grid-comm"
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
              fill="url(#grid-comm)"
              className="text-foreground/20"
            />
          </svg>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border bg-background/80 p-2 backdrop-blur">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {header.title}
            </h1>
            <p className="text-sm text-muted-foreground">{header.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Grid of community posts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {communityScans.map((post) => {
          const isTextOnly = post?.imageUrl === "text-analysis";
          const rb = riskBadge(post?.risk);
          const time = formatDate(post?.timestamp);

          return (
            <Card
              key={post?.id}
              className="group rounded-2xl border-border/60 bg-background/60 shadow-sm transition-all hover:shadow-lg"
            >
              <CardContent className="p-5">
                {/* Header Row */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {time}
                      </span>
                    </div>
                    <div className="mt-1">
                      <Badge
                        variant="outline"
                        className={cn(
                          "gap-1 rounded-full border",
                          rb.className,
                        )}
                      >
                        {rb.Icon ? <rb.Icon className="h-3.5 w-3.5" /> : null}
                        {rb.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Media / Text */}
                {!isTextOnly ? (
                  <div className="relative h-48 w-full overflow-hidden rounded-xl border bg-muted">
                    <Image
                      src={`${FILES_URL}/${post?.imageUrl}`}
                      alt="Community scan"
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                ) : (
                  <div className="flex items-start gap-2 rounded-xl border p-4">
                    <MessageSquareText className="mt-0.5 h-4 w-4 text-primary" />
                    <div className="space-y-1">
                      <p className="font-medium">Text Analysis</p>
                      <p className="text-sm text-muted-foreground">
                        {post?.question ||
                          "User submitted a symptom description."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Conditions */}
                {Array.isArray(post?.conditions) &&
                  post.conditions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-semibold">
                        Detected Conditions
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {post.conditions.map((c) => {
                          const name = c?.condition?.name ?? "Condition";
                          const conf =
                            typeof c?.confidence === "number"
                              ? `${(c.confidence * 100).toFixed(1)}%`
                              : "—";
                          return (
                            <Badge
                              key={c?.id}
                              variant="secondary"
                              className="rounded-full"
                            >
                              {name} • {conf}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* Notes */}
                {post?.notes && (
                  <div className="mt-3 space-y-1">
                    <h4 className="text-sm font-semibold">Notes</h4>
                    <p className="text-sm text-muted-foreground">
                      {post.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
