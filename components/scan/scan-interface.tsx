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

import Image from "next/image";
import {
  Upload,
  FileImage,
  Scan,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import { ScanResults } from "./scan-results";
import { ImageValidation } from "@/lib/check-image-quality";
import { useImageUploadMutation } from "@/hooks/useAuth";

interface AnalysisResult {
  condition: string;
  confidence: number;
  riskLevel: "low" | "medium" | "high";
  description: string;
  recommendations: string[];
}

export function ScanInterface() {
  const { mutateAsync: UploadImage } = useImageUploadMutation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [imageQuality, setImageQuality] = useState<"good" | "poor" | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        setImageFile(file);
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          ImageValidation(file);
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
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        ImageValidation(file);
        setSelectedImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setResults(null);
    if (!imageFile) return;
    try {
      const response = await UploadImage({ imageFile, symptoms });
      console.log(response);
      setResults(response);
    } catch (error) {
      console.error("Error uploading image ", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getQualityMessage = (quality: string) => {
    switch (quality) {
      case "good":
        return {
          message: "Excellent image quality for analysis",
          icon: CheckCircle,
          color: "text-green-500",
        };
      case "fair":
        return {
          message: "Good quality - analysis possible",
          icon: Info,
          color: "text-yellow-500",
        };
      case "poor":
        return {
          message: "Poor quality - consider retaking photo",
          icon: AlertCircle,
          color: "text-red-500",
        };
      default:
        return { message: "", icon: Info, color: "text-muted-foreground" };
    }
  };

  if (results) {
    return (
      <ScanResults
        result={results}
        onNewScan={() => {
          setResults(null);
          setSelectedImage(null);
          setSymptoms("");
          setImageQuality(null);
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
                Upload a clear, well-lit photo of the affected skin area for AI
                analysis.
              </CardDescription>
              <div className="flex justify-end items-end"></div>
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
                    {imageQuality && (
                      <div className="flex items-center justify-center gap-2">
                        {(() => {
                          const {
                            message,
                            icon: Icon,
                            color,
                          } = getQualityMessage(imageQuality);
                          return (
                            <>
                              <Icon className={`h-4 w-4 ${color}`} />
                              <span className={`text-sm ${color}`}>
                                {message}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    )}
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
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div>
                      <p className="text-lg font-medium">
                        Drop your image here or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports JPG, PNG, WebP up to 10MB
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
                <Label htmlFor="symptoms">Symptom Description</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe your symptoms in detail... (e.g., red, itchy patches on arms that appeared 3 days ago, mild pain when touched)"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="min-h-32"
                />
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
                <Scan className="h-5 w-5 animate-spin text-primary" />
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
          disabled={(!selectedImage && !symptoms.trim()) || isAnalyzing}
          className="px-8"
        >
          {isAnalyzing ? (
            <>
              <Scan className="mr-2 h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Scan className="mr-2 h-5 w-5" />
              Start Analysis
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
