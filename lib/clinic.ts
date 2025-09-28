import { API_URL } from "@/constants/backend-url";
import { CreateClinicPayload, UpdateClinicPayload } from "@/types/clinic";

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
    const form = new FormData();

    form.append("name", name);
    form.append("address", address);
    form.append("status", status);

    specialties.forEach((specialty: string) => {
      form.append("specialties", specialty);
    });

    if (phone) {
      form.append("phone", phone);
    }
    if (email) {
      form.append("email", email);
    }
    if (website) {
      form.append("website", website);
    }

    try {
      const response = await fetch(`${API_URL}/community/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
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
      const response = await fetch(`${API_URL}/community`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to getting clinic: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting clinic:", error);
      throw error;
    }
  },
  getAllClinics: async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/community/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to getting clinic: ${response.statusText}`);
      }

      return await response.json();
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
    const form = new FormData();

    if (name) {
      form.append("name", name);
    }
    if (status) {
      form.append("status", status);
    }
    if (address) {
      form.append("address", address);
    }
    if (specialties) {
      specialties.forEach((specialty: string) => {
        form.append("specialties", specialty);
      });
    }

    if (phone) {
      form.append("phone", phone);
    }
    if (email) {
      form.append("email", email);
    }
    if (website) {
      form.append("website", website);
    }
    try {
      const response = await fetch(`${API_URL}/community/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
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
      const response = await fetch(`${API_URL}/community/${id}`, {
        method: "POST",
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
