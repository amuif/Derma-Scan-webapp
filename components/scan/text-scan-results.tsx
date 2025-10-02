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
import {
  AlertTriangle,
  CheckCircle,
  Info,
  Scan,
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

export function TextScanResults({
  result,
  onNewScan,
  onShareScan,
  isAnalyzing,
}: TextScanResultsProps) {
  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
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
    switch (risk.toLowerCase()) {
      case "low":
        return CheckCircle;
      case "medium":
        return Info;
      case "high":
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const RiskIcon = getRiskIcon(result.risk_level);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Symptom Analysis Results</h2>
          <p className="text-muted-foreground">
            AI-powered symptom assessment based on your description
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={onShareScan} disabled={isAnalyzing}>
            Share with community
          </Button>
          <Button onClick={onNewScan} variant="outline">
            <Scan className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
        </div>
      </div>
      {/* Medical Guidance */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Guidance</CardTitle>
          <CardDescription>
            Professional recommendations based on your symptoms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.guidance.map((guide, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg"
              >
                <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-medium">{guide.message}</p>
                  <p className="text-sm text-muted-foreground">
                    {guide.reason}
                  </p>{" "}
                </div>
              </div>
            ))}{" "}
          </div>
        </CardContent>
      </Card>

      {/* Risk Level Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
            <Badge className={getRiskColor(result?.risk_level)}>
              <RiskIcon className="mr-1 h-3 w-3" />
              {result.risk_level.toUpperCase()} RISK
            </Badge>
          </div>
          <CardDescription>
            Based on your symptom description, here&apos;s our AI assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Confidence Score</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(result.confidence * 100)}%
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${result.confidence * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Possible Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Possible Conditions</CardTitle>
          <CardDescription>
            Based on your symptoms, these conditions may be relevant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.conditions.map((condition, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-lg">{condition.name}</h4>
              <p className="text-sm text-muted-foreground">
                {condition.description}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* High Risk Alert */}
      {result.risk_level.toLowerCase() === "high" && (
        <Alert className="border-red-500/20 bg-red-500/5">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700 dark:text-red-300">
            <strong>High Risk Symptoms Detected:</strong> Based on your
            description, we strongly recommend seeking immediate medical
            attention. This analysis is for informational purposes only and
            should not replace professional medical advice.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Hospital className="h-5 w-5" />
              Find Specialists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Connect with verified dermatologists in our trusted network for
              professional consultation.
            </p>
            <Button asChild className="w-full">
              <Link href="/clinics">View Trusted Clinics</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Community Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Browse posts from the community, discover shared experiences, and
              connect with others who understand your journey.
            </p>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/community">Goto Community</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Medical Disclaimer */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Medical Disclaimer:</strong> This AI analysis is for
          informational purposes only and should not be used as a substitute for
          professional medical advice, diagnosis, or treatment. Always consult
          with a qualified healthcare provider for proper medical evaluation.
        </AlertDescription>
      </Alert>
    </div>
  );
}
