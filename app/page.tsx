"use client";
import Link from "next/link";
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
} from "lucide-react";
import { useTokenQuery } from "@/hooks/useAuth";

export default function LandingPage() {
  const { data: token } = useTokenQuery();
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border m-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="relative container m-auto px-6 pt-24 lg:pt-44">
          <div className="m-auto min-h-screen flex-col items-center max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6">
              AI-Powered Dermatology Platform
            </Badge>
            <h1 className="mb-6 text-5xl font-bold  tracking-tight text-balance">
              Advanced skin condition detection with{" "}
              <span className="text-primary">AI precision</span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Get instant, accurate analysis of skin conditions including acne,
              eczema, psoriasis, and more. Professional-grade AI technology at
              your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href={token ? "/home" : "/login"}>
                  <Scan className="mr-2 h-5 w-5" />
                  Start Scanning
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-8 bg-transparent"
              >
                <Link href={token ? "/clinics" : "/login"}>
                  View Trusted Clinics
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Comprehensive Skin Analysis
            </h2>
            <p className="text-muted-foreground text-lg">
              Our AI technology provides detailed insights into various skin
              conditions with medical-grade accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Scan className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Multi-Condition Detection</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Detect acne, eczema, psoriasis, vitiligo, fungal infections,
                  melanoma, and other skin conditions with advanced AI analysis.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Risk Classification</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Get clear low, medium, or high risk assessments with
                  confidence scores to understand the urgency of your condition.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Health Profile Tracking</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Maintain a comprehensive skin health profile with scan
                  history, skin type information, and progress tracking.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Image Quality Guidance</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Receive real-time guidance to capture clear, well-lit photos
                  for optimal AI analysis and accurate results.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Community Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Connect with others, share experiences, and access your
                  complete scan history in a supportive community environment.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Hospital className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Trusted Clinics Network</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Access our curated network of verified dermatologists and
                  clinics for professional follow-up care when needed.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">100</div>
              <div className="text-sm text-muted-foreground">
                Scans Completed
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">15+</div>
              <div className="text-sm text-muted-foreground">
                Conditions Detected
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">
                Trusted Clinics
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How DermaScan Works</h2>
            <p className="text-muted-foreground text-lg">
              Get professional-grade skin analysis in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">1. Upload or Capture</h3>
              <p className="text-muted-foreground">
                Take a photo or upload an existing image of the skin area you
                want to analyze.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Scan className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">2. AI Analysis</h3>
              <p className="text-muted-foreground">
                Our advanced AI analyzes the image and identifies potential skin
                conditions with confidence scores.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">3. Get Results</h3>
              <p className="text-muted-foreground">
                Receive detailed analysis with risk assessment and
                recommendations for next steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">
              Ready to analyze your skin?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of users who trust DermaScan for accurate skin
              condition detection.
            </p>
            <Button size="lg" asChild className="text-lg px-8">
              <Link href={token ? "/home" : "/login"}>
                <Scan className="mr-2 h-5 w-5" />
                Start Your First Scan
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
