"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Cpu,
  Hospital,
  MapPin,
  Menu,
  MessageSquareText,
  Moon,
  Share2,
  Sun,
  Upload,
  X,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const [token, setToken] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("");
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Init: token + theme (system-pref aware)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setToken(localStorage.getItem("token"));
      const saved = localStorage.getItem("theme");
      if (saved) {
        const d = saved === "dark";
        setIsDark(d);
        document.documentElement.classList.toggle("dark", d);
      } else {
        const prefersDark =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDark(prefersDark);
        document.documentElement.classList.toggle("dark", prefersDark);
      }
    } catch {}
  }, []);

  // Scroll state for header morphing
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active link highlight (hash)
  useEffect(() => {
    const setFromHash = () =>
      setActiveHash(window.location.hash.replace("#", ""));
    setFromHash();
    window.addEventListener("hashchange", setFromHash);
    return () => window.removeEventListener("hashchange", setFromHash);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  // Escape closes drawer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return window.removeEventListener("keydown", onKey);
  }, []);

  // Body scroll + focus management for drawer
  useEffect(() => {
    if (drawerOpen) {
      setTimeout(() => closeBtnRef.current?.focus(), 120);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [drawerOpen]);

  // Close drawer on desktop resize
  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && setDrawerOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Helper: nav link style
  const navClass = (id: string) =>
    [
      "relative rounded-full px-3 py-1.5 text-sm transition",
      "text-muted-foreground hover:text-foreground",
      activeHash === id ? "text-foreground" : "",
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased">
      {/* Decorative lighting */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 -top-28 h-[26rem] bg-[radial-gradient(50%_50%_at_50%_0%,hsl(var(--color-primary)/0.25)_0%,transparent_70%)] blur-2xl" />
        <div className="absolute right-[-10%] top-1/3 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute left-[-8%] top-1/2 h-64 w-64 rounded-full bg-foreground/10 blur-3xl" />
      </div>

      {/* =================== MODERN HEADER =================== */}
      <header
        className={[
          "fixed top-0 z-50 w-full transition-all",
          isScrolled
            ? "border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm"
            : "bg-transparent",
        ].join(" ")}
      >
        {/* subtle grid glow background to match cards/sections */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(70%_100%_at_50%_0%,#000_40%,transparent_100%)]"
        >
          <svg className="absolute inset-0 h-full w-full">
            <defs>
              <pattern
                id="hdr-grid"
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
              fill="url(#hdr-grid)"
              className="text-foreground/10"
            />
          </svg>
        </div>

        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          {/* LOGO + NAME (unchanged) */}
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-primary text-primary-foreground p-2 shadow-sm">
              <Activity className="h-6 w-6" />
            </div>
            <span className="font-bold text-lg tracking-tight text-primary">
              DermaScan AI
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-3 md:flex">
            <nav className="flex items-center gap-1">
              {[
                ["features", "Features"],
                ["how-it-works", "How It Works"],
                ["community", "Community"],
                ["clinics", "Clinics"],
                ["faq", "FAQ"],
              ].map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={[
                    "group relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    "hover:bg-muted/60",
                    activeHash === id
                      ? "text-primary"
                      : "text-muted-foreground",
                  ].join(" ")}
                >
                  {label}
                  {/* underline accent */}
                  <span
                    className={[
                      "absolute left-1/2 top-[calc(100%-3px)] h-[2px] w-0 -translate-x-1/2 rounded-full bg-primary transition-all",
                      activeHash === id ? "w-6" : "group-hover:w-6",
                    ].join(" ")}
                  />
                </a>
              ))}
            </nav>

            {/* Theme toggle as a pill */}
            <button
              onClick={toggleTheme}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              title={isDark ? "Light" : "Dark"}
              className="inline-flex items-center justify-center rounded-full border px-3 py-2 text-sm hover:bg-muted/60"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Primary action */}
            <Link
              href={token ? "/home" : "/login"}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground shadow-sm hover:opacity-95"
            >
              {token ? "Dashboard" : "Login"}
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              className="rounded-full p-2 hover:bg-muted/60"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="rounded-full p-2 hover:bg-muted/60"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile overlay */}
        <div
          aria-hidden={!drawerOpen}
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
            drawerOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          onClick={() => setDrawerOpen(false)}
        />

        {/* Mobile drawer */}
        <aside
          aria-hidden={!drawerOpen}
          className={[
            "fixed right-0 top-0 z-50 h-full w-80 max-w-[80%] translate-x-full border-l border-border/60 bg-background/90",
            "backdrop-blur supports-[backdrop-filter]:bg-background/70 transition-transform duration-300 md:hidden",
            drawerOpen ? "!translate-x-0" : "",
          ].join(" ")}
        >
          <div className="flex h-16 items-center justify-between border-b border-border/60 px-5">
            {/* Keep logo+name here too (unchanged) */}
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary text-primary-foreground p-2">
                <Activity className="h-6 w-6" />
              </div>
              <span className="font-semibold">DermaScan AI</span>
            </div>
            <button
              ref={closeBtnRef}
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="rounded-full p-2 hover:bg-muted/60"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-2 p-5">
            {[
              ["features", "Features"],
              ["how-it-works", "How It Works"],
              ["community", "Community"],
              ["clinics", "Clinics"],
              ["faq", "FAQ"],
            ].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setDrawerOpen(false)}
                className={[
                  "rounded-xl px-4 py-3 text-base transition-colors",
                  activeHash === id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/60",
                ].join(" ")}
              >
                {label}
              </a>
            ))}
            <Link
              href={token ? "/home" : "/login"}
              onClick={() => setDrawerOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-base text-primary-foreground shadow-sm hover:opacity-95"
            >
              {token ? "Dashboard" : "Login"}
            </Link>
          </nav>
        </aside>
      </header>

      {/* =================== HERO SECTION =================== */}
      <section className="relative overflow-hidden py-28 md:py-36 bg-gradient-to-br from-background via-primary/5 to-background">
        {/* Ambient lights */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[-10%] top-[-10%] h-[40rem] w-[40rem] rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-[-10%] bottom-[-10%] h-[32rem] w-[32rem] rounded-full bg-foreground/10 blur-3xl" />
        </div>

        <div className="container mx-auto grid lg:grid-cols-2 items-center gap-16 px-6">
          {/* LEFT SIDE */}
          <div>
            <Badge variant="outline" className="mb-4 rounded-full px-4 py-1">
              AI-Powered Dermatology Platform
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
              Advanced skin condition detection with
              <span className="text-primary"> AI precision</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              DermaScan estimates your skin-cancer risk with a clear confidence
              score, advises whether to contact a doctor, and can analyze your
              text description too.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="rounded-2xl px-8 py-6 text-lg"
              >
                <Link href={token ? "/home" : "/login"}>Start Free Scan</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-2xl px-8 py-6 text-lg"
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Secure AI • Dermatology-grade accuracy
            </p>
          </div>

          {/* RIGHT SIDE — AI VISUAL */}
          <div className="relative flex items-center justify-center">
            {/* Glowing ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-80 w-80 rounded-full border border-primary/40 animate-[spin_18s_linear_infinite] opacity-40" />
              <div className="absolute h-56 w-56 rounded-full border-2 border-primary/60 blur-md animate-pulse" />
            </div>

            {/* Central AI node */}
            <div className="relative z-10 rounded-3xl border border-border bg-background/70 shadow-xl backdrop-blur-md px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-primary animate-pulse" />
                <span className="font-semibold">
                  DermaScan AI Engine Active
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Real-time model analyzing skin pixels for potential risks…
              </p>
              <div className="mt-4 h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full w-1/2 bg-primary animate-[pulse_2s_ease-in-out_infinite]" />
              </div>
            </div>

            {/* Floating feature chips */}
            <div className="absolute -bottom-10 flex gap-3">
              {[
                ["AI confidence", "M12 3v18m9-9H3"],
                [
                  "Privacy-first",
                  "M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z",
                ],
                [
                  "Doctor guidance",
                  "M12 21C7 21 3 17 3 12S7 3 12 3s9 4 9 9-4 9-9 9z M12 7v5l3 3",
                ],
              ].map(([label, d], i) => (
                <div
                  key={label}
                  className="rounded-xl border bg-background/80 px-3 py-2 text-xs shadow-sm backdrop-blur flex items-center gap-2 animate-[floaty_6s_ease-in-out_infinite]"
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d={String(d)} />
                  </svg>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ Divider ============ */}
      <div
        aria-hidden
        className="my-10 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent"
      />

      {/* =================== FEATURES =================== */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="mb-10 text-3xl font-semibold tracking-tight md:text-4xl">
            What DermaScan does
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Upload,
                title: "Upload any skin photo",
                desc: "Take or upload a clear photo—no special camera required.",
              },
              {
                icon: BrainCircuit,
                title: "AI risk + confidence score",
                desc: "Get an estimated skin-cancer risk with a transparent confidence score.",
              },
              {
                icon: Hospital,
                title: "Doctor recommendation",
                desc: "Know when to contact a dermatologist or seek urgent care.",
              },
              {
                icon: MessageSquareText,
                title: "Text analysis of symptoms",
                desc: "Describe color, change, size—AI analyzes your notes too.",
              },
              {
                icon: Share2,
                title: "Community awareness",
                desc: "Share anonymized results to raise awareness (opt-in).",
              },
              {
                icon: MapPin,
                title: "Clinic referrals",
                desc: "Find nearby dermatology partners or refer a new clinic.",
              },
            ].map((f, i) => (
              <Card
                key={i}
                className="rounded-2xl border border-border/60 bg-background/80 backdrop-blur transition hover:shadow-lg"
              >
                <CardHeader className="flex flex-row items-center gap-3 p-6 pb-3">
                  <div className="rounded-xl bg-primary/10 p-3">
                    {React.createElement(f.icon, {
                      className: "h-6 w-6 text-primary",
                    })}
                  </div>
                  <CardTitle className="leading-tight">{f.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <CardDescription>{f.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* =================== HOW IT WORKS =================== */}
      <section id="how-it-works" className="bg-muted/30 py-24">
        <div className="container mx-auto px-6">
          <h2 className="mb-10 text-3xl font-semibold tracking-tight">
            How it works
          </h2>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              {
                icon: Upload,
                title: "Upload",
                desc: "Take or upload a clear photo of the skin area.",
              },
              {
                icon: MessageSquareText,
                title: "Describe (Optional) ",
                desc: "Add what you’re noticing—color, change, size.",
              },
              {
                icon: Cpu,
                title: "AI analysis",
                desc: "Receive a cancer-risk estimate with a confidence score.",
              },
              {
                icon: CheckCircle2,
                title: "Next steps",
                desc: "Doctor advice, community share, or clinic referral.",
              },
            ].map((s, i) => (
              <Card key={i} className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    {React.createElement(s.icon, {
                      className: "h-6 w-6 text-primary",
                    })}
                  </div>
                  <h3 className="mb-1 font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* =================== COMMUNITY =================== */}
      <section id="community" className="py-20">
        <div className="container mx-auto px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">
                Community
              </h2>
              <p className="mt-2 text-muted-foreground">
                Share anonymized results to raise awareness and help others know
                what to look for.
              </p>
            </div>
            <Button asChild className="rounded-xl">
              <Link href={token ? "/community" : "/login"}>Open Community</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-base">Shared case #{i}</CardTitle>
                  <CardDescription>Anonymized example post</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  “AI flagged moderate risk at 82% confidence. Booking a clinic
                  visit.”
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* =================== CLINICS / REFERRAL =================== */}
      <section id="clinics" className="bg-muted/30 py-20">
        <div className="container mx-auto grid items-center gap-6 px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Find or refer a clinic
            </h2>
            <p className="mt-3 text-muted-foreground">
              If your result suggests follow-up, get routed to nearby partners
              or submit a clinic referral.
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild className="rounded-xl">
                <Link href={token ? "/clinics" : "/login"}>Browse Clinics</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href={token ? "/clinics/refer" : "/login"}>
                  Refer a Clinic
                </Link>
              </Button>
            </div>
          </div>

          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">Dermatology partners</p>
                  <p className="text-sm text-muted-foreground">
                    Find trusted care close to you.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  "City Derm Clinic",
                  "Skin Health Center",
                  "Medix Specialized",
                  "SunCare Dermatology",
                ].map((c) => (
                  <div
                    key={c}
                    className="rounded-lg border border-border/60 p-3 text-sm"
                  >
                    {c}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* =================== TABS (BUILT FOR) =================== */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="mb-6 text-3xl font-semibold tracking-tight">
            Built for
          </h2>
          <Tabs defaultValue="patients" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="clinics">Clinics</TabsTrigger>
              <TabsTrigger value="awareness">Awareness</TabsTrigger>
            </TabsList>
            <TabsContent value="patients" className="mt-6">
              <Card className="rounded-2xl p-6">
                <p className="text-muted-foreground">
                  Simple upload, clear AI risk + confidence, and actionable next
                  steps.
                </p>
              </Card>
            </TabsContent>
            <TabsContent value="clinics" className="mt-6">
              <Card className="rounded-2xl p-6">
                <p className="text-muted-foreground">
                  Referral routing and context from user submissions to support
                  triage.
                </p>
              </Card>
            </TabsContent>
            <TabsContent value="awareness" className="mt-6">
              <Card className="rounded-2xl p-6">
                <p className="text-muted-foreground">
                  Opt-in community posts to educate others on early signs to
                  notice.
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* =================== FAQ =================== */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="mb-6 text-3xl font-semibold tracking-tight">FAQ</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">
                  Is DermaScan a medical diagnosis?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                No. It’s an AI risk estimate with a confidence score. Always
                consult a clinician for diagnosis.
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">
                  What photos work best?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Sharp, well-lit close-ups without glare or blur. Include a ruler
                or coin for scale if possible.
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">
                  Do you store my photos?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                You control sharing. By default, images are processed securely
                and aren’t published without consent.
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">
                  How do referrals work?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                If risk is elevated, we surface nearby clinics and let you
                submit a referral or contact them directly.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* =================== CTA =================== */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border/60">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,hsl(var(--color-primary)/0.2),transparent)]"
            />
            <div className="relative p-10 text-center md:p-16">
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Ready to check your skin?
              </h3>
              <p className="mt-2 text-muted-foreground">
                Fast, private AI risk analysis with clear guidance.
              </p>
              <div className="mt-6">
                <Link
                  href={token ? "/home" : "/login"}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-base text-primary-foreground shadow-sm"
                >
                  Start Free Scan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================== FOOTER =================== */}
      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} DermaScan AI • All rights reserved</p>
      </footer>
    </div>
  );
}
