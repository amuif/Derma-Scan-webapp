"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, MapPin, Phone, CheckCircle, ArrowUpRight } from "lucide-react";
import { useFindClinic } from "@/hooks/useClinic";
import { Clinic } from "@/types/clinic";
import { CreateClinicDialog } from "./new-clinic";
import { Button } from "../ui/button";

export function ClinicsInterface() {
  const { data: clinics, isLoading, isError, refetch } = useFindClinic();
  const [creationCompleted, setCreationCompleted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClinics, setFilteredClinis] = useState<Clinic[]>([]);

  useEffect(() => {
    if (!clinics) return;
    const filtered =
      clinics?.filter((clinic) => clinic.name.includes(searchQuery)) || [];
    setFilteredClinis(filtered);
    console.log(filtered);
  }, [clinics, searchQuery]);
  useEffect(() => {
    if (creationCompleted === true) {
      refetch().then(() => {
        setCreationCompleted(false);
      });
    }
  }, [creationCompleted, refetch]);

  if (isLoading) {
    <div>Loading........</div>;
  }
  if (isError) {
    <div>Error occurred check the dev tools for more information</div>;
  }
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

      <Card>
        <CardContent className="">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for clinics"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Found {filteredClinics.length}{" "}
          {filteredClinics.length === 1 ? "clinic" : "clinics"}
        </p>
        <div className="flex gap-2">
          <CreateClinicDialog setCreationCompleted={setCreationCompleted} />
        </div>
      </div>
      {filteredClinics.length === 0 && (
        <div className="m-auto h-full w-full">No results found</div>
      )}
      {filteredClinics.map((clinic) => {
        return (
          <Card key={clinic.id} className="overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{clinic.name}</h3>
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{clinic.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

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

                <Separator className="my-4" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{clinic.phone}</span>
                    </div>
                    {clinic.website && (
                      <div className="flex items-center gap-1">
                        <Button asChild variant="outline">
                          <a href={clinic.website} target="_blank">
                            Explore <ArrowUpRight />
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
