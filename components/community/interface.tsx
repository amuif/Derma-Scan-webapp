"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { Scan } from "@/types/scan";
import { useAuthStore } from "@/stores/auth";
import { useScanHistory } from "@/hooks/useScan";
import Image from "next/image";
import { FILES_URL } from "@/constants/backend-url";

export function Community() {
  const { user } = useAuthStore();
  const { data: scans, isLoading, isError } = useScanHistory();
  const [communityScans, setCommunityScans] = useState<Scan[]>([]);

  useEffect(() => {
    if (!user) return;
    if (!scans) return;
    const selfScan = scans?.filter((post) => post.userId === user.id) || [];
    console.log(selfScan);

    const communityPost =
      scans?.filter((post) => post.userId !== user.id) || [];
    console.log(communityPost);

    setCommunityScans(communityPost);
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

  if (isLoading) {
    return <div>Loading.............</div>;
  }

  if (isError) {
    return <div>Error occurred fetching scans</div>;
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Community & History</h1>
        <p className="text-muted-foreground text-lg">
          Track your progress and connect with others on their skin health
          journey.
        </p>
      </div>

      <div className="space-y-6">
        {communityScans.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">No posts available</div>
              </div>
            </CardContent>
          </Card>
        ) : (
          communityScans.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {post.user.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{post.user.name}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(post.timestamp)}
                      </span>
                    </div>

                    <div className="relative h-40 w-40 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={`${FILES_URL}/${post.imageUrl}`}
                        alt="Skin scan"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
