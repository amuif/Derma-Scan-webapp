"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Scan,
  Hospital,
  AlertTriangle,
  CheckCircle,
  Plus,
  FilePenLine,
} from "lucide-react";
import Link from "next/link";
import { FeatureCard } from "@/types/feature-card";
import { useScanHistory } from "@/hooks/useScan";
import { FILES_URL } from "@/constants/backend-url";
import { useGetAllowedPost } from "@/hooks/usePost";
import { useFindClinic } from "@/hooks/useClinic";
import { useCurrentUserQuery } from "@/hooks/useAuth";

export function DashboardOverview() {
  const { data: recentScans, isLoading } = useScanHistory();
  const { data: posts, isLoading: isPostLoading } = useGetAllowedPost();
  const { data: user } = useCurrentUserQuery();
  const { data: clinics, isLoading: isClincsLoading } = useFindClinic();

  // Early loading guard
  if (isLoading || isPostLoading || isClincsLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }
  // If user not present yet
  if (!user) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
        No user session.
      </div>
    );
  }

  const yourScans = useMemo(
    () =>
      (recentScans ?? []).filter(
        (scan: any) =>
          scan?.userId === user.id ||
          scan?.authorId === user.id ||
          scan?.createdById === user.id ||
          scan?.ownerId === user.id ||
          scan?.user?.id === user.id,
      ),
    [recentScans, user.id],
  );

  const yourPosts = useMemo(
    () =>
      (posts ?? []).filter(
        (post: any) =>
          post?.userId === user.id ||
          post?.authorId === user.id ||
          post?.createdById === user.id ||
          post?.ownerId === user.id ||
          post?.user?.id === user.id,
      ),
    [posts, user.id],
  );

  const featureCards: FeatureCard[] = [
    {
      id: 1,
      title: "Your Scans",
      Icon: Scan,
      amount: yourScans.length,
    },
    {
      id: 2,
      title: "Your Posts",
      Icon: FilePenLine,
      amount: yourPosts.length,
    },
  ];

  const getRiskColor = (risk: string) => {
    switch ((risk ?? "").toLowerCase()) {
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch ((risk ?? "").toLowerCase()) {
      case "low":
        return CheckCircle;
      case "medium":
      case "high":
        return AlertTriangle;
      default:
        return CheckCircle;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Welcome back!</h1>
        <p className="text-lg text-muted-foreground">
          Track your skin health journey and stay connected with your care.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {featureCards.map((card) => (
          <Card key={card.id} className="@container/card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold">{card.amount}</p>
                </div>
                <card.Icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Scans */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Scans</CardTitle>
                <CardDescription>Your latest skin analysis results</CardDescription>
              </div>
              <Button asChild size="sm">
                <Link href="/scan">
                  <Plus className="mr-2 h-4 w-4" />
                  New Scan
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {(recentScans ?? []).map((scan: any) => {
                const RiskIcon = getRiskIcon(scan?.risk);
                const src =
                  scan?.imageUrl ? `${FILES_URL}/${scan.imageUrl}` : "/placeholder.svg";
                const ts = scan?.timestamp ? new Date(scan.timestamp) : null;
                return (
                  <div
                    key={scan?.id}
                    className="flex items-center gap-4 rounded-lg border border-border/50 p-4"
                  >
                    <Image
                      src={src}
                      alt="Scan result"
                      className="h-12 w-12 rounded-lg object-cover"
                      width={48}
                      height={48}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <Badge className={getRiskColor(scan?.risk)} variant="outline">
                          <RiskIcon className="mr-1 h-3 w-3" />
                          {(scan?.risk ?? "unknown").toString()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{ts ? ts.toLocaleDateString() : "—"}</span>
                        {typeof scan?.confidence === "number" && (
                          <div className="flex items-center gap-1">
                            <span>Confidence:</span>
                            <span className="font-medium">
                              {(scan.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/community">View All Scans</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Clinics */}
        <div className="space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hospital className="h-5 w-5" />
                Clinics
              </CardTitle>
              <CardDescription>Clinics you can refer or contact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Loading state */}
              {isClincsLoading && (
                <>
                  <div className="rounded-2xl border p-3">
                    <div className="mb-2 h-4 w-40 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-24 animate-pulse rounded bg-muted/70" />
                  </div>
                  <div className="rounded-2xl border p-3">
                    <div className="mb-2 h-4 w-28 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-20 animate-pulse rounded bg-muted/70" />
                  </div>
                </>
              )}

              {/* Empty state */}
              {!isClincsLoading && (clinics?.length ?? 0) === 0 && (
                <div className="grid place-items-center rounded-2xl border border-dashed p-10 text-center">
                  <Hospital className="mb-3 h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No clinics found.</p>
                </div>
              )}

              {/* List */}
              {!isClincsLoading &&
                (clinics ?? []).slice(0, 4).map((clinic: any) => (
                  <div
                    key={clinic?.id}
                    className="group rounded-2xl border p-4 transition hover:bg-muted/30"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <h4 className="text-sm font-medium leading-none">
                        {clinic?.name ?? "Unnamed Clinic"}
                      </h4>
                      <Badge variant="secondary" className="rounded-full text-[10px]">
                        {clinic?.city ?? "—"}
                      </Badge>
                    </div>

                    {(clinic?.specialties?.length ?? 0) > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {clinic.specialties.slice(0, 8).map((s: string, i: number) => (
                          <Badge
                            key={`${clinic?.id}-${s}-${i}`}
                            variant="outline"
                            className="text-[10px]"
                          >
                            {s}
                          </Badge>
                        ))}
                        {(clinic?.specialties?.length ?? 0) > 8 && (
                          <Badge variant="secondary" className="text-[10px]">
                            +{clinic.specialties.length - 8} more
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-muted-foreground">
                        No specialties listed.
                      </p>
                    )}

                    {/* Explore link if present */}
                    {clinic?.website && (
                      <div className="mt-3">
                        <a
                          href={clinic.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition hover:bg-muted/60"
                        >
                          Explore <span aria-hidden>↗</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
