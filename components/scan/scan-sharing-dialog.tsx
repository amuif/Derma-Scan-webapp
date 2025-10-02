"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Shield, Users, Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ScanSharingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (shareConsent: boolean) => void;
}

export function ScanSharingDialog({
  open,
  onOpenChange,
  onConfirm,
}: ScanSharingDialogProps) {
  const [shareConsent, setShareConsent] = useState(false);
  const [understood, setUnderstood] = useState(false);

  const handleConfirm = () => {
    onConfirm(shareConsent);
    onOpenChange(false);
    // Reset state
    setShareConsent(false);
    setUnderstood(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Scan Data Sharing Consent
          </DialogTitle>
          <DialogDescription>
            Help improve our AI model by sharing your scan data anonymously with
            our research team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your privacy is our priority. All shared data is anonymized and
              used solely for improving diagnostic accuracy.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Users className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Community Benefit</h4>
                <p className="text-sm text-muted-foreground">
                  Your contribution helps train our AI to better detect skin
                  conditions for everyone.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <Lock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Data Protection</h4>
                <p className="text-sm text-muted-foreground">
                  All personal identifiers are removed. Your data is encrypted
                  and stored securely.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="share"
                checked={shareConsent}
                onCheckedChange={(checked) => setShareConsent(!!checked)}
              />
              <Label
                htmlFor="share"
                className="text-sm font-normal leading-relaxed cursor-pointer"
              >
                I consent to sharing my scan data anonymously for research and
                AI improvement purposes.
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="understood"
                checked={understood}
                onCheckedChange={(checked) => setUnderstood(!!checked)}
              />
              <Label
                htmlFor="understood"
                className="text-sm font-normal leading-relaxed cursor-pointer"
              >
                I understand that I can change my data sharing preferences at
                any time in my profile settings.
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!understood}>
            Continue with Scan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
