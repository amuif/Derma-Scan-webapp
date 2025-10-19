"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Users, Lock, AlertCircle } from "lucide-react";

interface ScanSharingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (shareConsent: boolean) => void;
  /** Optional: show a loading/disabled state while you kick off the scan */
  isSubmitting?: boolean;
  /** Optional: link to your privacy policy */
  policyHref?: string;
}

export function ScanSharingDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting = false,
  policyHref = "/privacy",
}: ScanSharingDialogProps) {
  const [shareConsent, setShareConsent] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  // Reset local state whenever dialog closes
  useEffect(() => {
    if (!open) {
      setShareConsent(false);
      setAcknowledged(false);
    }
  }, [open]);

  const confirm = useCallback(
    (value: boolean) => {
      onConfirm(value);
      onOpenChange(false);
    },
    [onConfirm, onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[540px] rounded-2xl"
        aria-describedby="scan-sharing-desc"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" aria-hidden />
            Share your scan to improve our AI?
          </DialogTitle>
          <DialogDescription id="scan-sharing-desc">
            Help us improve detection accuracy by optionally sharing your scan
            data <strong>anonymously</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Alert className="rounded-xl">
            <AlertCircle className="h-4 w-4" aria-hidden />
            <AlertDescription>
              Your privacy is our priority. All shared data is anonymized and
              used solely to improve diagnostic accuracy. Review our{" "}
              <a
                href={policyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                Privacy Policy
              </a>
              .
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <Users className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
              <div>
                <h4 className="text-sm font-medium">Community benefit</h4>
                <p className="text-sm text-muted-foreground">
                  Your contribution helps train our AI to better detect skin
                  conditions for everyone.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-3">
              <Lock className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
              <div>
                <h4 className="text-sm font-medium">Data protection</h4>
                <p className="text-sm text-muted-foreground">
                  Personal identifiers are removed. Data is encrypted and stored
                  securely.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-2">
              <Checkbox
                id="share"
                checked={shareConsent}
                onCheckedChange={(checked) => setShareConsent(!!checked)}
                aria-describedby="share-desc"
              />
              <Label
                htmlFor="share"
                className="cursor-pointer text-sm font-normal leading-relaxed"
              >
                I consent to sharing my scan data anonymously for research and
                AI improvement.
              </Label>
            </div>
            <p id="share-desc" className="pl-7 text-xs text-muted-foreground">
              You can continue without sharing; your scan will still run.
            </p>

            <div className="flex items-start gap-2">
              <Checkbox
                id="ack"
                checked={acknowledged}
                onCheckedChange={(checked) => setAcknowledged(!!checked)}
                aria-describedby="ack-desc"
              />
              <Label
                htmlFor="ack"
                className="cursor-pointer text-sm font-normal leading-relaxed"
              >
                I understand I can change my data sharing preference later in
                profile settings.
              </Label>
            </div>
            <p id="ack-desc" className="pl-7 text-xs text-muted-foreground">
              Required to proceed.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-xl sm:w-auto"
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          {/* Continue without sharing */}
          <Button
            variant="secondary"
            onClick={() => confirm(false)}
            className="w-full rounded-xl sm:w-auto"
            disabled={!acknowledged || isSubmitting}
            aria-label="Continue without sharing"
          >
            {isSubmitting ? "Continuing..." : "Continue without Sharing"}
          </Button>

          {/* Share & continue */}
          <Button
            onClick={() => confirm(true)}
            className="w-full rounded-xl sm:w-auto"
            disabled={!acknowledged || isSubmitting}
            aria-label="Share and continue"
          >
            {isSubmitting ? "Submitting..." : "Share & Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
