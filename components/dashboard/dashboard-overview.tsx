"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import {
  Scan,
  TrendingUp,
  Calendar,
  Users,
  Hospital,
  AlertTriangle,
  CheckCircle,
  Activity,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { FeatureCard } from "@/types/feature-card";
import { useScanHistory } from "@/hooks/useScan";
import { FILES_URL } from "@/constants/backend-url";

const communityActivity = [
  {
    user: "Sarah M.",
    action: "shared experience with Eczema treatment",
    time: "2 hours ago",
    avatar: "/user-avatar.jpg",
  },
  {
    user: "Dr. Johnson",
    action: "posted new skincare tips",
    time: "4 hours ago",
    avatar: "/doctor-avatar.png",
  },
  {
    user: "Mike R.",
    action: "asked about acne treatment options",
    time: "6 hours ago",
    avatar: "/user-avatar-2.jpg",
  },
];

const nearbyClinic = {
  name: "Advanced Dermatology Center",
  rating: 4.8,
  distance: "2.3 miles",
  specialties: ["Acne Treatment", "Skin Cancer", "Cosmetic Dermatology"],
  nextAvailable: "Tomorrow 2:00 PM",
};

export function DashboardOverview() {
  const { data: recentScans, isLoading } = useScanHistory();
  if (isLoading) {
    return;
  }
  const featureCards: FeatureCard[] = [
    {
      id: 1,
      title: "Total Scans",
      Icon: Scan,
      amount: recentScans?.length || 0,
    },
    {
      id: 2,
      title: "Community Posts",
      Icon: Users,
      amount: 5,
    },
  ];
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "low":
        return CheckCircle;
      case "medium":
        return AlertTriangle;
      case "high":
        return AlertTriangle;
      default:
        return CheckCircle;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground text-lg">
          Track your skin health journey and stay connected with your care.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {featureCards.map((card) => (
          <Card key={card.id} className=" @container/card ">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold">{card.amount}</p>
                </div>
                <card.Icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Scans</CardTitle>
                <CardDescription>
                  Your latest skin analysis results
                </CardDescription>
              </div>
              <Button asChild size="sm">
                <Link href="/scan">
                  <Plus className="mr-2 h-4 w-4" />
                  New Scan
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentScans?.map((scan) => {
                const RiskIcon = getRiskIcon(scan.risk);
                return (
                  <div
                    key={scan.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border/50"
                  >
                    <Image
                      src={
                        `${FILES_URL}/${scan.imageUrl}` || "/placeholder.svg"
                      }
                      alt="Scan result"
                      className="w-12 h-12 rounded-lg object-cover"
                      width={500}
                      height={500}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">
                          {(scan.confidence * 100).toFixed(1)}
                        </p>
                        <Badge
                          className={getRiskColor(scan.risk)}
                          variant="outline"
                        >
                          <RiskIcon className="mr-1 h-3 w-3" />
                          {scan.risk}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {new Date(scan.timestamp).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-1">
                          <span>Confidence:</span>
                          <span className="font-medium">
                            {scan.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
              <Button
                asChild
                variant="outline"
                className="w-full bg-transparent"
              >
                <Link href="/community">View All Scans</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hospital className="h-5 w-5" />
                Nearby Clinic
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{nearbyClinic.name}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>★ {nearbyClinic.rating}</span>
                  <span>•</span>
                  <span>{nearbyClinic.distance}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Specialties:</p>
                <div className="flex flex-wrap gap-1">
                  {nearbyClinic.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Next available: </span>
                <span className="font-medium">
                  {nearbyClinic.nextAvailable}
                </span>
              </div>
              <Button asChild className="w-full">
                <Link href="/clinics">View Details</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
