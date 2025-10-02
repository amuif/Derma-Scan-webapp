import { API_URL } from "@/constants/backend-url";
import {
  Clinic,
  CreateClinicPayload,
  UpdateClinicPayload,
} from "@/types/clinic";

export const clinicApi = {
  createClinic: async ({
    token,
    name,
    address,
    phone,
    email,
    website,
    status,
    specialties,
  }: CreateClinicPayload) => {
    try {
      const response = await fetch(`${API_URL}/clinics/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          address,
          phone,
          email,
          website,
          status,
          specialties,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create clinic: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating clinic:", error);
      throw error;
    }
  },
  getAllowedClinics: async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/clinics`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to getting clinic: ${response.statusText}`);
      }

      return ((await response.json()) as Clinic[]) || [];
    } catch (error) {
      console.error("Error getting clinic:", error);
      throw error;
    }
  },
  getAllClinics: async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/clinics/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to getting clinic: ${response.statusText}`);
      }

      return (await response.json()) as Clinic[];
    } catch (error) {
      console.error("Error getting clinic:", error);
      throw error;
    }
  },
  updateClinic: async ({
    token,
    name,
    address,
    phone,
    email,
    website,
    status,
    specialties,
    id,
  }: UpdateClinicPayload) => {
    const payload: Record<string, unknown> = {};

    if (name !== undefined) payload.name = name;
    if (status !== undefined) payload.status = status;
    if (address !== undefined) payload.address = address;
    if (phone !== undefined) payload.phone = phone;
    if (email !== undefined) payload.email = email;
    if (website !== undefined) payload.website = website;
    if (specialties !== undefined) payload.specialties = specialties;

    console.log("Updating clinic with:", payload);

    try {
      const response = await fetch(`${API_URL}/clinics/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to update clinic: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error update clinic:", error);
      throw error;
    }
  },
  deleteClinic: async (id: string, token: string) => {
    try {
      const response = await fetch(`${API_URL}/clinics/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete clinic: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting clinic:", error);
      throw error;
    }
  },
};
