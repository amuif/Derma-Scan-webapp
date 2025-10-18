"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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
  Pencil,
  Trash2, // ✅ for delete buttons
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

// shadcn Dialog
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ===== helpers ===== */
function toLowerSafe(v?: string | null) {
  return (v ?? "").toLowerCase();
}
function formatYmd(dateLike?: string | number | Date) {
  if (!dateLike) return "";
  const d =
    typeof dateLike === "string" || typeof dateLike === "number"
      ? new Date(dateLike)
      : dateLike;
  if (isNaN(d as unknown as number)) return "";
  return format(d, "yyyy-MM-dd");
}

const CATEGORY_OPTIONS = [
  "GENERAL",
  "PREVENTION",
  "AWARENESS",
  "TREATMENT",
  "SUPPORT",
  "TIPS",
];
const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED"];

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
  const [allNonPendingClinics, setAllNonPendingClinics] = useState<Clinic[]>(
    [],
  );

  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);

  // edit state (clinic)
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [clinicForm, setClinicForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    specialties: "", // comma-separated
    status: "PENDING" as "PENDING" | "APPROVED" | "REJECTED",
  });

  // edit state (post)
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    category: "GENERAL",
    status: "PENDING",
  });

  useEffect(() => {
    if (scansData) setScans(scansData);
  }, [scansData]);

  useEffect(() => {
    if (postsData) setPosts(postsData);
  }, [postsData]);

  useEffect(() => {
    if (usersData) setUsers(usersData);
  }, [usersData]);

  useEffect(() => {
    const pending = clinics?.filter((c) => c.status === "PENDING") ?? [];
    const others = clinics?.filter((c) => c.status !== "PENDING") ?? [];
    setPendingClinics(pending);
    setAllNonPendingClinics(others);
  }, [clinics]);

  // user search filter
  const filteredUsers = useMemo(() => {
    const q = toLowerSafe(searchTerm).trim();
    if (!q) return users;
    return users.filter((user) => {
      const name = toLowerSafe(user?.name);
      const email = toLowerSafe(user?.email);
      const created = formatYmd(user?.createdAt).toLowerCase();
      return name.includes(q) || email.includes(q) || created.includes(q);
    });
  }, [users, searchTerm]);

  /* ===== handlers ===== */
  // Clinics
  const handleApproveClinic = async (clinicId: string) => {
    await updateClinic({ id: clinicId, status: "APPROVED" });
    await refetchClinics();
  };

  const handleRejectClinic = async (clinicId: string) => {
    await deleteClinic(clinicId);
    await refetchClinics();
  };

  // NEW: Hard delete clinic (works for pending or approved)
  const handleDeleteClinicHard = async (clinicId: string) => {
    if (!window.confirm("Delete this clinic permanently?")) return;
    await deleteClinic(clinicId);
    await refetchClinics();
  };

  // Users
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Delete this user?")) return;
    await deleteUser(userId);
    await refetchUsers();
  };

  // Posts
  const handleAcceptPost = async (postId: string) => {
    await updatePost({ id: postId, status: "APPROVED" });
    await refetchPosts();
  };

  const handleRejectPost = async (postId: string) => {
    await deletePost(postId);
    await refetchPosts();
  };

  // NEW: Hard delete post
  const handleDeletePostHard = async (postId: string) => {
    if (!window.confirm("Delete this post permanently?")) return;
    await deletePost(postId);
    await refetchPosts();
  };

  // open editors
  const openClinicEditor = (c: Clinic) => {
    setEditingClinic(c);
    setClinicForm({
      name: c.name ?? "",
      address: c.address ?? "",
      phone: c.phone ?? "",
      email: c.email ?? "",
      website: c.website ?? "",
      specialties: (c.specialties ?? []).join(", "),
      status: (c.status ?? "PENDING") as "PENDING" | "APPROVED" | "REJECTED",
    });
  };

  const openPostEditor = (p: Post) => {
    setEditingPost(p);
    setPostForm({
      title: p.title ?? "",
      content: p.content ?? "",
      category: (p.category ?? "GENERAL").toString().toUpperCase(),
      status: (p.status ?? "PENDING").toString().toUpperCase(),
    });
  };

  // save editors
  const saveClinic = async () => {
    if (!editingClinic) return;
    const specialties = clinicForm.specialties
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    await updateClinic({
      id: editingClinic.id,
      name: clinicForm.name,
      address: clinicForm.address,
      phone: clinicForm.phone,
      email: clinicForm.email,
      website: clinicForm.website,
      specialties,
      status: clinicForm.status,
    });

    await refetchClinics();
    setEditingClinic(null);
  };

  const savePost = async () => {
    if (!editingPost) return;

    await updatePost({
      id: editingPost.id,
      title: postForm.title,
      content: postForm.content,
      category: postForm.category,
      status: postForm.status,
    });

    await refetchPosts();
    setEditingPost(null);
  };

  const clinicStatusBadge = (status: string) => {
    const s = (status ?? "PENDING").toUpperCase();
    const classes =
      s === "APPROVED"
        ? "bg-green-500/10 text-green-600 border-green-500/20"
        : s === "REJECTED"
          ? "bg-red-500/10 text-red-600 border-red-500/20"
          : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    return (
      <Badge variant="outline" className={`flex items-center gap-1 ${classes}`}>
        <Clock className="h-3 w-3" />
        {s}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
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

        {/* ===== Clinics ===== */}
        <TabsContent value="clinics" className="space-y-6">
          {/* Pending clinics */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Clinic Approvals</CardTitle>
              <CardDescription>
                Review and approve clinic suggestions from users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingClinics.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No pending clinics.
                </div>
              ) : (
                pendingClinics.map((clinic) => (
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
                              <a
                                href={clinic.website}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {clinic.website}
                              </a>
                            ) : (
                              "Not provided"
                            )}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(clinic.specialties ?? []).map((specialty) => (
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
                      {clinicStatusBadge(clinic.status)}
                    </div>

                    <div className="flex flex-wrap gap-2">
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openClinicEditor(clinic)}
                        className="flex items-center gap-1"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      {/* NEW: delete clinic */}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteClinicHard(clinic.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* All Clinics (non-pending) */}
          <Card>
            <CardHeader>
              <CardTitle>All Clinics</CardTitle>
              <CardDescription>
                Edit or delete clinics that have already been posted.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {allNonPendingClinics.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No clinics found.
                </div>
              ) : (
                allNonPendingClinics.map((clinic) => (
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
                              <a
                                href={clinic.website}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {clinic.website}
                              </a>
                            ) : (
                              "Not provided"
                            )}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(clinic.specialties ?? []).map((specialty) => (
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
                      {clinicStatusBadge(clinic.status)}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openClinicEditor(clinic)}
                        className="flex items-center gap-1"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      {/* NEW: delete clinic */}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteClinicHard(clinic.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== Users ===== */}
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
                  filteredUsers.map((user) => {
                    const created = formatYmd(user.createdAt);
                    const avatarSrc = user?.profilePicture
                      ? `${FILES_URL}${user.profilePicture}`
                      : "/placeholder.svg";

                    return (
                      <div
                        key={user.id}
                        className="flex items-center justify-between border rounded-lg p-4"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage
                              src={avatarSrc}
                              alt={user?.name ?? "User"}
                            />
                            <AvatarFallback>
                              {(user?.name ?? "?")
                                .split(" ")
                                .filter(Boolean)
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">
                              {user?.name ?? "Unknown"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {user?.email ?? "—"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Joined {created || "—"}
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
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== Posts ===== */}
        <TabsContent value="posts" className="space-y-4">
          <div className="grid gap-4 ">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="space-y-2">
                    {/* NEW: admin post actions */}
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openPostEditor(post)}
                        className="flex items-center gap-1"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePostHard(post.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
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

      {/* ===== Edit Clinic Dialog ===== */}
      <Dialog
        open={!!editingClinic}
        onOpenChange={(open) => !open && setEditingClinic(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Clinic</DialogTitle>
            <DialogDescription>
              Update clinic details and save changes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={clinicForm.name}
                onChange={(e) =>
                  setClinicForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <Input
                value={clinicForm.address}
                onChange={(e) =>
                  setClinicForm((f) => ({ ...f, address: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={clinicForm.phone}
                  onChange={(e) =>
                    setClinicForm((f) => ({ ...f, phone: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={clinicForm.email}
                  onChange={(e) =>
                    setClinicForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Website</label>
              <Input
                value={clinicForm.website}
                onChange={(e) =>
                  setClinicForm((f) => ({ ...f, website: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Specialties (comma-separated)
              </label>
              <Textarea
                value={clinicForm.specialties}
                onChange={(e) =>
                  setClinicForm((f) => ({ ...f, specialties: e.target.value }))
                }
                className="min-h-20"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                value={clinicForm.status}
                onChange={(e) =>
                  setClinicForm((f) => ({
                    ...f,
                    status: e.target.value as
                      | "PENDING"
                      | "APPROVED"
                      | "REJECTED",
                  }))
                }
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditingClinic(null)}>
              Cancel
            </Button>
            <Button onClick={saveClinic}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Edit Post Dialog ===== */}
      <Dialog
        open={!!editingPost}
        onOpenChange={(open) => !open && setEditingPost(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Modify post content, category, or status.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={postForm.title}
                onChange={(e) =>
                  setPostForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={postForm.content}
                onChange={(e) =>
                  setPostForm((f) => ({ ...f, content: e.target.value }))
                }
                className="min-h-28"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={postForm.category}
                  onChange={(e) =>
                    setPostForm((f) => ({
                      ...f,
                      category: e.target.value.toUpperCase(),
                    }))
                  }
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={postForm.status}
                  onChange={(e) =>
                    setPostForm((f) => ({
                      ...f,
                      status: e.target.value.toUpperCase(),
                    }))
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditingPost(null)}>
              Cancel
            </Button>
            <Button onClick={savePost}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
