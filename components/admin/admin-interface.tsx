"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Building2,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Activity,
  BookText,
} from "lucide-react";
import {
  useDeleteClinic,
  useFindAllClinic,
  useUpdateClinic,
} from "@/hooks/useClinic";
import { Clinic } from "@/types/clinic";
import { User } from "@/types/user";
import { useDeleteMutation, useFindAllUsers } from "@/hooks/useAuth";
import { FILES_URL } from "@/constants/backend-url";
import {
  useDeletePost,
  useGetAllAllowedPost,
  useUpdatePost,
} from "@/hooks/usePost";
import { Post } from "@/types/post";
import { useScanHistory } from "@/hooks/useScan";
import { Scan } from "@/types/scan";
import { format } from "date-fns";
import { PostCard } from "./admin-user-interface";

export function AdminInterface() {
  const { data: clinics, refetch: refetchClinics } = useFindAllClinic();
  const { data: usersData, refetch: refetchUsers } = useFindAllUsers();
  const { data: postsData, refetch: refetchPosts } = useGetAllAllowedPost();
  const { data: scansData } = useScanHistory();
  const { mutateAsync: updateClinic } = useUpdateClinic();
  const { mutateAsync: deleteClinic } = useDeleteClinic();
  const { mutateAsync: deleteUser } = useDeleteMutation();
  const { mutateAsync: updatePost } = useUpdatePost();
  const { mutateAsync: deletePost } = useDeletePost();
  const [activeTab, setActiveTab] = useState("clinics");
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingClinics, setPendingClinics] = useState<Clinic[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);

  useEffect(() => {
    if (scansData) {
      setScans(scansData);
    }
  }, [scansData]);
  useEffect(() => {
    if (postsData) {
      setPosts(postsData);
    }
  }, [postsData]);
  useEffect(() => {
    if (usersData) {
      setUsers(usersData);
    }
  }, [usersData]);
  useEffect(() => {
    const pending =
      clinics?.filter((clinic) => clinic.status === "PENDING") || [];
    setPendingClinics(pending);
  }, [clinics]);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowercasedSearch) ||
        user.email.toLowerCase().includes(lowercasedSearch) ||
        format(user.createdAt, "yyyy-MM-dd").includes(lowercasedSearch),
    );
  }, [users, searchTerm]);

  const handleApproveClinic = (clinicId: string) => {
    console.log(`Approving clinic ${clinicId}`);
    updateClinic({ id: clinicId, status: "APPROVED" });
    refetchClinics();
  };

  const handleRejectClinic = async (clinicId: string) => {
    console.log(`Rejecting clinic ${clinicId}`);
    await deleteClinic(clinicId);
    refetchClinics();
  };

  const handleDeleteUser = async (userId: string) => {
    console.log(`Deleting user ${userId}`);
    await deleteUser(userId);
    refetchUsers();
  };
  const handleAcceptPost = async (postId: string) => {
    updatePost({ id: postId, status: "APPROVED" });
    refetchPosts();
  };
  const handleRejectPost = async (postId: string) => {
    deletePost(postId);
    refetchPosts();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Clinics
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingClinics.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Educational Posts
            </CardTitle>
            <BookText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Community posts
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scans.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clinics">Clinic Approvals</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="posts">Educational posts</TabsTrigger>
        </TabsList>

        <TabsContent value="clinics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Clinic Approvals</CardTitle>
              <CardDescription>
                Review and approve clinic suggestions from users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingClinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{clinic.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {clinic.address}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>{clinic.phone}</span>
                        <span>{clinic.email}</span>
                      </div>
                      <div>
                        <span className="text-sm">
                          Website:{" "}
                          {clinic.website ? (
                            <a href={clinic.website}>{clinic.website}</a>
                          ) : (
                            "Not provided"
                          )}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {clinic.specialties.map((specialty) => (
                          <Badge
                            key={specialty}
                            variant="secondary"
                            className="text-xs"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Clock className="h-3 w-3" />
                      Pending
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApproveClinic(clinic.id)}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRejectClinic(clinic.id)}
                      className="flex items-center gap-1"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage user accounts and permissions
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm
                      ? "No users found matching your search."
                      : "No users found."}
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between border rounded-lg p-4"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage
                            src={
                              `${FILES_URL}${user.profilePicture}` ||
                              "/placeholder.svg"
                            }
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Joined {format(user.createdAt, "yyyy-MM-dd")}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete user
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <div className="grid gap-4 ">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id}>
                    <PostCard
                      post={post}
                      onReject={handleRejectPost}
                      onApprove={handleAcceptPost}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
