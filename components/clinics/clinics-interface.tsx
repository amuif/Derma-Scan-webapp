"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Phone,
  CheckCircle,
  ArrowUpRight,
  AlertCircle,
  Building2,
  Grid3X3,
  Rows3,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { useFindClinic } from "@/hooks/useClinic";
import type { Clinic } from "@/types/clinic";
import { CreateClinicDialog } from "./new-clinic";

/* ---------------- helpers ---------------- */
function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
function includesI(hay: string | undefined | null, needle: string) {
  if (!hay) return false;
  return hay.toLowerCase().includes(needle.toLowerCase());
}
function matchesClinic(c: Clinic, q: string) {
  if (!q.trim()) return true;
  return (
    includesI(c.name, q) ||
    includesI(c.address, q) ||
    includesI(String(c.phone ?? ""), q) ||
    (Array.isArray(c.specialties) && c.specialties.some((s) => includesI(s, q)))
  );
}
function unique<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

/* ---------------- skeleton ---------------- */
function SkeletonCard() {
  return (
    <Card className="rounded-2xl border-border/60 bg-background/60 backdrop-blur">
      <CardContent className="p-6">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-3 w-56 animate-pulse rounded bg-muted/80" />
        <div className="mt-4 h-6 w-28 animate-pulse rounded bg-muted/70" />
        <div className="mt-4 h-8 w-40 animate-pulse rounded bg-muted/60" />
      </CardContent>
    </Card>
  );
}

/* ---------------- component ---------------- */
export function ClinicsInterface() {
  const { data: clinics, isLoading, isError, refetch } = useFindClinic();

  const [creationCompleted, setCreationCompleted] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeChip, setActiveChip] = useState<string>("all");

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  // refresh after creation
  useEffect(() => {
    if (creationCompleted) {
      refetch().finally(() => setCreationCompleted(false));
    }
  }, [creationCompleted, refetch]);

  // build specialty chips from data
  const specialtyChips = useMemo(() => {
    if (!clinics) return ["all"];
    const all = clinics.flatMap((c) => c.specialties ?? []);
    const chips = unique(all.map((s) => s.trim()).filter(Boolean)).sort();
    return ["all", ...chips];
  }, [clinics]);

  // filtered clinics
  const filtered = useMemo(() => {
    if (!clinics) return [];
    let data = clinics;

    // chip filter
    if (activeChip !== "all") {
      data = data.filter((c) => (c.specialties ?? []).includes(activeChip));
    }

    // text search
    const out = data
      .filter((c) => matchesClinic(c, debouncedQuery))
      .sort((a, b) => a.name.localeCompare(b.name));

    return out;
  }, [clinics, debouncedQuery, activeChip]);

  /* -------- loading / error returns -------- */
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(60%_70%_at_50%_40%,#000_40%,transparent_100%)]"
          >
            <svg className="absolute inset-0 h-full w-full">
              <defs>
                <pattern id="grid-clinic" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeWidth=".5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-clinic)" className="text-foreground/20" />
            </svg>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border bg-background/80 p-2 backdrop-blur">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Trusted Clinics &amp; Specialists</h1>
              <p className="text-sm text-muted-foreground">
                Find verified dermatologists and healthcare providers in your area.
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="mb-2 text-3xl font-bold">Trusted Clinics &amp; Specialists</h1>
          <p className="text-lg text-muted-foreground">
            Find verified dermatologists and healthcare providers in your area.
          </p>
        </header>

        <Card className="rounded-2xl border-rose-500/20 bg-rose-500/5">
          <CardContent className="flex items-center gap-2 p-6 text-rose-600">
            <AlertCircle className="h-5 w-5" />
            <span>Failed to fetch clinics. Please try again.</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(60%_70%_at_50%_40%,#000_40%,transparent_100%)]"
        >
          <svg className="absolute inset-0 h-full w-full">
            <defs>
              <pattern id="grid-clinicx" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeWidth=".5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-clinicx)" className="text-foreground/20" />
          </svg>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border bg-background/80 p-2 backdrop-blur">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Trusted Clinics &amp; Specialists</h1>
            <p className="text-sm text-muted-foreground">
              Find verified dermatologists and healthcare providers in your area.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky toolbar */}
      <div className="sticky top-16 z-10 rounded-2xl border bg-background/70 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* search */}
          <div className="relative w-full md:max-w-xl">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search by clinic name, address, specialty, or phone"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex rounded-xl border p-1">
              <Button
                variant={view === "grid" ? "default" : "ghost"}
                size="icon"
                className="rounded-lg"
                onClick={() => setView("grid")}
                aria-label="Grid view"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "list" ? "default" : "ghost"}
                size="icon"
                className="rounded-lg"
                onClick={() => setView("list")}
                aria-label="List view"
              >
                <Rows3 className="h-4 w-4" />
              </Button>
            </div>
            <CreateClinicDialog setCreationCompleted={setCreationCompleted} />
          </div>
        </div>

        {/* chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {specialtyChips.map((chip) => {
            const active = activeChip === chip;
            return (
              <Badge
                key={chip}
                variant={active ? "default" : "outline"}
                onClick={() => setActiveChip(chip)}
                className={cn(
                  "cursor-pointer rounded-full px-3 py-1",
                  active ? "" : "hover:bg-muted"
                )}
              >
                {chip === "all" ? "All specialties" : chip}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* result count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Found <span className="font-medium">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "clinic" : "clinics"}
          {debouncedQuery ? (
            <>
              {" "}
              for <span className="font-medium">“{debouncedQuery}”</span>
            </>
          ) : null}
          {activeChip !== "all" ? (
            <>
              {" "}
              in <span className="font-medium">{activeChip}</span>
            </>
          ) : null}
        </p>
      </div>

      {/* empty */}
      {filtered.length === 0 && (
        <Card className="rounded-2xl">
          <CardContent className="flex items-center gap-3 p-8 text-muted-foreground">
            <Building2 className="h-5 w-5" />
            <div>No results found. Try a different search or specialty.</div>
          </CardContent>
        </Card>
      )}

      {/* content */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((clinic) => (
            <ClinicCard key={clinic.id} clinic={clinic} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((clinic) => (
            <ClinicRow key={clinic.id} clinic={clinic} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- cards ---------------- */
function ClinicCard({ clinic }: { clinic: Clinic }) {
  const isVerified =
    (clinic as any).verified ?? (clinic as any).isVerified ?? true;

  return (
    <Card className="group rounded-2xl border-border/60 bg-background/60 shadow-sm transition-all hover:shadow-lg">
      <CardContent className="p-6">
        {/* header */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-lg font-semibold">{clinic.name}</h3>
              {isVerified && (
                <Badge
                  variant="outline"
                  className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                >
                  <CheckCircle className="h-4 w-4" />
                  Verified
                </Badge>
              )}
            </div>
            {clinic.address && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{clinic.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* specialties */}
        {Array.isArray(clinic.specialties) && clinic.specialties.length > 0 && (
          <div className="mt-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Specialties
            </p>
            <div className="flex flex-wrap gap-2">
              {clinic.specialties.map((s) => (
                <Badge key={s} variant="outline" className="rounded-full">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-4" />

        {/* contact */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {clinic.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>{clinic.phone}</span>
              </div>
            )}
          </div>

          {clinic.website && (
            <Button asChild variant="outline" className="gap-1">
              <a href={clinic.website} target="_blank" rel="noreferrer">
                Explore <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ClinicRow({ clinic }: { clinic: Clinic }) {
  const isVerified =
    (clinic as any).verified ?? (clinic as any).isVerified ?? true;

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-5">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="truncate text-base font-semibold">{clinic.name}</h3>
              {isVerified && (
                <Badge
                  variant="outline"
                  className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                >
                  <CheckCircle className="h-4 w-4" />
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {clinic.address && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {clinic.address}
                </span>
              )}
              {Array.isArray(clinic.specialties) && clinic.specialties.length > 0 && (
                <>
                  <span>•</span>
                  <span className="flex flex-wrap gap-1">
                    {clinic.specialties.slice(0, 3).map((s) => (
                      <Badge key={s} variant="secondary" className="rounded-full">
                        {s}
                      </Badge>
                    ))}
                    {clinic.specialties.length > 3 && (
                      <Badge variant="outline" className="rounded-full">
                        +{clinic.specialties.length - 3}
                      </Badge>
                    )}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {clinic.phone && (
              <Badge variant="outline" className="rounded-full">
                <Phone className="mr-1 h-3.5 w-3.5" />
                {clinic.phone}
              </Badge>
            )}
            {clinic.website && (
              <Button asChild variant="outline" className="gap-1">
                <a href={clinic.website} target="_blank" rel="noreferrer">
                  Explore <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Hospital, MapPin, Phone, ShieldCheck, ArrowUpRight } from "lucide-react";
import Link from "next/link";

function initials(name: string = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (!parts.length) return "CL";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function ClinicCard({ clinic }: { clinic: any }) {
  const name = clinic?.name ?? "Unnamed Clinic";
  const city = clinic?.city ?? clinic?.address ?? "—";
  const specs: string[] = Array.isArray(clinic?.specialties) ? clinic.specialties : [];
  const phone = clinic?.phone ?? "";
  const website = clinic?.website ?? "";

  return (
    <Card
      className="group relative overflow-hidden rounded-2xl border p-4 transition-colors
                 hover:bg-muted/40"
    >
      {/* top row */}
      <div className="flex items-start gap-3">
        {/* logo/monogram */}
        <div className="grid h-10 w-10 place-items-center rounded-xl border bg-background">
          <span className="text-xs font-semibold">{initials(name)}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="truncate text-sm font-semibold">{name}</h4>
            <Badge variant="outline" className="gap-1 rounded-full text-[10px]">
              <ShieldCheck className="h-3 w-3 text-primary" />
              Verified
            </Badge>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {city}
            </span>
            {phone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* specialties */}
      {specs.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {specs.slice(0, 6).map((s, i) => (
            <Badge key={`${clinic?.id}-${s}-${i}`} variant="secondary" className="text-[10px]">
              {s}
            </Badge>
          ))}
          {specs.length > 6 && (
            <Badge variant="outline" className="text-[10px]">+{specs.length - 6} more</Badge>
          )}
        </div>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">No specialties listed.</p>
      )}

      {/* actions */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {website ? (
          <Button asChild size="sm" className="h-8">
            <a href={website} target="_blank" rel="noreferrer">
              Visit site
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="h-8" disabled>
            Visit site
          </Button>
        )}

        {phone ? (
          <Button asChild size="sm" variant="outline" className="h-8">
            <a href={`tel:${phone}`}>Call</a>
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="h-8" disabled>
            Call
          </Button>
        )}

        <Button asChild size="sm" variant="ghost" className="h-8">
          <Link href={`/clinics/${clinic?.id ?? ""}`}>Details</Link>
        </Button>
      </div>

      {/* corner accent */}
      <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
    </Card>
  );
}
