"use client";

import type React from "react";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";

import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

import imageCompression from "browser-image-compression";

import {
  Upload,
  FileImage,
  Scan as ScanIcon,
  Info,
  CircleCheckBig,
  CircleX,
  LoaderCircle,
  Shield,
  Sparkles,
  X,
} from "lucide-react";

import { ScanResults } from "./scan-results";
import { ImageValidation } from "@/lib/check-image-quality";
import { Scan } from "@/types/scan";
import {
  useApproveScan,
  useCheckImage,
  useImageUploadMutation,
  useTextScan,
} from "@/hooks/useScan";
import { TextAnalysisResult, TextScanResults } from "./text-scan-results";

/* ----------------------------- helpers ----------------------------- */

function clsx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const QUALITY_COLORS: Record<"Good" | "Poor", string> = {
  Good: "text-emerald-600 bg-emerald-500/10 border-emerald-400/30",
  Poor: "text-rose-600 bg-rose-500/10 border-rose-400/30",
};

const SYMPTOM_PRESETS = [
  "Redness",
  "Itching",
  "Pain",
  "Swelling",
  "Dry skin",
  "Bumps",
  "Crusting",
  "Bleeding",
  "Scaling",
];

/* ----------------------------- component ----------------------------- */

export function ScanInterface() {
  const { mutateAsync: UploadImage } = useImageUploadMutation();
  const { mutateAsync: UploadText } = useTextScan();
  const { mutateAsync: checkImage } = useCheckImage();
  const { mutateAsync: approveScan } = useApproveScan();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const [isSkin, setIsSkin] = useState<boolean | null>(null);
  const [imageQuality, setImageQuality] = useState<"Good" | "Poor" | null>(
    null,
  );

  const [results, setResults] = useState<Scan | null>(null);
  const [textResults, setTextResults] = useState<TextAnalysisResult | null>(
    null,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressionOptions = useMemo(
    () => ({ maxSizeMB: 4, maxWidthOrHeight: 1920, useWebWorker: true }),
    [],
  );

  /* -------- Progress animation while analyzing (just UX sugar) -------- */
  useEffect(() => {
    if (!isAnalyzing) return;
    setAnalysisProgress(12);
    const id = setInterval(() => {
      setAnalysisProgress((p) => (p < 92 ? p + Math.random() * 7 : p));
    }, 400);
    return () => clearInterval(id);
  }, [isAnalyzing]);

  /* ----------------------------- handlers ----------------------------- */

  const processAndPreview = useCallback(
    async (file: File) => {
      try {
        const compressedFile = await imageCompression(file, compressionOptions);
        setImageFile(compressedFile);

        // preview
        const reader = new FileReader();
        reader.onload = async (e) => {
          const imageUrl = (e.target?.result as string) ?? null;
          setSelectedImage(imageUrl);

          // quality & skin detection
          const quality = await ImageValidation(compressedFile);
          setImageQuality((quality as "Good" | "Poor") || "Good");

          const checked = await checkImage(compressedFile);
          const nothingFound =
            checked?.message === "No skin condition detected" ||
            checked?.conditions?.length === 0;

          setIsSkin(!nothingFound);
        };
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        console.error("Image process error:", err);
        toast.error("Could not process image. Try a different photo.");
      }
    },
    [checkImage, compressionOptions],
  );

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }
      void processAndPreview(file);
    },
    [processAndPreview],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast.error("Please drop an image file.");
        return;
      }
      void processAndPreview(file);
    },
    [processAndPreview],
  );

  const clearImage = useCallback(() => {
    setSelectedImage(null);
    setImageFile(null);
    setIsSkin(null);
    setImageQuality(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setResults(null);
    setTextResults(null);

    try {
      if (!imageFile) {
        // TEXT ANALYSIS
        const response = await UploadText({ symptoms, consent: "false" });
        const { id } = response;
        const { conditions, risk_level, confidence, guidance } =
          response.analysis;

        const mapped: TextAnalysisResult = {
          id,
          conditions:
            conditions?.map((c: string) => ({ name: c, description: "" })) ??
            [],
          risk_level: risk_level || "Unknown",
          confidence: confidence || 0,
          guidance: [
            {
              message: guidance || "No specific guidance available",
              reason: "",
            },
          ],
        };

        setTextResults(mapped);
      } else {
        // IMAGE ANALYSIS
        const response: Scan = await UploadImage({
          imageFile,
          symptoms,
          consent: "false",
        });
        setResults(response);
      }
      setAnalysisProgress(100);
    } catch (error) {
      console.error("Error analyzing:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  /* --------------------------- share handlers -------------------------- */
  const shareFromImage = async (scan: Scan) => {
    try {
      await approveScan({ scanId: scan.id });
      toast.success("Shared successfully");
    } catch {
      toast.error("Share failed. Please try again.");
    }
  };

  const shareFromText = async (res: TextAnalysisResult) => {
    try {
      await approveScan({ scanId: res.id });
      toast.success("Shared successfully");
    } catch {
      toast.error("Share failed. Please try again.");
    }
  };

  /* --------------------------- results routing -------------------------- */
  if (results) {
    return (
      <ScanResults
        result={results}
        onShareScan={() => shareFromImage(results)}
        isAnalyzing={isAnalyzing}
        onNewScan={() => {
          setResults(null);
          setSelectedImage(null);
          setTextResults(null);
          setSymptoms("");
          setImageFile(null);
          setImageQuality(null);
          setIsSkin(null);
          setAnalysisProgress(0);
        }}
      />
    );
  }

  if (textResults) {
    return (
      <TextScanResults
        result={textResults}
        isAnalyzing={isAnalyzing}
        onShareScan={() => shareFromText(textResults)}
        onNewScan={() => {
          setTextResults(null);
          setResults(null);
          setSelectedImage(null);
          setSymptoms("");
          setImageQuality(null);
          setImageFile(null);
          setIsSkin(null);
          setAnalysisProgress(0);
        }}
      />
    );
  }

  /* ------------------------------- UI ------------------------------- */
  const canAnalyze =
    (!!selectedImage || symptoms.trim().length >= 10) &&
    (!imageFile || isSkin !== false) &&
    !isAnalyzing;

  return (
    <div className="space-y-8">
      {/* Top header / hero-ish strip */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(60%_70%_at_50%_40%,#000_40%,transparent_100%)]"
        >
          <svg className="absolute inset-0 h-full w-full">
            <defs>
              <pattern
                id="grid-scan"
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
              fill="url(#grid-scan)"
              className="text-foreground/20"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border bg-background/80 p-2 backdrop-blur">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold md:text-2xl tracking-tight">
                Advanced skin condition detection with{" "}
                <span className="text-primary">AI precision</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                Upload a clear photo or describe symptoms. Get risk, AI
                confidence, and guidance.
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4" />
            Privacy-first scanning
          </div>
        </div>
      </section>

      <Tabs defaultValue="image" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="image">Image Upload</TabsTrigger>
          <TabsTrigger value="symptoms">Describe Symptoms</TabsTrigger>
        </TabsList>

        {/* ======================= IMAGE TAB ======================= */}
        <TabsContent value="image" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Dropzone / preview */}
            <Card className="lg:col-span-2 rounded-2xl border-border/60 bg-background/70 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  Upload Skin Image
                </CardTitle>
                <CardDescription>
                  Drop a clear, well-lit photo of the affected area for AI
                  analysis.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      fileInputRef.current?.click();
                  }}
                  className={clsx(
                    "relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
                    "bg-gradient-to-br from-background to-background/60 hover:border-primary/50",
                    selectedImage ? "border-border" : "border-border/70",
                  )}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {/* Glow ring */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl opacity-30 blur-2xl"
                  />

                  {selectedImage ? (
                    <div className="mx-auto max-w-[640px] space-y-4">
                      <div className="relative mx-auto h-64 w-full overflow-hidden rounded-xl border bg-background/70">
                        <Image
                          src={selectedImage}
                          alt="Uploaded skin image"
                          fill
                          sizes="512px"
                          className="object-cover"
                          priority={false}
                        />
                        <button
                          type="button"
                          aria-label="Remove image"
                          className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full border bg-background/90 px-2 py-1 text-xs shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearImage();
                          }}
                        >
                          <X className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Click the image area to replace with a different photo.
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                        <Badge variant="outline" className="rounded-full">
                          {imageFile
                            ? (imageFile.size / 1024 / 1024).toFixed(1)
                            : "0.0"}{" "}
                          MB
                        </Badge>
                        <Badge variant="outline" className="rounded-full">
                          {imageFile?.type ?? "image/*"}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium">
                          Drop your image here or click to browse
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supports JPG, PNG up to ~5MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Right side: live checks */}
            <div className="space-y-6">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-base">Pre-check</CardTitle>
                  <CardDescription>
                    Image quality & skin detection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between rounded-xl border p-3">
                      <div className="flex items-center gap-2">
                        {imageQuality ? (
                          imageQuality === "Good" ? (
                            <CircleCheckBig className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <CircleX className="h-5 w-5 text-rose-600" />
                          )
                        ) : (
                          <LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium">
                          Image Quality
                        </span>
                      </div>
                      <span
                        className={clsx(
                          "rounded-full border px-3 py-1 text-xs",
                          imageQuality
                            ? QUALITY_COLORS[imageQuality]
                            : "text-muted-foreground border-border",
                        )}
                      >
                        {imageQuality ?? "Checking…"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border p-3">
                      <div className="flex items-center gap-2">
                        {isSkin === null ? (
                          <LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" />
                        ) : isSkin ? (
                          <CircleCheckBig className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <CircleX className="h-5 w-5 text-rose-600" />
                        )}
                        <span className="text-sm font-medium">
                          Skin Detected
                        </span>
                      </div>
                      <span className="rounded-full border px-3 py-1 text-xs">
                        {isSkin === null ? "Checking…" : isSkin ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>

                  {selectedImage && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Ensure good lighting, avoid shadows, keep the camera
                        steady, and capture the affected area clearly for best
                        results.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ======================= TEXT TAB ======================= */}
        <TabsContent value="symptoms" className="space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Describe Your Symptoms</CardTitle>
              <CardDescription>
                Provide details like duration, sensation, location, color
                changes, etc.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="symptoms">Symptom Description</Label>
                <Textarea
                  id="symptoms"
                  placeholder="e.g., red, itchy patches on arms that appeared 3 days ago; mild pain when touched…"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="min-h-32"
                />
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">
                    Min 10 characters • current: {symptoms.length}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {SYMPTOM_PRESETS.map((chip) => (
                      <Badge
                        key={chip}
                        variant="secondary"
                        className="cursor-pointer select-none"
                        onClick={() =>
                          setSymptoms((s) =>
                            s.includes(chip) ? s : (s ? s + ", " : s) + chip,
                          )
                        }
                      >
                        {chip}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ======================= Analyzing state ======================= */}
      {isAnalyzing && (
        <Card className="rounded-2xl">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ScanIcon className="h-5 w-5 animate-spin text-primary" />
                <span className="font-medium">Analyzing with AI…</span>
              </div>
              <Progress value={analysisProgress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Our AI is examining the image and processing your information.
                This may take a few moments.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ======================= CTA ======================= */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={simulateAnalysis}
          disabled={
            !canAnalyze ||
            (!!imageFile && isSkin === false) ||
            (!!imageFile && imageQuality === "Poor") ||
            !!isAnalyzing
          }
          className="px-8 rounded-2xl"
        >
          {isAnalyzing ? (
            <>
              <ScanIcon className="mr-2 h-5 w-5 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <ScanIcon className="mr-2 h-5 w-5" />
              Start Analysis
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
