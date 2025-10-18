"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Scan,
  Shield,
  Activity,
  Users,
  Hospital,
  Upload,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
// import "/globals.css"

export default function LandingPage() {
  const [token, setToken] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // read token from localStorage (client-only)
  useEffect(() => {
    try {
      const t =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      setToken(t);
    } catch (e) {
      setToken(null);
    }
  }, []);

  // Initialize theme: respect saved preference, otherwise system
  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (saved === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else if (saved === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
      if (prefersDark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle theme and persist
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Close drawer on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Manage body scroll & focus when drawer toggles
  useEffect(() => {
    if (drawerOpen) {
      setTimeout(() => closeBtnRef.current?.focus(), 120);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [drawerOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setDrawerOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="rounded-xl bg-primary text-primary-foreground p-2">
              <Activity className="h-6 w-6" />
            </div>
            <span className="font-bold text-lg text-blue-600 tracking-tight">
              DermaScan AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {/* Desktop nav */}
            <nav className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
              <Link href="#features" className="hover:text-blue-600 transition">
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="hover:text-blue-600 transition"
              >
                How It Works
              </Link>
              <Link href="#clinics" className="hover:text-blue-600 transition">
                Clinics
              </Link>
              <Link href="#contact" className="hover:text-blue-600 transition">
                Contact
              </Link>
            </nav>

            {/* Dark mode icon */}
            <button
              onClick={toggleTheme}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            {/* Login / Dashboard button */}
            <div>
              <Link
                href={token ? "/home" : "/login"}
                className="inline-block rounded-xl px-4 py-1.5 bg-blue-600 text-white text-sm"
              >
                {token ? "Dashboard" : "Login"}
              </Link>
            </div>
          </div>

          {/* Mobile: hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        aria-hidden={!drawerOpen}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Slide-in Drawer */}
      <aside
        aria-hidden={!drawerOpen}
        className={`fixed top-18 right-0 z-50 h-[300px] w-48 bg-white dark:bg-gray-900 rounded-xl transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-end px-4 py-3">
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="flex flex-col justify-between h-[calc(300px-56px)] px-4 py-4">
          <nav className="flex flex-col gap-3 text-sm text-gray-700 dark:text-gray-200">
            <a
              href="#features"
              onClick={() => setDrawerOpen(false)}
              className="hover:text-blue-600 transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setDrawerOpen(false)}
              className="hover:text-blue-600 transition"
            >
              How It Works
            </a>
            <a
              href="#clinics"
              onClick={() => setDrawerOpen(false)}
              className="hover:text-blue-600 transition"
            >
              Clinics
            </a>
            <a
              href="#contact"
              onClick={() => setDrawerOpen(false)}
              className="hover:text-blue-600 transition"
            >
              Contact
            </a>
          </nav>

          <Link
            href={token ? "/home" : "/login"}
            className="px-3 py-2 bg-blue-600 text-white text-sm rounded-full text-center shadow-md"
          >
            {token ? "Dashboard" : "Login"}
          </Link>
        </div>
      </aside>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-36 bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge variant="outline" className="mb-4 rounded-full px-4 py-1">
              AI-Powered Dermatology Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
              Advanced skin condition detection with
              <span className="text-primary"> AI precision</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Get instant, accurate analysis of skin conditions including acne,
              eczema, psoriasis, and more. Professional-grade AI technology at
              your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="rounded-2xl px-8 py-6 text-lg"
              >
                <Link href={token ? "/home" : "/login"}>Start Scanning</Link>
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
              Secure AI • Dermatology-grade
            </p>
          </div>
          <div className="relative hidden lg:flex justify-center">
            <div className="absolute -z-10 w-[500px] h-[500px] bg-primary/20 blur-3xl rounded-full opacity-30"></div>
            <div className="rounded-3xl shadow-2xl overflow-hidden w-[500px] h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1200&auto=format"
                alt="AI Skin Scan"
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-semibold mb-3">
              Smart, Safe & Accurate
            </h2>
            <p className="text-muted-foreground">
              Designed with medical precision and built for real people.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Scan,
                title: "Multi-condition Detection",
                desc: "Detect acne, eczema, rashes, infections and more with AI-driven accuracy.",
              },
              {
                icon: Shield,
                title: "Private & Secure",
                desc: "Your images stay encrypted and never shared without your consent.",
              },
              {
                icon: Activity,
                title: "Risk Assessment",
                desc: "Get low, medium, or high risk insights with clear explanations.",
              },
              {
                icon: Upload,
                title: "Smart Image Guidance",
                desc: "Real-time assistance for lighting and focus to improve accuracy.",
              },
              {
                icon: Users,
                title: "Personal Tracking",
                desc: "Monitor your skin changes over time with secure scan history.",
              },
              {
                icon: Hospital,
                title: "Clinic Referrals",
                desc: "Find trusted dermatologists for follow-up care near you.",
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="p-6 hover:shadow-lg transition rounded-2xl"
              >
                <CardHeader className="flex flex-row items-center gap-3 p-0 mb-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    {React.createElement(item.icon, {
                      className: "h-6 w-6 text-primary",
                    })}
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription>{item.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-12">How it Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Upload Photo",
                text: "Take or upload a clear photo of the skin area.",
              },
              {
                icon: Scan,
                title: "AI Scan",
                text: "Our model analyzes patterns and detects conditions.",
              },
              {
                icon: CheckCircle,
                title: "Instant Results",
                text: "Get next-step guidance and care recommendations.",
              },
            ].map((step, i) => (
              <div key={i} className="p-6 rounded-2xl bg-background shadow-sm">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                  {React.createElement(step.icon, {
                    className: "h-7 w-7 text-primary",
                  })}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Ready to check your skin?
        </h2>
        <p className="text-muted-foreground mb-8">
          Fast, secure and clinically aware skin insights.
        </p>
        <Button size="lg" asChild className="rounded-2xl px-8 py-6 text-lg">
          <Link href={token ? "/home" : "/login"}>Start Free Scan</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="border-t border-border py-10 text-center text-sm text-muted-foreground"
      >
        <p>© {new Date().getFullYear()} DermaScan AI • All rights reserved</p>
      </footer>
    </div>
  );
}
