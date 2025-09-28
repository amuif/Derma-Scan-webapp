"use client";

import { authStorage } from "@/lib/auth";
import { clinicApi } from "@/lib/clinic";
import { CreateClinic } from "@/types/clinic";
import { useMutation, useQuery } from "@tanstack/react-query";

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
    mutationFn: async (id: string) => {
      const token = await authStorage.getToken();
      if (!token) return;
      return clinicApi.deleteClinic(id, token);
    },
  });
};
