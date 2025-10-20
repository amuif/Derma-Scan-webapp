"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  Edit,
  Eye,
  EyeOff,
  Mail,
  Save,
  Shield,
  Calendar,
} from "lucide-react";
import { useCurrentUserQuery, useUpdateCurrentUser } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { FILES_URL } from "@/constants/backend-url";

export function ProfileInterface() {
  // data
  const { data: user, isLoading, isError, refetch } = useCurrentUserQuery();
  const { mutateAsync: updateUser } = useUpdateCurrentUser();

  // ui state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // form state
  const [profileData, setProfileData] = useState<User | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [matchPassword, setMatchPassword] = useState(true);

  // avatar
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (user) setProfileData(user);
  }, [user]);

  // keep password match in sync
  useEffect(() => {
    setMatchPassword(!password || password === confirmPassword);
  }, [password, confirmPassword]);

  // auto-hide success
  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(""), 2500);
    return () => clearTimeout(t);
  }, [successMsg]);

  const avatarSrc = useMemo(() => {
    if (previewImage) return previewImage;
    if (profileData?.profilePicture)
      return `${FILES_URL}${profileData.profilePicture}`;
    return "/placeholder.svg";
  }, [previewImage, profileData]);

  const getInitials = (name?: string) => {
    const n = (name ?? "").trim();
    if (!n) return "U";
    const parts = n.split(/\s+/);
    return (
      (parts[0]?.[0] ?? "U").toUpperCase() + (parts[1]?.[0] ?? "").toUpperCase()
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(String(reader.result));
    reader.readAsDataURL(f);
  };

  const resetEditingState = () => {
    setIsEditing(false);
    setPassword("");
    setConfirmPassword("");
    setPreviewImage(null);
    setErrorMsg("");
  };

  const handleSave = async () => {
    if (!profileData) return;
    if (password && !matchPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const formData = new FormData();
      formData.append("name", profileData.name ?? "");
      formData.append("email", profileData.email ?? "");
      if (password) formData.append("password", password);

      const file = fileInputRef.current?.files?.[0];
      if (file) formData.append("profilePicture", file);

      const res = await updateUser(formData);
      if (res) {
        resetEditingState();
        setSuccessMsg("Profile saved successfully.");
        await refetch();
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Remove handler that tries JSON first, then FormData flag
  const handleRemovePhoto = async () => {
    if (!profileData) return;

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      // Attempt JSON payload (if your hook supports it)
      try {
        // @ts-ignore – depends on your hook’s implementation
        const resJson = await updateUser({ removeProfilePicture: true });
        if (resJson) {
          setPreviewImage(null);
          setProfileData((p) => (p ? { ...p, profilePicture: "" } : p));
          setSuccessMsg("Profile picture removed.");
          await refetch();
          return;
        }
      } catch {
        // Fallthrough
      }

      // Fallback: multipart flag (common with multer/Nest)
      const form = new FormData();
      form.append("removeProfilePicture", "true");
      const resForm = await updateUser(form);
      if (resForm) {
        setPreviewImage(null);
        setProfileData((p) => (p ? { ...p, profilePicture: "" } : p));
        setSuccessMsg("Profile picture removed.");
        await refetch();
        return;
      }

      setErrorMsg("Could not remove profile picture.");
    } catch (e) {
      console.error("Remove picture failed:", e);
      setErrorMsg("Could not remove profile picture.");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Loading / Error ---------- */
  if (isLoading || !profileData) {
    return (
      <div className="flex min-h-[480px] items-center justify-center">
        <div className="rounded-xl border bg-muted/20 px-4 py-2 text-muted-foreground">
          Loading profile…
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[480px] items-center justify-center">
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          Error loading profile.
        </div>
      </div>
    );
  }

  /* ---------------- UI ----------------- */
  return (
    <div className="space-y-6">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 -mx-4 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur md:mx-0 md:rounded-xl md:border md:px-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarSrc} alt={profileData.name ?? "Profile"} />
            <AvatarFallback>{getInitials(profileData.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold leading-none">
                {profileData.name}
              </h2>
              <Badge
                variant={profileData.role === "ADMIN" ? "default" : "secondary"}
                className="flex items-center gap-1"
              >
                <Shield className="h-3 w-3" />
                {profileData.role}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{profileData.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="rounded-xl"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={resetEditingState}
                className="rounded-xl"
                disabled={!!saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="rounded-xl"
                disabled={!!saving || (!!password && !matchPassword)}
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving…" : "Save"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* banners */}
      {errorMsg && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4" />
          <div>{errorMsg}</div>
        </div>
      )}
      {successMsg && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-300/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle className="mt-0.5 h-4 w-4" />
          <div>{successMsg}</div>
        </div>
      )}

      {/* grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Overview */}
        <Card className="rounded-2xl border-border/60 bg-background/80 backdrop-blur lg:col-span-1">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Account summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={avatarSrc}
                  alt={profileData.name ?? "Profile"}
                />
                <AvatarFallback className="text-lg">
                  {getInitials(profileData.name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{profileData.name}</h3>
                  <Badge
                    variant={
                      profileData.role === "ADMIN" ? "default" : "secondary"
                    }
                    className="flex items-center gap-1"
                  >
                    <Shield className="h-3 w-3" />
                    {profileData.role}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" /> {profileData.email}
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium">
                  {formatDate(profileData.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last updated</span>
                <span className="font-medium">
                  {formatDate(profileData.updatedAt)}
                </span>
              </div>
            </div>

            {/* Photo controls */}
            <div className="flex flex-wrap gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={!isEditing || !!saving}
              />
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => fileInputRef.current?.click()}
                disabled={!isEditing || !!saving}
              >
                <Camera className="mr-2 h-4 w-4" />
                {isEditing ? "Change photo" : "Photo (locked)"}
              </Button>

              {/* Only show Remove when editing AND a photo exists */}
              {isEditing && !!profileData?.profilePicture && (
                <Button
                  variant="destructive"
                  className="rounded-xl"
                  disabled={!!saving}
                  onClick={handleRemovePhoto}
                >
                  Remove
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Editable sections */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal info */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Personal information</CardTitle>
              <CardDescription>Update your basic details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={profileData.name ?? ""}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...(prev as User),
                      name: e.target.value,
                    }))
                  }
                  disabled={!isEditing || !!saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email ?? ""}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...(prev as User),
                        email: e.target.value,
                      }))
                    }
                    disabled={!isEditing || !!saving}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!isEditing || !!saving}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave blank to keep current password.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={!isEditing || !!saving}
                />
                {password && (
                  <p
                    className={`text-sm ${matchPassword ? "text-emerald-600" : "text-red-500"}`}
                  >
                    {matchPassword
                      ? "✓ Passwords match"
                      : "❌ Passwords do not match"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Account metadata</CardTitle>
              <CardDescription>Key timestamps</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="createdAt">Member since</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="createdAt"
                    value={formatDate(profileData.createdAt)}
                    disabled
                    className="pl-10 bg-muted"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="updatedAt">Last updated</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="updatedAt"
                    value={formatDate(profileData.updatedAt)}
                    disabled
                    className="pl-10 bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
