"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import type { Scan } from "@/types/scan";
import { useScanHistory } from "@/hooks/useScan";
import { useCurrentUserQuery } from "@/hooks/useAuth";
import Image from "next/image";
import { FILES_URL } from "@/constants/backend-url";

export function SelfCommunity() {
  const { data: user } = useCurrentUserQuery();
  const { data: scans, isLoading, isError } = useScanHistory();
  const [selfScans, setSelfScans] = useState<Scan[]>([]);

  useEffect(() => {
    if (!user) return;
    if (!scans) return;
    const selfScan = scans?.filter((post) => post.userId === user.id) || [];
    setSelfScans(selfScan);
  }, [scans, user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "HIGH":
        return {
          variant: "destructive" as const,
          icon: <AlertTriangle className="h-3 w-3" />,
          label: "High Risk",
        };
      case "MEDIUM":
        return {
          variant: "default" as const,
          icon: <AlertCircle className="h-3 w-3" />,
          label: "Medium Risk",
        };
      case "LOW":
        return {
          variant: "secondary" as const,
          icon: <CheckCircle className="h-3 w-3" />,
          label: "Low Risk",
        };
      default:
        return {
          variant: "outline" as const,
          icon: null,
          label: risk,
        };
    }
  };

  if (isLoading) {
    return <div>Loading.............</div>;
  }

  if (isError) {
    return <div>Error occurred fetching scans</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Scan History</h1>
        <p className="text-muted-foreground">
          View your previous skin scans and analysis results
        </p>
      </div>

      <div className="space-y-6">
        {selfScans.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">No scans available</div>
              </div>
            </CardContent>
          </Card>
        ) : (
          selfScans.map((post) => {
            const riskBadge = getRiskBadge(post.risk);
            return (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {post.user.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {post.user.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            •
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(post.timestamp)}
                          </span>
                        </div>
                        <Badge variant={riskBadge.variant} className="gap-1">
                          {riskBadge.icon}
                          {riskBadge.label}
                        </Badge>
                      </div>

                      <div className="relative h-40 w-40 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={`${FILES_URL}/${post.imageUrl}`}
                          alt="Skin scan"
                          fill
                          className="object-cover"
                        />
                      </div>

                      {post.conditions.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">
                            Detected Conditions:
                          </h4>
                          <div className="space-y-2">
                            {post.conditions.map((condition, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-muted rounded-lg"
                              >
                                <span className="text-sm font-medium">
                                  {condition.condition.name}
                                </span>
                                <Badge variant="outline">
                                  {(condition.confidence * 100).toFixed(1)}%
                                  confidence
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {post.notes && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Notes:</h4>
                          <p className="text-sm text-muted-foreground">
                            {post.notes}
                          </p>
                        </div>
                      )}

                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
