"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, Eye, Search, User, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type PostStatus = "PENDING" | "APPROVED" | "REJECTED";
type PostCategory = "PREVENTION" | "TREATMENT" | "AWARENESS" | "RESEARCH";

interface Author {
  id: string;
  name: string;
  email: string;
}

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  language: string;
  authorId: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

export function AdminPostsInterface() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PostStatus | "ALL">(
    "PENDING",
  );
  const [categoryFilter, setCategoryFilter] = useState<PostCategory | "ALL">(
    "ALL",
  );
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery, statusFilter, categoryFilter]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((post) => post.status === statusFilter);
    }

    if (categoryFilter !== "ALL") {
      filtered = filtered.filter((post) => post.category === categoryFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredPosts(filtered);
  };

  const handleApprove = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}/approve`, {
        method: "PATCH",
      });

      if (response.ok) {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, status: "APPROVED" as PostStatus }
              : post,
          ),
        );
        setShowDetailsDialog(false);
      }
    } catch (error) {
      console.error("Failed to approve post:", error);
    }
  };

  const handleReject = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}/reject`, {
        method: "PATCH",
      });

      if (response.ok) {
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, status: "REJECTED" as PostStatus }
              : post,
          ),
        );
        setShowDetailsDialog(false);
      }
    } catch (error) {
      console.error("Failed to reject post:", error);
    }
  };

  const getStatusBadge = (status: PostStatus) => {
    const variants = {
      PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      APPROVED: "bg-green-500/10 text-green-500 border-green-500/20",
      REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return variants[status];
  };

  const getCategoryBadge = (category: PostCategory) => {
    const variants = {
      PREVENTION: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      TREATMENT: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      AWARENESS: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      RESEARCH: "bg-teal-500/10 text-teal-500 border-teal-500/20",
    };
    return variants[category];
  };

  const pendingCount = posts.filter((p) => p.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Post Approvals</h1>
        <p className="text-muted-foreground">
          Review and approve community post submissions
        </p>
      </div>

      {pendingCount > 0 && (
        <Alert>
          <AlertDescription>
            You have <strong>{pendingCount}</strong> pending post
            {pendingCount !== 1 ? "s" : ""} awaiting review.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Community Posts</CardTitle>
          <CardDescription>Manage community post submissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title, content, or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2">
                {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map(
                  (status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                    >
                      {status}
                    </Button>
                  ),
                )}
              </div>
              <div className="flex gap-2">
                {(
                  [
                    "ALL",
                    "PREVENTION",
                    "TREATMENT",
                    "AWARENESS",
                    "RESEARCH",
                  ] as const
                ).map((category) => (
                  <Button
                    key={category}
                    variant={
                      categoryFilter === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setCategoryFilter(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Loading posts...
                    </TableCell>
                  </TableRow>
                ) : filteredPosts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No posts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {post.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{post.author.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryBadge(post.category)}>
                          {post.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(post.status)}>
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPost(post);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {post.status === "PENDING" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleApprove(post.id)}
                                className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReject(post.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post Details</DialogTitle>
            <DialogDescription>
              Review post content before approval
            </DialogDescription>
          </DialogHeader>

          {selectedPost && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{selectedPost.title}</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getCategoryBadge(selectedPost.category)}>
                    {selectedPost.category}
                  </Badge>
                  <Badge className={getStatusBadge(selectedPost.status)}>
                    {selectedPost.status}
                  </Badge>
                  <Badge variant="outline">
                    {selectedPost.language.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {selectedPost.author.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedPost.author.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Submitted</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(selectedPost.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-sm font-medium mb-2">Content</p>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedPost.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedPost?.status === "PENDING" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedPost.id)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button onClick={() => handleApprove(selectedPost.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
            {selectedPost?.status !== "PENDING" && (
              <Button
                variant="outline"
                onClick={() => setShowDetailsDialog(false)}
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
