"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Phone,
  Globe,
  Calendar,
  Filter,
  CheckCircle,
  Award,
  Users,
  Stethoscope,
} from "lucide-react";

interface Clinic {
  id: number;
  name: string;
  type: "clinic" | "hospital" | "private_practice";
  rating: number;
  reviewCount: number;
  distance: string;
  address: string;
  phone: string;
  website?: string;
  image: string;
  specialties: string[];
  doctors: {
    name: string;
    title: string;
    avatar: string;
    experience: string;
  }[];
  nextAvailable: string;
  acceptsInsurance: boolean;
  verified: boolean;
  description: string;
  hours: {
    [key: string]: string;
  };
}

const mockClinics: Clinic[] = [
  {
    id: 1,
    name: "Advanced Dermatology Center",
    type: "clinic",
    rating: 4.8,
    reviewCount: 324,
    distance: "2.3 miles",
    address: "123 Medical Plaza, San Francisco, CA 94102",
    phone: "(415) 555-0123",
    website: "https://advancedderm.com",
    image: "/modern-medical-clinic.png",
    specialties: [
      "Acne Treatment",
      "Skin Cancer",
      "Cosmetic Dermatology",
      "Psoriasis",
    ],
    doctors: [
      {
        name: "Dr. Sarah Johnson",
        title: "Board-Certified Dermatologist",
        avatar: "/doctor-avatar.png",
        experience: "15 years",
      },
      {
        name: "Dr. Michael Chen",
        title: "Dermatopathologist",
        avatar: "/asian-male-doctor.png",
        experience: "12 years",
      },
    ],
    nextAvailable: "Tomorrow 2:00 PM",
    acceptsInsurance: true,
    verified: true,
    description:
      "Leading dermatology practice specializing in comprehensive skin care with state-of-the-art technology and personalized treatment plans.",
    hours: {
      Monday: "8:00 AM - 6:00 PM",
      Tuesday: "8:00 AM - 6:00 PM",
      Wednesday: "8:00 AM - 6:00 PM",
      Thursday: "8:00 AM - 6:00 PM",
      Friday: "8:00 AM - 5:00 PM",
      Saturday: "9:00 AM - 2:00 PM",
      Sunday: "Closed",
    },
  },
  {
    id: 2,
    name: "Bay Area Skin Institute",
    type: "hospital",
    rating: 4.6,
    reviewCount: 189,
    distance: "3.7 miles",
    address: "456 Healthcare Blvd, San Francisco, CA 94103",
    phone: "(415) 555-0456",
    website: "https://bayareaskin.org",
    image: "/hospital-dermatology-department.jpg",
    specialties: [
      "Melanoma Treatment",
      "Mohs Surgery",
      "Pediatric Dermatology",
      "Eczema",
    ],
    doctors: [
      {
        name: "Dr. Emily Rodriguez",
        title: "Mohs Surgeon",
        avatar: "/female-hispanic-doctor.jpg",
        experience: "18 years",
      },
    ],
    nextAvailable: "Next Week",
    acceptsInsurance: true,
    verified: true,
    description:
      "Comprehensive dermatology services within a major medical center, offering specialized treatments and research-based care.",
    hours: {
      Monday: "7:00 AM - 7:00 PM",
      Tuesday: "7:00 AM - 7:00 PM",
      Wednesday: "7:00 AM - 7:00 PM",
      Thursday: "7:00 AM - 7:00 PM",
      Friday: "7:00 AM - 7:00 PM",
      Saturday: "8:00 AM - 4:00 PM",
      Sunday: "10:00 AM - 4:00 PM",
    },
  },
  {
    id: 3,
    name: "Pacific Dermatology Group",
    type: "private_practice",
    rating: 4.9,
    reviewCount: 156,
    distance: "1.8 miles",
    address: "789 Wellness Way, San Francisco, CA 94104",
    phone: "(415) 555-0789",
    image: "/upscale-dermatology-office.jpg",
    specialties: ["Anti-Aging", "Laser Treatments", "Acne Scarring", "Rosacea"],
    doctors: [
      {
        name: "Dr. James Park",
        title: "Cosmetic Dermatologist",
        avatar: "/asian-male-doctor-smiling.png",
        experience: "20 years",
      },
    ],
    nextAvailable: "Friday 10:00 AM",
    acceptsInsurance: false,
    verified: true,
    description:
      "Boutique dermatology practice focusing on advanced cosmetic treatments and personalized skin care solutions.",
    hours: {
      Monday: "9:00 AM - 5:00 PM",
      Tuesday: "9:00 AM - 5:00 PM",
      Wednesday: "9:00 AM - 5:00 PM",
      Thursday: "9:00 AM - 5:00 PM",
      Friday: "9:00 AM - 3:00 PM",
      Saturday: "By Appointment",
      Sunday: "Closed",
    },
  },
];

export function ClinicsInterface() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("distance");

  const specialties = [
    "Acne Treatment",
    "Skin Cancer",
    "Cosmetic Dermatology",
    "Psoriasis",
    "Melanoma Treatment",
    "Mohs Surgery",
    "Pediatric Dermatology",
    "Eczema",
    "Anti-Aging",
    "Laser Treatments",
    "Rosacea",
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "clinic":
        return Stethoscope;
      case "hospital":
        return Award;
      case "private_practice":
        return Users;
      default:
        return Stethoscope;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "clinic":
        return "Medical Clinic";
      case "hospital":
        return "Hospital";
      case "private_practice":
        return "Private Practice";
      default:
        return "Medical Facility";
    }
  };

  const filteredClinics = mockClinics.filter((clinic) => {
    const matchesSearch =
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesSpecialty =
      selectedSpecialty === "all" ||
      clinic.specialties.includes(selectedSpecialty);
    const matchesType = selectedType === "all" || clinic.type === selectedType;

    return matchesSearch && matchesSpecialty && matchesType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Trusted Clinics & Specialists
        </h1>
        <p className="text-muted-foreground text-lg">
          Find verified dermatologists and healthcare providers in your area.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clinics, doctors, or specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={selectedSpecialty}
              onValueChange={setSelectedSpecialty}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="clinic">Medical Clinic</SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
                <SelectItem value="private_practice">
                  Private Practice
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="availability">Availability</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Found {filteredClinics.length}{" "}
            {filteredClinics.length === 1 ? "clinic" : "clinics"}
          </p>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>

        {filteredClinics.map((clinic) => {
          const TypeIcon = getTypeIcon(clinic.type);
          return (
            <Card key={clinic.id} className="overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-80">
                  <img
                    src={clinic.image || "/placeholder.svg"}
                    alt={clinic.name}
                    className="w-full h-48 lg:h-full object-cover"
                  />
                </div>

                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold">{clinic.name}</h3>
                        {clinic.verified && (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <TypeIcon className="h-4 w-4" />
                          <span>{getTypeLabel(clinic.type)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{clinic.rating}</span>
                          <span>({clinic.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{clinic.distance}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {clinic.address}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-green-600 mb-2">
                        <Clock className="h-4 w-4" />
                        <span>{clinic.nextAvailable}</span>
                      </div>
                      {clinic.acceptsInsurance && (
                        <Badge variant="secondary" className="text-xs">
                          Accepts Insurance
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm mb-4">{clinic.description}</p>

                  {/* Specialties */}
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Specialties:</p>
                    <div className="flex flex-wrap gap-2">
                      {clinic.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Doctors */}
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Doctors:</p>
                    <div className="flex gap-4">
                      {clinic.doctors.map((doctor, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={doctor.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {doctor.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{doctor.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doctor.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Contact and Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{clinic.phone}</span>
                      </div>
                      {clinic.website && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          <span>Website</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredClinics.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              No clinics found matching your criteria.
            </p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => {
                setSearchQuery("");
                setSelectedSpecialty("all");
                setSelectedType("all");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
