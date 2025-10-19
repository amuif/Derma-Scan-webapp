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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Scan as ScanIcon,
  Hospital,
  Users,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface TextCondition {
  name: string;
  description: string;
}
interface TextGuidance {
  message: string;
  reason: string;
}
export interface TextAnalysisResult {
  id: string;
  conditions: TextCondition[];
  risk_level: string;
  confidence: number;
  guidance: TextGuidance[];
}

interface TextScanResultsProps {
  result: TextAnalysisResult;
  onNewScan: () => void;
  onShareScan: () => void;
  isAnalyzing: boolean;
}

/* ----------------- helpers ----------------- */
function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
function riskTone(risk: string) {
  const r = (risk || "").toLowerCase();
  if (r === "high")
    return {
      bar: "bg-rose-500",
      chip: "border-rose-500/20 bg-rose-500/10 text-rose-600",
    };
  if (r === "medium")
    return {
      bar: "bg-amber-500",
      chip: "border-amber-500/20 bg-amber-500/10 text-amber-600",
    };
  return {
    bar: "bg-emerald-500",
    chip: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  };
}
function riskIcon(risk: string) {
  const r = (risk || "").toLowerCase();
  if (r === "high") return AlertTriangle;
  if (r === "low") return CheckCircle;
  return Info;
}

/* ----------------- component ----------------- */
export function TextScanResults({
  result,
  onNewScan,
  onShareScan,
  isAnalyzing,
}: TextScanResultsProps) {
  const RiskIcon = riskIcon(result.risk_level);
  const tone = riskTone(result.risk_level);
  const confidencePct = Math.round((result.confidence ?? 0) * 100);

  return (
    <div className="space-y-8">
      {/* Header ribbon */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 md:p-7">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(60%_70%_at_50%_40%,#000_40%,transparent_100%)]"
        >
          <svg className="absolute inset-0 h-full w-full">
            <defs>
              <pattern
                id="grid-textres"
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
              fill="url(#grid-textres)"
              className="text-foreground/20"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Symptom Analysis Results
            </h2>
            <p className="text-sm text-muted-foreground">
              AI-powered assessment based on your description
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={onShareScan} disabled={isAnalyzing} className="rounded-xl">
              Share with community
            </Button>
            <Button
              onClick={onNewScan}
              variant="outline"
              disabled={isAnalyzing}
              className="rounded-xl"
            >
              <ScanIcon className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer (below header) */}
      <Alert className="rounded-2xl">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Medical Disclaimer:</strong> This AI analysis is for
          informational purposes only and should not be used as a substitute for
          professional medical advice, diagnosis, or treatment. Always consult
          a qualified healthcare provider for proper evaluation.
        </AlertDescription>
      </Alert>

      {/* Risk Assessment */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
            <Badge
              variant="outline"
              className={cls(
                "flex items-center gap-1 rounded-full px-3 py-1",
                tone.chip,
              )}
            >
              <RiskIcon className="mr-1 h-3.5 w-3.5" />
              {String(result.risk_level || "unknown").toUpperCase()} RISK
            </Badge>
          </div>
          <CardDescription>
            Based on your symptom description, here&apos;s our AI assessment
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Confidence */}
          <section>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">AI Confidence</span>
              <span className="text-sm font-semibold">{confidencePct}%</span>
            </div>
            <div className="relative">
              <Progress value={confidencePct} className="h-2" />
              <div
                className={cls(
                  "pointer-events-none absolute left-0 top-0 h-2 rounded-[inherit]",
                  tone.bar,
                )}
                style={{ width: `${confidencePct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Confidence reflects how sure the AI is about this assessment based
              on your text input.
            </p>
          </section>
        </CardContent>
      </Card>

      {/* Possible Conditions */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Possible Conditions</CardTitle>
          <CardDescription>
            Based on your symptoms, these conditions may be relevant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.conditions.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
              No specific conditions detected. Try adding more detail, such as
              duration, severity, or appearance.
            </div>
          ) : (
            result.conditions.map((condition, index) => (
              <div key={index} className="space-y-1 rounded-lg border p-4">
                <h4 className="text-lg font-semibold">{condition.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {condition.description}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Medical Guidance */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Medical Guidance</CardTitle>
          <CardDescription>
            Professional-style recommendations from the AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.guidance.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
                No specific guidance returned. If your symptoms persist or
                worsen, please consult a healthcare professional.
              </div>
            ) : (
              result.guidance.map((guide, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg bg-muted/50 p-4"
                >
                  <Info className="mt-0.5 h-5 w-5 text-primary flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="font-medium">{guide.message}</p>
                    {guide.reason && (
                      <p className="text-sm text-muted-foreground">
                        {guide.reason}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* High Risk Alert */}
      {String(result.risk_level).toLowerCase() === "high" && (
        <Alert className="rounded-2xl border-rose-500/20 bg-rose-500/10">
          <AlertTriangle className="h-4 w-4 text-rose-600" />
          <AlertDescription className="text-rose-700 dark:text-rose-300">
            <strong>High Risk Symptoms Detected:</strong> Based on your
            description, we strongly recommend seeking prompt medical attention.
            This analysis is informative and does not replace professional
            advice.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Hospital className="h-5 w-5" />
              Find Specialists
            </CardTitle>
            <CardDescription>Connect with verified providers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Explore our trusted network for professional consultation and
              follow-up care.
            </p>
            <Button asChild className="w-full rounded-xl">
              <Link href="/clinics">View Trusted Clinics</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Community Support
            </CardTitle>
            <CardDescription>Share and learn with others</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Browse posts from the community, discover shared experiences, and
              help raise awareness.
            </p>
            <Button
              asChild
              variant="outline"
              className="w-full rounded-xl bg-transparent"
            >
              <Link href="/community">Go to Community</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
