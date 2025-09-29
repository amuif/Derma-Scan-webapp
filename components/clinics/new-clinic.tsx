"use client";

import type React from "react";

import { useState } from "react";
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
export function CreateClinicDialog({
  setCreationCompleted,
}: CreateClinicDialogProps) {
  const { mutateAsync: createClinic } = useClinicCreation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialtyInput, setSpecialtyInput] = useState("");

  const handleAddSpecialty = () => {
    if (specialtyInput.trim() && !specialties.includes(specialtyInput.trim())) {
      setSpecialties([...specialties, specialtyInput.trim()]);
      setSpecialtyInput("");
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter((s) => s !== specialty));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createClinic({
        name: formData.name,
        phone: formData.phone,
        website: formData.website,
        email: formData.email,
        address: formData.address,
        status: "PENDING",
        specialties: specialties,
      });
      console.log(response);
      toast.success(
        "Clinic have been added and it will be added after the admin verifies it",
      );
      setCreationCompleted(true);
      // Reset form
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        website: "",
      });
      setSpecialties([]);
      setOpen(false);
    } catch (error) {
      console.error("Error creating clinic:", error);
      toast.success(
        "Clinic have been added and it will be added after the admin verifies it",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Refer New Clinic
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl  overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Refer a New Clinic</DialogTitle>
          <DialogDescription>
            Add a new dermatology clinic or healthcare provider to our
            directory. All submissions will be reviewed before being published.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="space-y-2">
            <Label htmlFor="name">
              Clinic Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Advanced Dermatology Center"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              Address <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="address"
              placeholder="123 Medical Plaza, San Francisco, CA 94102"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(415) 555-0123"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@clinic.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://www.clinic.com"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialties">
              Specialties <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="specialties"
                placeholder="e.g., Acne Treatment, Skin Cancer"
                value={specialtyInput}
                onChange={(e) => setSpecialtyInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSpecialty();
                  }
                }}
              />
              <Button
                type="button"
                variant="default"
                onClick={handleAddSpecialty}
              >
                Add
              </Button>
            </div>
            {specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="gap-1">
                    {specialty}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialty(specialty)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {specialties.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Add at least one specialty
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
            <Button
              type="submit"
              disabled={
                loading ||
                !formData.name ||
                !formData.address ||
                specialties.length === 0
              }
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit for Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
