"use client";

import { authStorage } from "@/lib/auth";
import { clinicApi } from "@/lib/clinic";
import { Clinic, CreateClinic } from "@/types/clinic";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useClinicCreation = () => {
  return useMutation({
    mutationFn: async ({
      name,
      phone,
      address,
      email,
      website,
      status,
      specialties,
    }: CreateClinic) => {
      const token = await authStorage.getToken();
      if (!token) return;
      return clinicApi.createClinic({
        name,
        phone,
        address,
        email,
        website,
        specialties,
        status,
        token,
      });
    },
  });
};
export const useFindClinic = () => {
  return useQuery({
    queryKey: ["get-allowed-clinics"],
    queryFn: async () => {
      const token = await authStorage.getToken();
      if (!token) return;
      return clinicApi.getAllowedClinics(token);
    },
  });
};
export const useFindAllClinic = () => {
  return useQuery({
    queryKey: ["get-allowed-clinics"],
    queryFn: async () => {
      const token = await authStorage.getToken();
      if (!token) return;
      return clinicApi.getAllClinics(token);
    },
  });
};
export const useUpdateClinic = () => {
  return useMutation({
    mutationFn: async ({ status, id }: Partial<Clinic>) => {
      const token = await authStorage.getToken();
      if (!token || !id) return;
      return clinicApi.updateClinic({ id, token, status });
    },
    onSuccess: () => {
      toast.success("Successfully updated clinic");
    },
    onError: () => {
      toast.error("Error updated clinic");
    },
  });
};
export const useDeleteClinic = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await authStorage.getToken();
      if (!token) return;
      return clinicApi.deleteClinic(id, token);
    },
    onSuccess: () => {
      toast.success("Successfully deleted clinic");
    },
    onError: () => {
      toast.error("Error deleting clinic");
    },
  });
};
