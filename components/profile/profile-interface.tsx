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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Settings,
  Bell,
  Shield,
  Camera,
  Save,
  Edit,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Info,
  CheckCircle,
} from "lucide-react";

interface ProfileData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    location: string;
    avatar: string;
  };
  skinProfile: {
    skinType: string;
    primaryConcerns: string[];
    allergies: string;
    currentMedications: string;
    skinGoals: string;
    previousTreatments: string;
  };
  preferences: {
    notifications: {
      scanReminders: boolean;
      communityUpdates: boolean;
      treatmentAlerts: boolean;
      clinicRecommendations: boolean;
    };
    privacy: {
      profileVisibility: string;
      shareScansWithCommunity: boolean;
      allowClinicRecommendations: boolean;
    };
  };
}

export function ProfileInterface() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1990-05-15",
      location: "San Francisco, CA",
      avatar: "/user-avatar.jpg",
    },
    skinProfile: {
      skinType: "combination",
      primaryConcerns: ["Acne", "Hyperpigmentation"],
      allergies: "Fragrance, Sulfates",
      currentMedications: "Tretinoin 0.025%, Benzoyl Peroxide 2.5%",
      skinGoals: "Clear, even-toned skin with reduced acne scarring",
      previousTreatments: "Chemical peels, LED light therapy",
    },
    preferences: {
      notifications: {
        scanReminders: true,
        communityUpdates: false,
        treatmentAlerts: true,
        clinicRecommendations: true,
      },
      privacy: {
        profileVisibility: "community",
        shareScansWithCommunity: false,
        allowClinicRecommendations: true,
      },
    },
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to a backend
    console.log("Saving profile data:", profileData);
  };

  const skinTypes = [
    { value: "oily", label: "Oily" },
    { value: "dry", label: "Dry" },
    { value: "combination", label: "Combination" },
    { value: "sensitive", label: "Sensitive" },
    { value: "normal", label: "Normal" },
  ];

  const skinConcerns = [
    "Acne",
    "Hyperpigmentation",
    "Fine Lines",
    "Dryness",
    "Sensitivity",
    "Rosacea",
    "Eczema",
    "Psoriasis",
    "Melasma",
    "Scarring",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground text-lg">
            Manage your personal information and skin health profile.
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal Info
          </TabsTrigger>
          <TabsTrigger value="skin" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Skin Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your basic profile information and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={profileData.personalInfo.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback className="text-lg">
                    {profileData.personalInfo.firstName.charAt(0)}
                    {profileData.personalInfo.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {profileData.personalInfo.firstName}{" "}
                    {profileData.personalInfo.lastName}
                  </h3>
                  <Button variant="outline" size="sm" disabled={!isEditing}>
                    <Camera className="mr-2 h-4 w-4" />
                    Change Photo
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.personalInfo.firstName}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          firstName: e.target.value,
                        },
                      }))
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.personalInfo.lastName}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          lastName: e.target.value,
                        },
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
                      value={profileData.personalInfo.email}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            email: e.target.value,
                          },
                        }))
                      }
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profileData.personalInfo.phone}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            phone: e.target.value,
                          },
                        }))
                      }
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profileData.personalInfo.dateOfBirth}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            dateOfBirth: e.target.value,
                          },
                        }))
                      }
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={profileData.personalInfo.location}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            location: e.target.value,
                          },
                        }))
                      }
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skin" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skin Health Profile</CardTitle>
              <CardDescription>
                Provide detailed information about your skin to get more
                accurate AI recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="skinType">Skin Type</Label>
                  <Select
                    value={profileData.skinProfile.skinType}
                    onValueChange={(value) =>
                      setProfileData((prev) => ({
                        ...prev,
                        skinProfile: { ...prev.skinProfile, skinType: value },
                      }))
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your skin type" />
                    </SelectTrigger>
                    <SelectContent>
                      {skinTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Primary Skin Concerns</Label>
                  <div className="flex flex-wrap gap-2">
                    {skinConcerns.map((concern) => (
                      <Badge
                        key={concern}
                        variant={
                          profileData.skinProfile.primaryConcerns.includes(
                            concern,
                          )
                            ? "default"
                            : "secondary"
                        }
                        className={`cursor-pointer ${!isEditing ? "pointer-events-none" : ""}`}
                        onClick={() => {
                          if (!isEditing) return;
                          setProfileData((prev) => ({
                            ...prev,
                            skinProfile: {
                              ...prev.skinProfile,
                              primaryConcerns:
                                prev.skinProfile.primaryConcerns.includes(
                                  concern,
                                )
                                  ? prev.skinProfile.primaryConcerns.filter(
                                      (c) => c !== concern,
                                    )
                                  : [
                                      ...prev.skinProfile.primaryConcerns,
                                      concern,
                                    ],
                            },
                          }));
                        }}
                      >
                        {concern}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                <Input
                  id="allergies"
                  value={profileData.skinProfile.allergies}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      skinProfile: {
                        ...prev.skinProfile,
                        allergies: e.target.value,
                      },
                    }))
                  }
                  disabled={!isEditing}
                  placeholder="List any known skin allergies or sensitivities"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  value={profileData.skinProfile.currentMedications}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      skinProfile: {
                        ...prev.skinProfile,
                        currentMedications: e.target.value,
                      },
                    }))
                  }
                  disabled={!isEditing}
                  placeholder="List current skincare medications or treatments"
                  className="min-h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skinGoals">Skin Goals</Label>
                <Textarea
                  id="skinGoals"
                  value={profileData.skinProfile.skinGoals}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      skinProfile: {
                        ...prev.skinProfile,
                        skinGoals: e.target.value,
                      },
                    }))
                  }
                  disabled={!isEditing}
                  placeholder="Describe your skin health goals"
                  className="min-h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousTreatments">Previous Treatments</Label>
                <Textarea
                  id="previousTreatments"
                  value={profileData.skinProfile.previousTreatments}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      skinProfile: {
                        ...prev.skinProfile,
                        previousTreatments: e.target.value,
                      },
                    }))
                  }
                  disabled={!isEditing}
                  placeholder="List previous treatments you've tried"
                  className="min-h-20"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you'd like to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(profileData.preferences.notifications).map(
                ([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())
                          .trim()}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {key === "scanReminders" &&
                          "Get reminders to perform regular skin scans"}
                        {key === "communityUpdates" &&
                          "Receive updates from community discussions"}
                        {key === "treatmentAlerts" &&
                          "Get alerts about your treatment progress"}
                        {key === "clinicRecommendations" &&
                          "Receive recommendations for nearby clinics"}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setProfileData((prev) => ({
                          ...prev,
                          preferences: {
                            ...prev.preferences,
                            notifications: {
                              ...prev.preferences.notifications,
                              [key]: checked,
                            },
                          },
                        }))
                      }
                      disabled={!isEditing}
                    />
                  </div>
                ),
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control how your information is shared and used.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                <Select
                  value={profileData.preferences.privacy.profileVisibility}
                  onValueChange={(value) =>
                    setProfileData((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        privacy: {
                          ...prev.preferences.privacy,
                          profileVisibility: value,
                        },
                      },
                    }))
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="community">Community Only</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">
                    Share Scans with Community
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow your scan results to be shared anonymously for
                    community insights
                  </p>
                </div>
                <Switch
                  checked={
                    profileData.preferences.privacy.shareScansWithCommunity
                  }
                  onCheckedChange={(checked) =>
                    setProfileData((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        privacy: {
                          ...prev.preferences.privacy,
                          shareScansWithCommunity: checked,
                        },
                      },
                    }))
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">
                    Allow Clinic Recommendations
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive personalized clinic recommendations based on your
                    location and needs
                  </p>
                </div>
                <Switch
                  checked={
                    profileData.preferences.privacy.allowClinicRecommendations
                  }
                  onCheckedChange={(checked) =>
                    setProfileData((prev) => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        privacy: {
                          ...prev.preferences.privacy,
                          allowClinicRecommendations: checked,
                        },
                      },
                    }))
                  }
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Your privacy is important to us. All personal health information
              is encrypted and stored securely. We never share your data without
              your explicit consent.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

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
