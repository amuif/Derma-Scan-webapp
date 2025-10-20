"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  History,
  Users,
  Search,
  Filter,
  Calendar,
  Clock,
  Plus,
  AlertCircle,
} from "lucide-react";
import type { Post } from "@/types/post";
import {
  useDeletePost,
  useGetAllowedPost,
  usePostCreation,
} from "@/hooks/usePost";
import { Label } from "../ui/label";
import { authStorage } from "@/lib/auth";
import { useCurrentUserQuery } from "@/hooks/useAuth";

/* ---------------- helpers ---------------- */
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function formatDate(dateString?: string) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60),
  );
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  if (diffInHours < 48) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getCategoryColor(category: string) {
  switch ((category || "").toLowerCase()) {
    case "prevention":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "treatment":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "support":
      return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    case "awareness":
      return "bg-pink-500/10 text-pink-600 border-pink-500/20";
    case "tips":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "general":
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getStatusColor(status: string) {
  switch ((status || "").toUpperCase()) {
    case "APPROVED":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "PENDING":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "REJECTED":
      return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function CommunityInterface() {
  const { data: posts, isLoading, isError, refetch } = useGetAllowedPost();
  const { mutateAsync: createPost } = usePostCreation();
  const { data: user } = useCurrentUserQuery();
  const { mutateAsync: deletePost } = useDeletePost();

  const [activeTab, setActiveTab] = useState("history");
  const [newPost, setNewPost] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostCatagory, setNewPostCatagory] = useState("");
  const [selfPosts, setSelfPosts] = useState<Post[]>([]);
  const [communityPosts, setCommunityPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [showComposer, setShowComposer] = useState(false);

  // Community filters
  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!user || !posts) return;
    const mine = posts.filter((p) => p?.author?.id === user.id);
    const others = posts.filter((p) => p?.author?.id !== user.id);
    setSelfPosts(mine);
    setCommunityPosts(others);
    setIsAdmin((user.role || "").toUpperCase() === "ADMIN");
  }, [posts, user]);

  const totals = useMemo(() => {
    return {
      all: posts?.length ?? 0,
      mine: selfPosts.length,
      community: communityPosts.length,
      since: user?.createdAt ? formatDate(user.createdAt) : "Unknown",
    };
  }, [posts, selfPosts, communityPosts, user]);

  const filteredCommunity = useMemo(() => {
    let items = [...communityPosts];
    // text search on title/content/author
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (p) =>
          p?.title?.toLowerCase().includes(q) ||
          p?.content?.toLowerCase().includes(q) ||
          p?.author?.name?.toLowerCase().includes(q),
      );
    }
    if (filterCategory !== "all") {
      items = items.filter(
        (p) => (p?.category || "").toLowerCase() === filterCategory,
      );
    }
    if (filterStatus !== "all") {
      items = items.filter(
        (p) => (p?.status || "").toUpperCase() === filterStatus.toUpperCase(),
      );
    }
    return items;
  }, [communityPosts, query, filterCategory, filterStatus]);

  const handleDeletePost = async (id: string) => {
    await deletePost(id);
    refetch();
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !newPostTitle.trim() || !user) return;

    const token = await authStorage.getToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await createPost({
        title: newPostTitle,
        content: newPost,
        category: (newPostCatagory || "General").toUpperCase(),
        authorId: user.id,
        status: "PENDING",
        language: "en",
        token,
      });
      if (response) {
        setNewPost("");
        setNewPostTitle("");
        setNewPostCatagory("");
        setShowComposer(false);
        refetch();
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setLoading(false);
    }
  };

  // --------- loading / error guards (must return) ----------
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
                Community & Posts
              </h1>
              <p className="text-sm text-muted-foreground">
                Track your progress and connect with others on their skin health
                journey.
              </p>
            </div>
          </div>
        </section>

        <Card className="rounded-2xl">
          <CardContent className="p-6 text-sm text-muted-foreground">
            Loading posts…
          </CardContent>
        </Card>
      </div>
    );
  }

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
                Community & Posts
              </h1>
              <p className="text-sm text-muted-foreground">
                Track your progress and connect with others on their skin health
                journey.
              </p>
            </div>
          </div>
        </section>

        <Card className="rounded-2xl border-rose-500/20 bg-rose-500/5">
          <CardContent className="flex items-center gap-2 p-6 text-rose-600">
            <AlertCircle className="h-5 w-5" />
            <span>Something went wrong while fetching posts.</span>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                id="grid-comm-ui"
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
              fill="url(#grid-comm-ui)"
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
              Community & Posts
            </h1>
            <p className="text-sm text-muted-foreground">
              Track your progress and connect with others on their skin health
              journey.
            </p>
          </div>
        </div>
      </section>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            My Posts
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Community
          </TabsTrigger>
        </TabsList>

        {/* -------- My Posts -------- */}
        <TabsContent value="history" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Posts
                    </p>
                    <p className="text-2xl font-bold">{totals.mine}</p>
                  </div>
                  <History className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Days Tracked since
                    </p>
                    <p className="text-2xl font-bold">{totals.since}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Community Posts
                    </p>
                    <p className="text-2xl font-bold">{totals.community}</p>
                  </div>
                  <Users className="h-8 w-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Post History</CardTitle>
              <CardDescription>Your complete posting timeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selfPosts.length === 0 ? (
                <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
                  You haven’t posted yet.
                </div>
              ) : (
                selfPosts.map((post) => (
                  <div key={post.id} className="relative">
                    <div className="flex gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{post.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            By {post.author?.name}
                          </div>
                        </div>
                        <p className="mb-3 text-sm text-muted-foreground">
                          {post.content}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className={getCategoryColor(post.category)}
                          >
                            {post.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={getStatusColor(post.status)}
                          >
                            {post.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* -------- Community -------- */}
        <TabsContent value="community" className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            <div className="flex gap-2">
              <div className="relative flex">
                <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Search posts..."
                  className="w-full pl-10"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Catagory.map((c) => (
                    <SelectItem key={c} value={c.toLowerCase()}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                className="hidden sm:inline-flex"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={() => setShowComposer((s) => !s)}
              className="self-end sm:self-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              {showComposer ? "Close" : "Add Post"}
            </Button>
          </div>

          {showComposer && (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl">Create new post</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          placeholder="Post title..."
                          value={newPostTitle}
                          onChange={(e) => setNewPostTitle(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Select Category</Label>
                        <Select
                          value={newPostCatagory}
                          onValueChange={setNewPostCatagory}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {Catagory.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Share your experience, ask questions, or offer support to the community..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="min-h-24"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {newPostCatagory ? (
                          <Badge
                            variant="outline"
                            className={getCategoryColor(newPostCatagory)}
                          >
                            {newPostCatagory}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">General</Badge>
                        )}
                      </div>
                      <Button
                        disabled={
                          !newPost.trim() || !newPostTitle.trim() || loading
                        }
                        onClick={handleCreatePost}
                      >
                        {loading ? "Posting…" : "Post"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            {filteredCommunity.length === 0 ? (
              <Card className="rounded-2xl">
                <CardContent className="p-6 text-center text-sm text-muted-foreground">
                  No posts found. Try a different search or filter.
                </CardContent>
              </Card>
            ) : (
              filteredCommunity.map((post) => (
                <Card key={post.id} className="rounded-2xl">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {post.author?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold">
                              {post.author?.name}
                            </span>
                            <Badge
                              variant="outline"
                              className={getCategoryColor(post.category)}
                            >
                              {post.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={getStatusColor(post.status)}
                            >
                              {post.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              •
                            </span>
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDate(post.createdAt)}
                            </span>
                          </div>

                          {isAdmin && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              Delete Post
                            </Button>
                          )}
                        </div>

                        <div>
                          <h3 className="mb-2 text-lg font-semibold">
                            {post.title}
                          </h3>
                          <p className="text-sm leading-relaxed">
                            {post.content}
                          </p>
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

export const Catagory = [
  "Tips",
  "Prevention",
  "Awareness",
  "Treatment",
  "Support",
  "General",
];
