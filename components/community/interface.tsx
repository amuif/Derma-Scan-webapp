"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  History,
  Users,
  MessageSquare,
  Heart,
  Share2,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Scan } from "@/types/scan";
import { useAuthStore } from "@/stores/auth";
import { useScanHistory } from "@/hooks/useScan";
import Image from "next/image";
import { FILES_URL } from "@/constants/backend-url";

export function Community() {
  const { user } = useAuthStore();
  const { data: scans, isLoading, isError } = useScanHistory();
  const [activeTab, setActiveTab] = useState("history");
  const [selfScan, setSelfScan] = useState<Scan[]>([]);
  const [communityScans, setCommunityScans] = useState<Scan[]>([]);

  useEffect(() => {
    if (!user) return;
    if (!scans) return;
    const selfScan = scans?.filter((post) => post.userId === user.id) || [];
    console.log(selfScan);
    setSelfScan(selfScan);

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

  const getRiskColor = (risk: string) => {
    switch (risk) {
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
    switch (risk) {
      case "low":
        return CheckCircle;
      case "medium":
        return AlertTriangle;
      case "high":
        return AlertTriangle;
      default:
        return CheckCircle;
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
        <h1 className="text-3xl font-bold mb-2">Community & History</h1>
        <p className="text-muted-foreground text-lg">
          Track your progress and connect with others on their skin health
          journey.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            My Scan History
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Scans
                    </p>
                    <p className="text-2xl font-bold">{scans?.length}</p>
                  </div>
                  <History className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Days Tracked since
                    </p>
                    <p className="text-2xl font-bold">
                      {selfScan?.at(-1)?.timestamp &&
                        formatDate(selfScan.at(-1)!.timestamp)}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scan History */}
          <Card>
            <CardHeader>
              <CardTitle>Scan History</CardTitle>
              <CardDescription>
                Your complete skin analysis timeline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selfScan.map((scan) => {
                const RiskIcon = getRiskIcon(scan.risk);

                return (
                  <div
                    key={scan.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border/50"
                  >
                    <Image
                      src={
                        `${FILES_URL}/${scan.imageUrl}` || "/placeholder.svg"
                      }
                      alt="Scan result"
                      className="w-12 h-12 rounded-lg object-cover"
                      width={500}
                      height={500}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          className={getRiskColor(scan.risk)}
                          variant="outline"
                        >
                          <RiskIcon className="mr-1 h-3 w-3" />
                          {scan.risk}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {new Date(scan.timestamp).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-1">
                          <span>Confidence:</span>
                          <span className="font-medium">
                            {(scan.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <div className="space-y-6">
            {communityScans.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">
                      No posts available
                    </div>
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

                        <Separator />

                        <div className="flex items-center gap-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-red-500"
                          >
                            <Heart className="mr-2 h-4 w-4" />
                            Like
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground"
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Comment
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground"
                          >
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
