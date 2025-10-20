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
  Trash2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Filter,
  RefreshCcw,
  CheckSquare,
  Square,
} from "lucide-react";

import {
  useDeleteClinic,
  useFindAllClinic,
  useUpdateClinic,
} from "@/hooks/useClinic";
import type { Clinic } from "@/types/clinic";
import type { User } from "@/types/user";

import { useDeleteMutation, useFindAllUsers } from "@/hooks/useAuth";
import { FILES_URL } from "@/constants/backend-url";

import {
  useDeletePost,
  useGetAllAllowedPost,
  useUpdatePost,
} from "@/hooks/usePost";
import type { Post } from "@/types/post";

import { useScanHistory } from "@/hooks/useScan";
import type { Scan } from "@/types/scan";

import { format } from "date-fns";
import { PostCard } from "./admin-user-interface";
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
  if (Number.isNaN(d.getTime())) return "";
  return format(d, "yyyy-MM-dd");
}
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const CATEGORY_OPTIONS = [
  "GENERAL",
  "PREVENTION",
  "AWARENESS",
  "TREATMENT",
  "SUPPORT",
  "TIPS",
] as const;
const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED"] as const;

/* ===== tiny table utils ===== */
type SortDir = "asc" | "desc";
function useSort<T>(
  data: T[],
  keyGetter: (item: T) => string | number,
  defaultKey?: string,
) {
  const [dir, setDir] = useState<SortDir>("asc");
  const [toggle, setToggle] = useState(0); // trigger re-sort when key changes

  const sorted = useMemo(() => {
    const copy = [...data];
    copy.sort((a, b) => {
      const ka = keyGetter(a);
      const kb = keyGetter(b);
      if (ka < kb) return dir === "asc" ? -1 : 1;
      if (ka > kb) return dir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [data, dir, keyGetter, toggle]);

  const flip = () => setDir((d) => (d === "asc" ? "desc" : "asc"));
  const reset = () => setToggle((x) => x + 1);

  return { sorted, dir, flip, reset, setDir };
}

function paginate<T>(data: T[], page: number, size: number) {
  const start = (page - 1) * size;
  return data.slice(start, start + size);
}

/* ===== main component ===== */
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

  const [activeTab, setActiveTab] = useState<"clinics" | "users" | "posts">(
    "clinics",
  );

  /* ===== raw data state ===== */
  const [pendingClinics, setPendingClinics] = useState<Clinic[]>([]);
  const [nonPendingClinics, setNonPendingClinics] = useState<Clinic[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);

  /* ===== selections for bulk actions ===== */
  const [selectedClinicIds, setSelectedClinicIds] = useState<Set<string>>(
    new Set(),
  );
  const [selectedPostIds, setSelectedPostIds] = useState<Set<string>>(
    new Set(),
  );
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set(),
  );

  /* ===== filters/search ===== */
  // Clinics
  const [clinicQuery, setClinicQuery] = useState("");
  const [clinicStatus, setClinicStatus] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  >("ALL");
  const [clinicSpecialty, setClinicSpecialty] = useState<string>("ALL");

  // Posts
  const [postQuery, setPostQuery] = useState("");
  const [postStatus, setPostStatus] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  >("ALL");
  const [postCategory, setPostCategory] = useState<
    "ALL" | (typeof CATEGORY_OPTIONS)[number]
  >("ALL");

  // Users
  const [userQuery, setUserQuery] = useState("");

  /* ===== edit dialog state ===== */
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [clinicForm, setClinicForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    specialties: "",
    status: "PENDING" as (typeof STATUS_OPTIONS)[number],
  });

  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    category: "GENERAL",
    status: "PENDING",
  });

  /* ===== pagination ===== */
  const [clinicPage, setClinicPage] = useState(1);
  const [postPage, setPostPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const PAGE_SIZE = 6;

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
    const pending =
      clinics?.filter((c) => (c.status ?? "PENDING") === "PENDING") ?? [];
    const others =
      clinics?.filter((c) => (c.status ?? "PENDING") !== "PENDING") ?? [];
    setPendingClinics(pending);
    setNonPendingClinics(others);
  }, [clinics]);

  /* ===== computed: specialty options (from all clinics) ===== */
  const specialtyOptions = useMemo(() => {
    const all = (clinics ?? []).flatMap((c) => c.specialties ?? []);
    const set = new Set(all.map((s) => s.trim()).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, [clinics]);

  /* ===== filtering & sorting ===== */
  // Clinics combined list with status filter
  const clinicsFiltered = useMemo(() => {
    const all = [...(clinics ?? [])];
    const q = clinicQuery.trim().toLowerCase();
    return all.filter((c) => {
      const statusOk =
        clinicStatus === "ALL"
          ? true
          : (c.status ?? "PENDING") === clinicStatus;
      const specOk =
        clinicSpecialty === "ALL"
          ? true
          : (c.specialties ?? []).includes(clinicSpecialty);
      const textOk =
        !q ||
        toLowerSafe(c.name).includes(q) ||
        toLowerSafe(c.address).includes(q) ||
        toLowerSafe(c.phone).includes(q) ||
        toLowerSafe(c.email).includes(q) ||
        (c.specialties ?? []).some((s) => toLowerSafe(s).includes(q));
      return statusOk && specOk && textOk;
    });
  }, [clinics, clinicQuery, clinicStatus, clinicSpecialty]);

  const {
    sorted: clinicsSorted,
    dir: clinicDir,
    flip: flipClinicSort,
  } = useSort(clinicsFiltered, (c) => toLowerSafe(c.name));

  const clinicPages = Math.max(1, Math.ceil(clinicsSorted.length / PAGE_SIZE));
  const clinicsPageData = paginate(clinicsSorted, clinicPage, PAGE_SIZE);

  useEffect(() => {
    setClinicPage(1);
  }, [clinicQuery, clinicStatus, clinicSpecialty]);

  // Posts
  const postsFiltered = useMemo(() => {
    const q = postQuery.trim().toLowerCase();
    return (posts ?? []).filter((p) => {
      const sOk =
        postStatus === "ALL"
          ? true
          : (p.status ?? "PENDING").toUpperCase() === postStatus;
      const cOk =
        postCategory === "ALL"
          ? true
          : (p.category ?? "GENERAL").toUpperCase() === postCategory;
      const textOk =
        !q ||
        toLowerSafe(p.title).includes(q) ||
        toLowerSafe(p.content).includes(q) ||
        toLowerSafe(p.author?.name).includes(q);
      return sOk && cOk && textOk;
    });
  }, [posts, postQuery, postStatus, postCategory]);

  const {
    sorted: postsSorted,
    dir: postDir,
    flip: flipPostSort,
  } = useSort(postsFiltered, (p) => new Date(p.createdAt ?? "").getTime() || 0);

  const postPages = Math.max(1, Math.ceil(postsSorted.length / PAGE_SIZE));
  const postsPageData = paginate(postsSorted, postPage, PAGE_SIZE);

  useEffect(() => {
    setPostPage(1);
  }, [postQuery, postStatus, postCategory]);

  // Users
  const usersFiltered = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const name = toLowerSafe(u?.name);
      const email = toLowerSafe(u?.email);
      const created = formatYmd(u?.createdAt).toLowerCase();
      return name.includes(q) || email.includes(q) || created.includes(q);
    });
  }, [users, userQuery]);

  const {
    sorted: usersSorted,
    dir: userDir,
    flip: flipUserSort,
  } = useSort(usersFiltered, (u) => toLowerSafe(u?.name) || "");

  const userPages = Math.max(1, Math.ceil(usersSorted.length / PAGE_SIZE));
  const usersPageData = paginate(usersSorted, userPage, PAGE_SIZE);

  useEffect(() => {
    setUserPage(1);
  }, [userQuery]);

  /* ===== bulk selection helpers ===== */
  const toggleSel = (
    set: React.Dispatch<React.SetStateAction<Set<string>>>,
    id: string,
  ) =>
    set((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const pageSelectAll = (
    items: { id: string }[],
    set: React.Dispatch<React.SetStateAction<Set<string>>>,
  ) =>
    set((prev) => {
      const next = new Set(prev);
      items.forEach((it) => next.add(it.id));
      return next;
    });

  const pageClearAll = (
    items: { id: string }[],
    set: React.Dispatch<React.SetStateAction<Set<string>>>,
  ) =>
    set((prev) => {
      const next = new Set(prev);
      items.forEach((it) => next.delete(it.id));
      return next;
    });

  /* ===== handlers: clinics ===== */
  const handleApproveClinic = async (clinicId: string) => {
    await updateClinic({ id: clinicId, status: "APPROVED" });
    await refetchClinics();
  };
  const handleRejectClinic = async (clinicId: string) => {
    if (!window.confirm("Reject this clinic suggestion?")) return;
    await deleteClinic(clinicId);
    await refetchClinics();
  };
  const handleDeleteClinicHard = async (clinicId: string) => {
    if (
      !window.confirm("Delete this clinic permanently? This cannot be undone.")
    )
      return;
    await deleteClinic(clinicId);
    await refetchClinics();
  };

  const bulkApproveClinics = async () => {
    if (selectedClinicIds.size === 0) return;
    await Promise.all(
      Array.from(selectedClinicIds).map((id) =>
        updateClinic({ id, status: "APPROVED" }),
      ),
    );
    setSelectedClinicIds(new Set());
    await refetchClinics();
  };
  const bulkDeleteClinics = async () => {
    if (selectedClinicIds.size === 0) return;
    if (!window.confirm("Delete selected clinics permanently?")) return;
    await Promise.all(
      Array.from(selectedClinicIds).map((id) => deleteClinic(id)),
    );
    setSelectedClinicIds(new Set());
    await refetchClinics();
  };

  /* ===== handlers: posts ===== */
  const handleAcceptPost = async (postId: string) => {
    await updatePost({ id: postId, status: "APPROVED" });
    await refetchPosts();
  };
  const handleRejectPost = async (postId: string) => {
    if (!window.confirm("Reject/remove this post?")) return;
    await deletePost(postId);
    await refetchPosts();
  };
  const handleDeletePostHard = async (postId: string) => {
    if (!window.confirm("Delete this post permanently?")) return;
    await deletePost(postId);
    await refetchPosts();
  };

  const bulkApprovePosts = async () => {
    if (selectedPostIds.size === 0) return;
    await Promise.all(
      Array.from(selectedPostIds).map((id) =>
        updatePost({ id, status: "APPROVED" }),
      ),
    );
    setSelectedPostIds(new Set());
    await refetchPosts();
  };
  const bulkDeletePosts = async () => {
    if (selectedPostIds.size === 0) return;
    if (!window.confirm("Delete selected posts permanently?")) return;
    await Promise.all(Array.from(selectedPostIds).map((id) => deletePost(id)));
    setSelectedPostIds(new Set());
    await refetchPosts();
  };

  /* ===== handlers: users ===== */
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    await deleteUser(userId);
    await refetchUsers();
  };
  const bulkDeleteUsers = async () => {
    if (selectedUserIds.size === 0) return;
    if (!window.confirm("Delete selected users permanently?")) return;
    await Promise.all(Array.from(selectedUserIds).map((id) => deleteUser(id)));
    setSelectedUserIds(new Set());
    await refetchUsers();
  };

  /* ===== open editors ===== */
  const openClinicEditor = (c: Clinic) => {
    setEditingClinic(c);
    setClinicForm({
      name: c.name ?? "",
      address: c.address ?? "",
      phone: c.phone ?? "",
      email: c.email ?? "",
      website: c.website ?? "",
      specialties: (c.specialties ?? []).join(", "),
      status: (c.status ?? "PENDING") as (typeof STATUS_OPTIONS)[number],
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

  const clinicStatusBadge = (status?: string) => {
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

  const totals = {
    pendingClinics: pendingClinics.length,
    allUsers: users.length,
    posts: posts.length,
    scans: scans.length,
  };

  return (
    <div className="space-y-6">
      {/* Hero / Header */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(60%_70%_at_50%_40%,#000_40%,transparent_100%)]"
        >
          <svg className="absolute inset-0 h-full w-full">
            <defs>
              <pattern
                id="grid-admin-2"
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
              fill="url(#grid-admin-2)"
              className="text-foreground/20"
            />
          </svg>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border bg-background/80 p-2 backdrop-blur">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Console</h1>
            <p className="text-sm text-muted-foreground">
              Approve clinics, manage users, and review educational posts.
            </p>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Clinics
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.pendingClinics}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.allUsers}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Educational Posts
            </CardTitle>
            <BookText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.posts}</div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Community Posts
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.scans}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs with counts */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clinics">
            Clinics
            {totals.pendingClinics > 0 && (
              <Badge className="ml-2" variant="secondary">
                {totals.pendingClinics}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="users">
            Users
            <Badge className="ml-2" variant="secondary">
              {totals.allUsers}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="posts">
            Posts
            <Badge className="ml-2" variant="secondary">
              {totals.posts}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* ================= Clinics ================= */}
        <TabsContent value="clinics" className="space-y-4">
          {/* Sticky Action Bar */}
          <div className="sticky top-16 z-10 rounded-2xl border bg-background/70 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              {/* Left: Filters */}
              <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center">
                <div className="relative w-full md:max-w-sm">
                  <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <Input
                    placeholder="Search clinics (name, address, specialty, phone, email)"
                    value={clinicQuery}
                    onChange={(e) => setClinicQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                    value={clinicStatus}
                    onChange={(e) => setClinicStatus(e.target.value as any)}
                  >
                    <option value="ALL">All Statuses</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <select
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                    value={clinicSpecialty}
                    onChange={(e) => setClinicSpecialty(e.target.value)}
                  >
                    {specialtyOptions.map((s) => (
                      <option key={s} value={s}>
                        {s === "ALL" ? "All Specialties" : s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right: Bulk actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setClinicQuery("");
                    setClinicStatus("ALL");
                    setClinicSpecialty("ALL");
                    setSelectedClinicIds(new Set());
                  }}
                  title="Reset filters"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button
                  variant="default"
                  disabled={selectedClinicIds.size === 0}
                  onClick={bulkApproveClinics}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Selected
                </Button>
                <Button
                  variant="destructive"
                  disabled={selectedClinicIds.size === 0}
                  onClick={bulkDeleteClinics}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>

          {/* Header row: sort + select all */}
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">
              Showing{" "}
              <span className="font-medium">{clinicsPageData.length}</span> of{" "}
              <span className="font-medium">{clinicsSorted.length}</span>{" "}
              clinics
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={flipClinicSort}>
                Sort by Name{" "}
                {clinicDir === "asc" ? <ChevronDown /> : <ChevronUp />}
              </Button>
              {clinicsPageData.length > 0 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      pageSelectAll(clinicsPageData, setSelectedClinicIds)
                    }
                  >
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Select page
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      pageClearAll(clinicsPageData, setSelectedClinicIds)
                    }
                  >
                    <Square className="mr-2 h-4 w-4" />
                    Clear page
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Clinic list */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {clinicsPageData.length === 0 ? (
              <Card className="rounded-2xl">
                <CardContent className="p-6 text-sm text-muted-foreground">
                  No clinics match your filters.
                </CardContent>
              </Card>
            ) : (
              clinicsPageData.map((clinic) => {
                const selected = selectedClinicIds.has(clinic.id);
                return (
                  <Card
                    key={clinic.id}
                    className={cn(
                      "rounded-2xl transition-shadow hover:shadow-lg",
                      selected && "ring-2 ring-primary/30",
                    )}
                  >
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() =>
                              toggleSel(setSelectedClinicIds, clinic.id)
                            }
                            className="h-4 w-4 accent-primary"
                            aria-label="Select clinic"
                          />
                          <div>
                            <h3 className="text-lg font-semibold">
                              {clinic.name}
                            </h3>
                            {clinic.address && (
                              <p className="text-sm text-muted-foreground">
                                {clinic.address}
                              </p>
                            )}
                          </div>
                        </div>
                        {clinicStatusBadge(clinic.status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        {clinic.phone && (
                          <Badge variant="outline">{clinic.phone}</Badge>
                        )}
                        {clinic.email && (
                          <Badge variant="outline">{clinic.email}</Badge>
                        )}
                        {clinic.website && (
                          <a
                            className="text-sm underline"
                            href={clinic.website}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Website
                          </a>
                        )}
                      </div>

                      {(clinic.specialties?.length ?? 0) > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {(clinic.specialties ?? []).map((s) => (
                            <Badge
                              key={s}
                              variant="secondary"
                              className="text-xs"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {(clinic.status ?? "PENDING") !== "APPROVED" && (
                          <Button
                            size="sm"
                            onClick={() => handleApproveClinic(clinic.id)}
                            className="gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectClinic(clinic.id)}
                          className="gap-1"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openClinicEditor(clinic)}
                          className="gap-1"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClinicHard(clinic.id)}
                          className="gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {clinicPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={clinicPage === 1}
                onClick={() => setClinicPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <div className="text-sm">
                Page <span className="font-medium">{clinicPage}</span> of{" "}
                <span className="font-medium">{clinicPages}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={clinicPage === clinicPages}
                onClick={() =>
                  setClinicPage((p) => Math.min(clinicPages, p + 1))
                }
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        {/* ================= Users ================= */}
        <TabsContent value="users" className="space-y-4">
          {/* Sticky bar */}
          <div className="sticky top-16 z-10 rounded-2xl border bg-background/70 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-md">
                <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Search users (name, email, date)"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  disabled={selectedUserIds.size === 0}
                  onClick={bulkDeleteUsers}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">
              Showing{" "}
              <span className="font-medium">{usersPageData.length}</span> of{" "}
              <span className="font-medium">{usersSorted.length}</span> users
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={flipUserSort}>
                Sort by Name{" "}
                {userDir === "asc" ? <ChevronDown /> : <ChevronUp />}
              </Button>
              {usersPageData.length > 0 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      pageSelectAll(usersPageData, setSelectedUserIds)
                    }
                  >
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Select page
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      pageClearAll(usersPageData, setSelectedUserIds)
                    }
                  >
                    <Square className="mr-2 h-4 w-4" />
                    Clear page
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {usersPageData.length === 0 ? (
              <Card className="rounded-2xl">
                <CardContent className="p-6 text-sm text-muted-foreground">
                  No users found.
                </CardContent>
              </Card>
            ) : (
              usersPageData.map((user) => {
                const created = formatYmd(user.createdAt);
                const avatarSrc = user?.profilePicture
                  ? `${FILES_URL}${user.profilePicture}`
                  : "/placeholder.svg";
                const initials =
                  (user?.name ?? "?")
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U";
                const selected = selectedUserIds.has(user.id);

                return (
                  <div
                    key={user.id}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-4",
                      selected && "ring-2 ring-primary/30",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleSel(setSelectedUserIds, user.id)}
                        className="h-4 w-4 accent-primary"
                        aria-label="Select user"
                      />
                      <Avatar>
                        <AvatarImage
                          src={avatarSrc}
                          alt={user?.name ?? "User"}
                        />
                        <AvatarFallback>{initials}</AvatarFallback>
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

          {userPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={userPage === 1}
                onClick={() => setUserPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <div className="text-sm">
                Page <span className="font-medium">{userPage}</span> of{" "}
                <span className="font-medium">{userPages}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={userPage === userPages}
                onClick={() => setUserPage((p) => Math.min(userPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        {/* ================= Posts ================= */}
        <TabsContent value="posts" className="space-y-4">
          {/* Sticky bar */}
          <div className="sticky top-16 z-10 rounded-2xl border bg-background/70 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center">
                <div className="relative w-full md:max-w-sm">
                  <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <Input
                    placeholder="Search posts (title, content, author)"
                    value={postQuery}
                    onChange={(e) => setPostQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                    value={postStatus}
                    onChange={(e) => setPostStatus(e.target.value as any)}
                  >
                    <option value="ALL">All Statuses</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <select
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value as any)}
                  >
                    <option value="ALL">All Categories</option>
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPostQuery("");
                    setPostStatus("ALL");
                    setPostCategory("ALL");
                    setSelectedPostIds(new Set());
                  }}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button
                  variant="default"
                  disabled={selectedPostIds.size === 0}
                  onClick={bulkApprovePosts}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Selected
                </Button>
                <Button
                  variant="destructive"
                  disabled={selectedPostIds.size === 0}
                  onClick={bulkDeletePosts}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">
              Showing{" "}
              <span className="font-medium">{postsPageData.length}</span> of{" "}
              <span className="font-medium">{postsSorted.length}</span> posts
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={flipPostSort}>
                Sort by Date{" "}
                {postDir === "asc" ? <ChevronDown /> : <ChevronUp />}
              </Button>
              {postsPageData.length > 0 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      pageSelectAll(postsPageData, setSelectedPostIds)
                    }
                  >
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Select page
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      pageClearAll(postsPageData, setSelectedPostIds)
                    }
                  >
                    <Square className="mr-2 h-4 w-4" />
                    Clear page
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {postsPageData.length === 0 ? (
              <Card className="rounded-2xl">
                <CardContent className="p-6 text-sm text-muted-foreground">
                  No posts match your filters.
                </CardContent>
              </Card>
            ) : (
              postsPageData.map((post) => {
                const selected = selectedPostIds.has(post.id);
                return (
                  <Card
                    key={post.id}
                    className={cn(
                      "rounded-2xl transition-shadow hover:shadow-lg",
                      selected && "ring-2 ring-primary/30",
                    )}
                  >
                    <CardContent className="space-y-2 p-5">
                      {/* Row actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() =>
                              toggleSel(setSelectedPostIds, post.id)
                            }
                            className="h-4 w-4 accent-primary"
                            aria-label="Select post"
                          />
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {(post.category ?? "GENERAL")
                                .toString()
                                .toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {(post.status ?? "PENDING")
                                .toString()
                                .toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {(post.status ?? "PENDING").toUpperCase() !==
                            "APPROVED" && (
                            <Button
                              size="sm"
                              onClick={() => handleAcceptPost(post.id)}
                              className="gap-1"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openPostEditor(post)}
                            className="gap-1"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeletePostHard(post.id)}
                            className="gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>

                      <PostCard
                        post={post}
                        onReject={handleRejectPost}
                        onApprove={handleAcceptPost}
                      />
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {postPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={postPage === 1}
                onClick={() => setPostPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <div className="text-sm">
                Page <span className="font-medium">{postPage}</span> of{" "}
                <span className="font-medium">{postPages}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={postPage === postPages}
                onClick={() => setPostPage((p) => Math.min(postPages, p + 1))}
              >
                Next
              </Button>
            </div>
          )}
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={clinicForm.status}
                onChange={(e) =>
                  setClinicForm((f) => ({
                    ...f,
                    status: e.target.value as (typeof STATUS_OPTIONS)[number],
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
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
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
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
