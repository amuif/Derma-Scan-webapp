"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Building2,
  Users,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Eye,
  Trash2,
  UserCheck,
  UserX,
  AlertTriangle,
  TrendingUp,
  Activity,
} from "lucide-react"

// Mock data for clinic suggestions
const pendingClinics = [
  {
    id: 1,
    name: "Advanced Dermatology Center",
    address: "123 Medical Plaza, New York, NY 10001",
    phone: "(555) 123-4567",
    email: "info@advancedderm.com",
    website: "www.advancedderm.com",
    specialties: ["Acne Treatment", "Skin Cancer", "Cosmetic Dermatology"],
    submittedBy: "Dr. Sarah Johnson",
    submittedDate: "2024-01-15",
    status: "pending",
    description:
      "State-of-the-art dermatology clinic with 15+ years of experience in treating various skin conditions.",
  },
  {
    id: 2,
    name: "Skin Health Institute",
    address: "456 Wellness Ave, Los Angeles, CA 90210",
    phone: "(555) 987-6543",
    email: "contact@skinhealthinst.com",
    website: "www.skinhealthinstitute.com",
    specialties: ["Psoriasis", "Eczema", "Pediatric Dermatology"],
    submittedBy: "Dr. Michael Chen",
    submittedDate: "2024-01-12",
    status: "pending",
    description: "Specialized clinic focusing on chronic skin conditions with holistic treatment approaches.",
  },
]

// Mock data for users
const users = [
  {
    id: 1,
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    joinDate: "2024-01-10",
    scansCount: 12,
    status: "active",
    avatar: "/user-avatar.jpg",
  },
  {
    id: 2,
    name: "James Rodriguez",
    email: "james.r@email.com",
    joinDate: "2024-01-08",
    scansCount: 8,
    status: "active",
    avatar: "/user-avatar-2.jpg",
  },
  {
    id: 3,
    name: "Sarah Kim",
    email: "sarah.kim@email.com",
    joinDate: "2024-01-05",
    scansCount: 15,
    status: "suspended",
    avatar: "/user-avatar.jpg",
  },
]

// Mock data for reported content
const reportedContent = [
  {
    id: 1,
    type: "community_post",
    content: "This treatment didn't work for me at all...",
    author: "Anonymous User",
    reportReason: "Inappropriate content",
    reportedBy: "Emma Wilson",
    reportDate: "2024-01-14",
    status: "pending",
  },
  {
    id: 2,
    type: "clinic_review",
    content: "Terrible service, would not recommend...",
    author: "John Doe",
    reportReason: "False information",
    reportedBy: "Dr. Sarah Johnson",
    reportDate: "2024-01-13",
    status: "pending",
  },
]

export function AdminInterface() {
  const [activeTab, setActiveTab] = useState("clinics")
  const [searchTerm, setSearchTerm] = useState("")

  const handleApproveClinic = (clinicId: number) => {
    console.log(`Approving clinic ${clinicId}`)
    // In a real app, this would make an API call
  }

  const handleRejectClinic = (clinicId: number) => {
    console.log(`Rejecting clinic ${clinicId}`)
    // In a real app, this would make an API call
  }

  const handleSuspendUser = (userId: number) => {
    console.log(`Suspending user ${userId}`)
    // In a real app, this would make an API call
  }

  const handleActivateUser = (userId: number) => {
    console.log(`Activating user ${userId}`)
    // In a real app, this would make an API call
  }

  const handleResolveReport = (reportId: number, action: string) => {
    console.log(`Resolving report ${reportId} with action: ${action}`)
    // In a real app, this would make an API call
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Clinics</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">+1 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reported Content</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Needs review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Scans</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+5% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Admin Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="clinics">Clinic Approvals</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="content">Content Moderation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Clinic Approvals Tab */}
        <TabsContent value="clinics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Clinic Approvals</CardTitle>
              <CardDescription>Review and approve clinic suggestions from users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingClinics.map((clinic) => (
                <div key={clinic.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{clinic.name}</h3>
                      <p className="text-sm text-muted-foreground">{clinic.address}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>{clinic.phone}</span>
                        <span>{clinic.email}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {clinic.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Pending
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Description:</strong> {clinic.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Submitted by {clinic.submittedBy} on {clinic.submittedDate}
                    </p>
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
                    <Button size="sm" variant="outline" className="flex items-center gap-1 bg-transparent">
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
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
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between border rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {user.joinDate} • {user.scansCount} scans
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
                      {user.status === "active" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSuspendUser(user.id)}
                          className="flex items-center gap-1"
                        >
                          <UserX className="h-4 w-4" />
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleActivateUser(user.id)}
                          className="flex items-center gap-1"
                        >
                          <UserCheck className="h-4 w-4" />
                          Activate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Moderation Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Moderation</CardTitle>
              <CardDescription>Review reported content and community posts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportedContent.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{report.type.replace("_", " ")}</Badge>
                        <Badge variant="destructive">Reported</Badge>
                      </div>
                      <p className="text-sm font-medium">"{report.content}"</p>
                      <p className="text-xs text-muted-foreground">
                        By {report.author} • Reported by {report.reportedBy} on {report.reportDate}
                      </p>
                      <p className="text-sm text-orange-600">
                        <strong>Reason:</strong> {report.reportReason}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleResolveReport(report.id, "approve")}
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Keep Content
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleResolveReport(report.id, "remove")}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove Content
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResolveReport(report.id, "warn")}
                      className="flex items-center gap-1"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Warn User
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  App Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Daily Active Users</span>
                    <span className="font-medium">892</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Weekly Active Users</span>
                    <span className="font-medium">3,421</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Monthly Active Users</span>
                    <span className="font-medium">12,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Scans This Month</span>
                    <span className="font-medium">2,156</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Scan Results Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Low Risk</span>
                    <span className="font-medium text-green-600">68%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Medium Risk</span>
                    <span className="font-medium text-yellow-600">24%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">High Risk</span>
                    <span className="font-medium text-red-600">8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average Confidence</span>
                    <span className="font-medium">87.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Detected Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Acne</span>
                  <span className="font-medium">34%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Eczema</span>
                  <span className="font-medium">22%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Dry Skin</span>
                  <span className="font-medium">18%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Psoriasis</span>
                  <span className="font-medium">12%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Other</span>
                  <span className="font-medium">14%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">API Response Time</span>
                  <span className="font-medium text-green-600">245ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Uptime</span>
                  <span className="font-medium text-green-600">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Error Rate</span>
                  <span className="font-medium text-green-600">0.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Storage Used</span>
                  <span className="font-medium">2.3TB / 5TB</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
