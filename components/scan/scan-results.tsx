"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Scan as ScanIcon,
  Hospital,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { Scan, ScanCondition } from "@/types/scan";

interface ScanResultsProps {
  result: Scan;
  onNewScan: () => void;
  onShareScan: (scanId: string) => void;
  isAnalyzing: boolean;
}

/* ---------- helpers ---------- */

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

/* --- safe type guards --- */
function isStringArray(arr: unknown[]): arr is string[] {
  return arr.every((x) => typeof x === "string");
}

function isScanConditionArray(arr: unknown[]): arr is ScanCondition[] {
  return arr.every(
    (x) =>
      typeof x === "object" &&
      x !== null &&
      ("condition" in (x as any) || "id" in (x as any)),
  );
}

function normalizeConditions(conds: Scan["conditions"]): string[] {
  if (!Array.isArray(conds) || conds.length === 0) return [];

  const arr = conds as unknown[];
  if (isStringArray(arr)) return arr.filter((s) => s.trim().length > 0);
  if (isScanConditionArray(arr))
    return arr
      .map(
        (c) =>
          (c as any)?.condition?.name ??
          (c as any)?.conditionName ??
          (typeof c === "string" ? c : undefined),
      )
      .filter((s): s is string => !!s && s.trim().length > 0);

  return [];
}

/* ---------- component ---------- */

export function ScanResults({
  result,
  onNewScan,
  onShareScan,
  isAnalyzing,
}: ScanResultsProps) {
  const RiskIcon = riskIcon(result.risk);
  const tone = riskTone(result.risk);
  const conditions = normalizeConditions(result.conditions);
  const confidencePct = Math.round((result.confidence ?? 0) * 100);

  return (
    <div className="space-y-8">
      {/* header ribbon */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 md:p-7">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(60%_70%_at_50%_40%,#000_40%,transparent_100%)]"
        >
          <svg className="absolute inset-0 h-full w-full">
            <defs>
              <pattern
                id="grid-res"
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
              fill="url(#grid-res)"
              className="text-foreground/20"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Analysis Results
            </h2>
            <p className="text-sm text-muted-foreground">
              AI-powered skin condition evaluation and guidance
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="default"
              onClick={() => onShareScan(result.id)}
              className="rounded-xl"
            >
              Share with community
            </Button>
            <Button
              onClick={onNewScan}
              variant="outline"
              disabled={isAnalyzing}
              className="rounded-xl"
            >
              <ScanIcon className="mr-2 h-4 w-4" />
              New Scan
            </Button>
          </div>
        </div>
      </section>

      {/* moved medical disclaimer BELOW header */}
      <Alert className="rounded-2xl">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Medical Disclaimer:</strong> This AI analysis is for
          informational purposes only and should not replace professional
          medical advice, diagnosis, or treatment. Always consult a qualified
          healthcare provider for proper evaluation.
        </AlertDescription>
      </Alert>

      {/* main analysis card */}
      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <CardTitle className="text-xl">
                {conditions.length > 0
                  ? conditions.join(", ")
                  : "No conditions detected"}
              </CardTitle>
              {result.notes && (
                <CardDescription className="mt-1">
                  {result.notes}
                </CardDescription>
              )}
            </div>

            <Badge
              variant="outline"
              className={cls(
                "flex items-center gap-1 rounded-full px-3 py-1",
                tone.chip,
              )}
            >
              <RiskIcon className="mr-1 h-3.5 w-3.5" />
              {String(result.risk || "unknown").toUpperCase()} RISK
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* confidence bar */}
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
              on the provided input.
            </p>
          </section>

          <Separator />

          {/* conditions list */}
          {conditions.length > 0 && (
            <section className="space-y-3">
              <h4 className="text-sm font-semibold">Detected conditions</h4>
              <div className="flex flex-wrap gap-2">
                {conditions.map((c, i) => (
                  <Badge key={c + i} variant="outline" className="rounded-full">
                    {c}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* next steps */}
          <section className="space-y-3">
            <h4 className="text-sm font-semibold">What to do next</h4>
            <ul className="space-y-2 text-sm">
              {String(result.risk).toLowerCase() === "high" ? (
                <>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-rose-500" />
                    Prioritize a visit with a dermatologist as soon as possible.
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="mt-0.5 h-4 w-4 text-amber-500" />
                    Avoid sun exposure on the affected area until evaluated.
                  </li>
                </>
              ) : String(result.risk).toLowerCase() === "medium" ? (
                <>
                  <li className="flex items-start gap-2">
                    <Info className="mt-0.5 h-4 w-4 text-amber-500" />
                    Consider scheduling a consultation to confirm and discuss
                    treatment.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-500" />
                    Monitor changes; if it evolves, seek medical attention
                    sooner.
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-500" />
                    Low risk detected. Keep monitoring and practice sun
                    protection.
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="mt-0.5 h-4 w-4 text-amber-500" />
                    If symptoms persist or worsen, consult a professional.
                  </li>
                </>
              )}
            </ul>
          </section>
        </CardContent>
      </Card>

      {/* high risk banner */}
      {String(result.risk).toLowerCase() === "high" && (
        <Alert className="rounded-2xl border-rose-500/20 bg-rose-500/10">
          <AlertTriangle className="h-4 w-4 text-rose-600" />
          <AlertDescription className="text-rose-700 dark:text-rose-300">
            <strong>High Risk Condition Detected:</strong> We strongly recommend
            consulting a dermatologist as soon as possible. This analysis is
            informative and does not replace professional medical advice.
          </AlertDescription>
        </Alert>
      )}

      {/* bottom CTAs */}
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
              Community
            </CardTitle>
            <CardDescription>Share and learn with others</CardDescription>
          </CardHeader>
          <CardFooter className="flex-col items-start justify-between">
            <p className="mb-4 text-sm text-muted-foreground">
              Browse posts, discover shared experiences, and help raise
              awareness.
            </p>
            <Button
              asChild
              variant="outline"
              className="w-full rounded-xl bg-transparent"
            >
              <Link href="/community">Go to Community</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
