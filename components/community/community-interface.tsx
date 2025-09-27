"use client";

import { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  History,
  Users,
  MessageSquare,
  Heart,
  Share2,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Plus,
} from "lucide-react";

// Mock data for scan history
const scanHistory = [
  {
    id: 1,
    date: "2024-01-15",
    condition: "Acne Vulgaris",
    riskLevel: "low" as const,
    confidence: 87,
    image: "/skin-scan.jpg",
    notes: "Mild breakout on forehead area. Following prescribed routine.",
    improvement: 15,
  },
  {
    id: 2,
    date: "2024-01-10",
    condition: "Seborrheic Dermatitis",
    riskLevel: "medium" as const,
    confidence: 92,
    image: "/skin-condition.jpg",
    notes: "Redness and scaling around nose area. Started new treatment.",
    improvement: -5,
  },
  {
    id: 3,
    date: "2024-01-05",
    condition: "Dry Skin",
    riskLevel: "low" as const,
    confidence: 78,
    image: "/dry-skin.jpg",
    notes: "Winter dryness affecting arms and legs. Increased moisturizing.",
    improvement: 25,
  },
  {
    id: 4,
    date: "2024-01-01",
    condition: "Acne Vulgaris",
    riskLevel: "medium" as const,
    confidence: 84,
    image: "/skin-scan.jpg",
    notes: "Initial scan showing moderate acne. Starting treatment plan.",
    improvement: 0,
  },
];

// Mock data for community posts
const communityPosts = [
  {
    id: 1,
    user: {
      name: "Sarah M.",
      avatar: "/user-avatar.jpg",
      verified: false,
    },
    timestamp: "2 hours ago",
    content:
      "Just wanted to share my 3-month progress with eczema treatment! The AI recommendations really helped me track which products work best. My skin has improved so much!",
    condition: "Eczema",
    likes: 24,
    comments: 8,
    image: "/skin-condition.jpg",
  },
  {
    id: 2,
    user: {
      name: "Dr. Johnson",
      avatar: "/doctor-avatar.png",
      verified: true,
    },
    timestamp: "4 hours ago",
    content:
      "Remember that consistency is key with any skincare routine. The AI can help track your progress, but patience and regular application of treatments are essential for success.",
    condition: "General Advice",
    likes: 45,
    comments: 12,
    image: null,
  },
  {
    id: 3,
    user: {
      name: "Mike R.",
      avatar: "/user-avatar-2.jpg",
      verified: false,
    },
    timestamp: "6 hours ago",
    content:
      "Has anyone tried the new acne treatment recommended by the AI? I'm seeing some improvement after 2 weeks but wondering about others' experiences.",
    condition: "Acne",
    likes: 18,
    comments: 15,
    image: null,
  },
];

export function CommunityInterface() {
  const [activeTab, setActiveTab] = useState("history");
  const [newPost, setNewPost] = useState("");

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
                    <p className="text-2xl font-bold">{scanHistory.length}</p>
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
                      Avg Improvement
                    </p>
                    <p className="text-2xl font-bold text-green-500">+12%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Days Tracked
                    </p>
                    <p className="text-2xl font-bold">45</p>
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
              {scanHistory.map((scan, index) => {
                const RiskIcon = getRiskIcon(scan.riskLevel);
                const isImprovement = scan.improvement > 0;
                const isDecline = scan.improvement < 0;

                return (
                  <div key={scan.id} className="relative">
                    {index < scanHistory.length - 1 && (
                      <div className="absolute left-6 top-16 w-px h-16 bg-border" />
                    )}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <RiskIcon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{scan.condition}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(scan.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={getRiskColor(scan.riskLevel)}
                              variant="outline"
                            >
                              {scan.riskLevel} risk
                            </Badge>
                            <Badge variant="secondary">
                              {scan.confidence}% confidence
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-4 mb-3">
                          <img
                            src={scan.image || "/placeholder.svg"}
                            alt="Scan result"
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-2">
                              {scan.notes}
                            </p>
                            {scan.improvement !== 0 && (
                              <div className="flex items-center gap-1 text-sm">
                                <TrendingUp
                                  className={`h-4 w-4 ${
                                    isImprovement
                                      ? "text-green-500"
                                      : "text-red-500"
                                  } ${isDecline ? "rotate-180" : ""}`}
                                />
                                <span
                                  className={
                                    isImprovement
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }
                                >
                                  {isImprovement ? "+" : ""}
                                  {scan.improvement}% change
                                </span>
                              </div>
                            )}
                          </div>
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
          {/* Community Header */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search posts..." className="pl-10" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </div>

          {/* New Post */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src="/user-avatar.jpg" />
                  <AvatarFallback>YU</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="Share your experience, ask questions, or offer support to the community..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-20"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge variant="secondary">Acne</Badge>
                      <Badge variant="secondary">Progress Update</Badge>
                    </div>
                    <Button disabled={!newPost.trim()}>Post</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Posts */}
          <div className="space-y-6">
            {communityPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarImage
                        src={post.user.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {post.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{post.user.name}</span>
                        {post.user.verified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                        <Badge variant="outline">{post.condition}</Badge>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          {post.timestamp}
                        </span>
                      </div>

                      <p className="text-sm leading-relaxed">{post.content}</p>

                      {post.image && (
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt="Post image"
                          className="rounded-lg max-w-md object-cover"
                        />
                      )}

                      <Separator />

                      <div className="flex items-center gap-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <Heart className="mr-2 h-4 w-4" />
                          {post.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          {post.comments}
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
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
