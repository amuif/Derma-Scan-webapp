"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, CheckCircle, Info, Scan, Hospital, Users } from "lucide-react"
import Link from "next/link"

interface AnalysisResult {
  condition: string
  confidence: number
  riskLevel: "low" | "medium" | "high"
  description: string
  recommendations: string[]
}

interface ScanResultsProps {
  result: AnalysisResult
  onNewScan: () => void
}

export function ScanResults({ result, onNewScan }: ScanResultsProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "low":
        return CheckCircle
      case "medium":
        return Info
      case "high":
        return AlertTriangle
      default:
        return Info
    }
  }

  const RiskIcon = getRiskIcon(result.riskLevel)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analysis Results</h2>
          <p className="text-muted-foreground">AI-powered skin condition analysis</p>
        </div>
        <Button onClick={onNewScan} variant="outline">
          <Scan className="mr-2 h-4 w-4" />
          New Scan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{result.condition}</CardTitle>
            <Badge className={getRiskColor(result.riskLevel)}>
              <RiskIcon className="mr-1 h-3 w-3" />
              {result.riskLevel.toUpperCase()} RISK
            </Badge>
          </div>
          <CardDescription>{result.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Confidence Score</span>
              <span className="text-sm text-muted-foreground">{result.confidence}%</span>
            </div>
            <Progress value={result.confidence} className="h-2" />
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3">Recommendations</h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {result.riskLevel === "high" && (
        <Alert className="border-red-500/20 bg-red-500/5">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700 dark:text-red-300">
            <strong>High Risk Condition Detected:</strong> We strongly recommend consulting with a dermatologist as soon
            as possible. This analysis is for informational purposes only and should not replace professional medical
            advice.
          </AlertDescription>
        </Alert>
      )}

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
              Connect with verified dermatologists in our trusted network for professional consultation.
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
              Share your experience and get support from others with similar conditions.
            </p>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/community">Join Community</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Medical Disclaimer:</strong> This AI analysis is for informational purposes only and should not be
          used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified
          healthcare provider for proper medical evaluation.
        </AlertDescription>
      </Alert>
    </div>
  )
}
