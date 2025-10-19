import { AppLayout } from "@/components/layout/app-layout";
import { ScanInterface } from "@/components/scan/scan-interface";

export default function ScanPage() {
  return (
    <AppLayout>
      {/* <div className="w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Skin Analysis Scanner</h1>
          <p className="text-muted-foreground text-lg">
            Upload an image or describe your symptoms for AI-powered skin
            condition analysis.
          </p>
        </div> */}
        <ScanInterface />
    </AppLayout>
  );
}
