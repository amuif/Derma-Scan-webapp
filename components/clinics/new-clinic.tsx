"use client";

import type React from "react";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2 } from "lucide-react";
import { useClinicCreation } from "@/hooks/useClinic";
import { toast } from "sonner";

interface CreateClinicDialogProps {
  setCreationCompleted: React.Dispatch<React.SetStateAction<boolean>>;
}

type FormState = {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
};

const initialForm: FormState = {
  name: "",
  address: "",
  phone: "",
  email: "",
  website: "",
};

// very lightweight validators (no URL constructor to avoid env issues)
const isEmail = (v: string) =>
  !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const isPhone = (v: string) => !!v && /^[\d\s\-()+]{7,}$/.test(v.trim());

const looksLikeUrl = (v: string) =>
  !!v && /^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(v.trim());

function ensureHttps(v: string) {
  const t = v.trim();
  if (!t) return t;
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

export function CreateClinicDialog({
  setCreationCompleted,
}: CreateClinicDialogProps) {
  const { mutateAsync: createClinic } = useClinicCreation();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormState>(initialForm);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specInput, setSpecInput] = useState("");

  const specSet = useMemo(
    () => new Set(specialties.map((s) => s.toLowerCase())),
    [specialties],
  );

  const addSpecialty = useCallback(() => {
    const raw = specInput.trim();
    if (!raw) return;
    const key = raw.toLowerCase();
    if (specSet.has(key)) {
      setSpecInput("");
      return;
    }
    setSpecialties((prev) => [...prev, raw]);
    setSpecInput("");
  }, [specInput, specSet]);

  const removeSpecialty = useCallback((s: string) => {
    setSpecialties((prev) => prev.filter((x) => x !== s));
  }, []);

  const onSpecKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSpecialty();
    } else if (e.key === "Backspace" && !specInput) {
      setSpecialties((prev) => prev.slice(0, -1));
    }
  };

  const setField =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const submitDisabled =
    loading ||
    !form.name.trim() ||
    !form.address.trim() ||
    specialties.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitDisabled) return;

    // basic validation (non-blocking, but informs the user)
    if (form.email && !isEmail(form.email)) {
      toast.error("Email looks invalid.");
      return;
    }
    if (form.phone && !isPhone(form.phone)) {
      toast.error("Phone looks invalid.");
      return;
    }
    if (form.website && !looksLikeUrl(form.website)) {
      toast.error("Website looks invalid.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        website: form.website ? ensureHttps(form.website) : "",
        email: form.email.trim(),
        address: form.address.trim(),
        status: "PENDING" as const,
        specialties,
      };

      await createClinic(payload);

      toast.success(
        "Clinic submitted for review. It will appear after admin verification.",
      );
      setCreationCompleted(true);

      // reset
      setForm(initialForm);
      setSpecialties([]);
      setSpecInput("");
      setOpen(false);
    } catch (err) {
      console.error("Error creating clinic:", err);
      toast.error("Could not submit the clinic. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !loading && setOpen(v)}>
      <DialogTrigger asChild>
        <Button aria-label="Refer a new clinic">
          <Plus className="mr-2 h-4 w-4" />
          Refer New Clinic
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Refer a New Clinic</DialogTitle>
          <DialogDescription>
            Add a dermatology clinic or healthcare provider to our directory.
            Submissions are reviewed before publishing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="clinic-name">
              Clinic Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="clinic-name"
              placeholder="Advanced Dermatology Center"
              value={form.name}
              onChange={setField("name")}
              required
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="clinic-address">
              Address <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="clinic-address"
              placeholder="123 Medical Plaza, City, State, ZIP"
              value={form.address}
              onChange={setField("address")}
              rows={3}
              required
            />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clinic-phone">Phone Number</Label>
              <Input
                id="clinic-phone"
                type="tel"
                inputMode="tel"
                placeholder="(415) 555-0123"
                value={form.phone}
                onChange={setField("phone")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinic-email">Email</Label>
              <Input
                id="clinic-email"
                type="email"
                inputMode="email"
                placeholder="contact@clinic.com"
                value={form.email}
                onChange={setField("email")}
              />
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="clinic-website">Website</Label>
            <Input
              id="clinic-website"
              type="url"
              inputMode="url"
              placeholder="https://www.clinic.com"
              value={form.website}
              onChange={setField("website")}
            />
            {form.website && (
              <p className="text-xs text-muted-foreground">
                Will be saved as{" "}
                <span className="font-medium">{ensureHttps(form.website)}</span>
              </p>
            )}
          </div>

          {/* Specialties */}
          <div className="space-y-2">
            <Label htmlFor="clinic-specialty">
              Specialties <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="clinic-specialty"
                placeholder="e.g., Acne Treatment, Skin Cancer"
                value={specInput}
                onChange={(e) => setSpecInput(e.target.value)}
                onKeyDown={onSpecKeyDown}
              />
              <Button type="button" onClick={addSpecialty}>
                Add
              </Button>
            </div>

            {specialties.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {specialties.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1">
                    {s}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(s)}
                      className="ml-1 rounded p-0.5 hover:text-destructive"
                      aria-label={`Remove ${s}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Add at least one specialty.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitDisabled}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit for Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
