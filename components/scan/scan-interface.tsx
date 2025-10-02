"use client";

import type React from "react";

import { useState, useRef, useCallback } from "react";
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
import Image from "next/image";
import {
  Upload,
  FileImage,
  Scan as ScanIcon,
  Info,
  CircleCheckBig,
  CircleX,
  LoaderCircle,
} from "lucide-react";
import { ScanResults } from "./scan-results";
import { ImageValidation } from "@/lib/check-image-quality";
import { Scan } from "@/types/scan";
import {
  useCheckImage,
  useImageUploadMutation,
  useTextScan,
} from "@/hooks/useScan";
import { TextAnalysisResult, TextScanResults } from "./text-scan-results";

export function ScanInterface() {
  const { mutateAsync: UploadImage } = useImageUploadMutation();
  const { mutateAsync: UploadText } = useTextScan();
  const { mutateAsync: checkImage } = useCheckImage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isSkin, setIsSkin] = useState<boolean | null>(null);
  const [results, setResults] = useState<Scan | null>(null);
  const [textResults, setTextResults] = useState<TextAnalysisResult | null>(
    null,
  );
  const [imageQuality, setImageQuality] = useState<"Good" | "Poor" | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const options = {
    maxSizeMB: 4,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const compressedFile = await imageCompression(file, options);
          setImageFile(compressedFile);
          const imageUrl = e.target?.result as string;
          const quality = await ImageValidation(compressedFile);
          setImageQuality(quality || "Good");
          const checkedImage = await checkImage(compressedFile);
          if (
            checkedImage?.message === "No skin condition detected." ||
            checkedImage?.conditions.length === 0
          ) {
            setIsSkin(false);
          } else {
            setIsSkin(true);
          }
          setSelectedImage(imageUrl);
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setImageFile(file);

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const compressedFile = await imageCompression(file, options);
        setImageFile(compressedFile);
        const imageUrl = e.target?.result as string;
        const quality = await ImageValidation(compressedFile);
        setImageQuality(quality || "Good");
        const checkedImage = await checkImage(compressedFile);
        if (
          checkedImage?.message === "No skin condition detected." ||
          checkedImage?.conditions.length === 0
        ) {
          setIsSkin(false);
        } else {
          setIsSkin(true);
        }

        setSelectedImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setResults(null);
    try {
      if (!imageFile) {
        const response = await UploadText({ symptoms, consent: "false" });
        console.log("Analysis property type:", typeof response.analysis);

        const { conditions, risk_level, confidence, guidance } =
          response.analysis;
        const mappedResult: TextAnalysisResult = {
          conditions:
            conditions?.map((c: string) => ({
              name: c,
              description: "",
            })) || [], // Fallback to empty array
          risk_level: risk_level || "Unknown",
          confidence: confidence || 0,
          guidance: [
            {
              message: guidance || "No specific guidance available",
              reason: "",
            },
          ],
        };

        console.log("Mapped result:", mappedResult);
        setTextResults(mappedResult);
      } else {
        const response: Scan = await UploadImage({
          imageFile,
          symptoms,
          consent: "false",
        });
        console.log(response);
        setResults(response);
      }
    } catch (error) {
      console.error("Error uploading image ", error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  const shareWithCommunity = async () => {
    setIsAnalyzing(true);

    try {
      if (textResults || !imageFile) {
        const response = await UploadText({ symptoms, consent: "true" });
        console.log("Shared with community text upload:", response);
      } else if (results) {
        // We already have image results, just share them
        const response: Scan = await UploadImage({
          imageFile,
          symptoms,
          consent: "true",
        });
        console.log("Shared with community:", response);
      }
    } catch (error) {
      console.error("Error sharing with community:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (results) {
    return (
      <ScanResults
        result={results as Scan}
        onShareScan={shareWithCommunity}
        isAnalyzing={isAnalyzing}
        onNewScan={() => {
          setResults(null);
          setSelectedImage(null);
          setTextResults(null);
          setSymptoms("");
          setImageFile(null);
          setImageQuality(null);
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
        onShareScan={shareWithCommunity}
        onNewScan={() => {
          setTextResults(null);
          setResults(null);
          setSelectedImage(null);
          setSymptoms("");
          setImageQuality(null);
          setImageFile(null);
          setAnalysisProgress(0);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="image" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="image">Image Upload</TabsTrigger>
          <TabsTrigger value="symptoms">Describe Symptoms</TabsTrigger>
        </TabsList>

        <TabsContent value="image" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Upload Skin Image
              </CardTitle>
              <CardDescription>
                <div className="flex justify-between ">
                  <span>
                    {" "}
                    Upload a clear, well-lit photo of the affected skin area for
                    AI analysis.
                  </span>

                  <div className="flex justify-end items-end">
                    {imageQuality && (
                      <>
                        {console.log(imageQuality)}
                        {imageQuality === "Good" ? (
                          <CircleCheckBig className="h-6 w-6 pr-2 text-green-500" />
                        ) : (
                          <CircleX className="h-6 w-4 text-red-500" />
                        )}
                        <span className="flex gap-3">
                          {imageQuality} quality
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedImage ? (
                  <div className="space-y-4">
                    <Image
                      src={selectedImage || "/placeholder.svg"}
                      alt="Uploaded skin image"
                      className="mx-auto max-h-64 rounded-lg object-cover"
                      width={500}
                      height={500}
                    />
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(null);
                        setImageQuality(null);
                      }}
                    >
                      Remove Image
                    </Button>
                    <div>
                      {isSkin === null && (
                        <span>
                          <LoaderCircle className="animate-spin" />
                          Processing....
                        </span>
                      )}
                      {isSkin === false && (
                        <span className="text-destructive">
                          No skin detected try to upload a different image.
                        </span>
                      )}
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
                        Supports JPG, PNG, WebP up to 5MB
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

          {selectedImage && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Image Quality Tips:</strong> Ensure good lighting, avoid
                shadows, keep the camera steady, and capture the affected area
                clearly for best analysis results.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="symptoms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Describe Your Symptoms</CardTitle>
              <CardDescription>
                Provide detailed information about your skin condition,
                including symptoms like pain, redness, itching, etc.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="symptoms" className="pb-3">
                  Symptom Description
                </Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe your symptoms in detail... (e.g., red, itchy patches on arms that appeared 3 days ago, mild pain when touched)"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="min-h-32"
                />
                <Label className="py-2">
                  minimum amount of allowed characters are 10,your current
                  characters are {symptoms.length}
                </Label>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Redness</Badge>
                <Badge variant="secondary">Itching</Badge>
                <Badge variant="secondary">Pain</Badge>
                <Badge variant="secondary">Swelling</Badge>
                <Badge variant="secondary">Dry skin</Badge>
                <Badge variant="secondary">Bumps</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ScanIcon className="h-5 w-5 animate-spin text-primary" />
                <span className="font-medium">Analyzing with AI...</span>
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

      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={simulateAnalysis}
          disabled={
            (!selectedImage && !symptoms.trim()) ||
            (!imageFile && symptoms.length < 10) ||
            (imageFile && !isSkin) ||
            isAnalyzing
          }
          className="px-8"
        >
          {isAnalyzing ? (
            <>
              <ScanIcon className="mr-2 h-5 w-5 animate-spin" />
              Analyzing...
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
