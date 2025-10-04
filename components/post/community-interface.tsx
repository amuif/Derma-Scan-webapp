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
import { History, Users, Search, Filter, Calendar, Clock } from "lucide-react";
import { Post } from "@/types/post";
import {
  useDeletePost,
  useGetAllowedPost,
  usePostCreation,
} from "@/hooks/usePost";
import { Label } from "../ui/label";
import { authStorage } from "@/lib/auth";
import { useCurrentUserQuery } from "@/hooks/useAuth";

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

  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    console.log(user);
    const selfPost = posts?.filter((post) => post.author.id === user.id) || [];
    const isAdmin = user.role === "ADMIN";
    setIsAdmin(isAdmin);
    setSelfPosts(selfPost);

    const communityPost =
      posts?.filter((post) => post.author.id !== user.id) || [];
    console.log(communityPost);

    setCommunityPosts(communityPost);
  }, [posts, user]);

  const handleChange = (catagory: string) => {
    setNewPostCatagory(catagory);
  };

  const handleDeletePost = async (id: string) => {
    await deletePost(id);
    refetch();
  };
  const handleCreatePost = async () => {
    if (!newPost.trim() || !newPostTitle.trim()) return;
    if (!user) return;

    const token = await authStorage.getToken();
    if (!token) return;
    setLoading(true);
    try {
      const response = await createPost({
        title: newPostTitle,
        content: newPost,
        category: newPostCatagory.toUpperCase(),
        authorId: user.id,
        status: "PENDING",
        language: "en",
        token,
      });
      if (response) {
        setNewPost("");
        setNewPostTitle("");
        setNewPostCatagory("");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "prevention":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "treatment":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "general":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "support":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "REJECTED":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

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
    <div>Loading........................</div>;
  }
  if (isError) {
    <div>Error occurred</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Community & Posts</h1>
        <p className="text-muted-foreground text-lg">
          Track your progress and connect with others on their skin health
          journey.
        </p>
      </div>

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

        <TabsContent value="history" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Posts
                    </p>
                    <p className="text-2xl font-bold">{posts?.length}</p>
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
                      {user && formatDate(user.createdAt)}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Post History</CardTitle>
              <CardDescription>
                Your complete skin analysis timeline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selfPosts?.map((post) => {
                return (
                  <div key={post.id} className="relative">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
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
                          <div>By {post.author.name}</div>
                        </div>

                        <div className="flex gap-4 mb-3">
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground mb-2">
                              {post.content}
                            </p>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <div className="relative flex">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search posts..." className="pl-10 w-full" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Create new post</CardTitle>
            </CardHeader>
            <CardContent className="">
              <div className="flex gap-3">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="flex-col space-y-2">
                      <Label>Title</Label>
                      <Input
                        placeholder="Post title..."
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                      />
                    </div>
                    <div className="flex-col space-y-2">
                      <Label>Select Category</Label>
                      <Select
                        value={newPostCatagory}
                        onValueChange={handleChange}
                      >
                        <SelectTrigger className="w-[250px]">
                          <SelectValue placeholder="Catagory" />
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
                  <div className="flex-col space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Share your experience, ask questions, or offer support to the community..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-24"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge variant="secondary">General</Badge>
                    </div>
                    <Button
                      disabled={!newPost.trim() || !newPostTitle.trim()}
                      onClick={handleCreatePost}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {loading ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">
                      Loading posts...
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : communityPosts.length === 0 ? (
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
              communityPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {post.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold">
                              {post.author.name}
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
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(post.createdAt)}
                            </span>
                          </div>
                          {isAdmin && (
                            <Button
                              className=""
                              variant="destructive"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              Delete Post
                            </Button>
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg mb-2">
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
export const Catagory = ["Tips", "Prevention", "Awareness", "Treatment"];
