"use client";

import { useState, useEffect, useRef } from "react";
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
  Camera,
  Save,
  Edit,
  Mail,
  CheckCircle,
  Shield,
  Calendar,
} from "lucide-react";
import { useCurrentUserQuery, useUpdateCurrentUser } from "@/hooks/useAuth";
import { User } from "@/types/user";
import { FILES_URL } from "@/constants/backend-url";

export function ProfileInterface() {
  const { data: user, isLoading, isError, refetch } = useCurrentUserQuery();
  const { mutateAsync: updateUser } = useUpdateCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setProfileData(user);
      console.log(user);
    }
  }, [user]);

  const handleSave = async () => {
    if (!profileData) return;

    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("email", profileData.email);

      if (fileInputRef.current?.files?.[0]) {
        formData.append("profilePicture", fileInputRef.current.files[0]);
      }

      const response = await updateUser(formData);
      if (response) {
        setIsEditing(false);
        refetch();
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading || !profileData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Error loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground text-lg">
            Manage your personal information.
          </p>
        </div>
        <Button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Your account details and profile information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={
                  previewImage ||
                  `${FILES_URL}${profileData.profilePicture}` ||
                  "/placeholder.svg"
                }
              />
              <AvatarFallback className="text-lg">
                {getInitials(profileData?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{profileData.name}</h3>
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
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  disabled={!isEditing}
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!isEditing}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Change Photo
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev!,
                    name: e.target.value,
                  }))
                }
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev!,
                      email: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="createdAt">Member Since</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="createdAt"
                  value={formatDate(profileData.createdAt)}
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="updatedAt">Last Updated</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="updatedAt"
                  value={formatDate(profileData.updatedAt)}
                  disabled
                  className="pl-10 bg-muted"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}
