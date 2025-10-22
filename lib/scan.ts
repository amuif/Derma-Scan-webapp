import { API_URL } from "@/constants/backend-url";
import { CheckImage, Scan } from "@/types/scan";

export const scanApi = {
  checkImage: async (token: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    try {
      const response = await fetch(`${API_URL}/models/check`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = (await response.json()) as CheckImage;
      console.log(result);
      return result;
    } catch (error) {
      console.error("Error uploading image", error);
      throw error;
    }
  },
  uploadImage: async (
    token: string,
    imageFile: File,
    userId: string,
    consent: string,
    symptoms?: string,
  ) => {
    const form = new FormData();
    form.append("file", imageFile);
    form.append("userId", userId);
    form.append("consent", consent);

    if (symptoms) {
      form.append("symptoms", symptoms);
    }

    try {
      const response = await fetch(`${API_URL}/models/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.error("Error uploading image", error);
      throw error;
    }
  },

  textUpload: async (
    token: string,
    prompt: string,
    consent: string,
    userId: string,
  ) => {
    try {
      const response = await fetch(`${API_URL}/models/text`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, consent, userId }),
      });
      if (response.ok) {
        const result = await response.json();
        return result;
      }
    } catch (error) {
      console.log("Error sending text to the backend:", error);
    }
  },
  scanHistory: async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/models/history`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = (await response.json()) as Scan[];
      console.log(result);
      return result;
    } catch (error) {
      console.log("Error fetching scan history", error);
      throw error;
    }
  },
  selfScanHistory: async (token: string, userId: string) => {
    try {
      const response = await fetch(`${API_URL}/models/personal/history`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      const result = (await response.json()) as Scan[];
      console.log(result);
      return result;
    } catch (error) {
      console.log("Error fetching scan history", error);
      throw error;
    }
  },
  approveScan: async (token: string, id: string) => {
    try {
      const response = await fetch(`${API_URL}/models/approve`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scanId: id }),
      });

      const result = (await response.json()) as Scan[];
      console.log(result);
      return result;
    } catch (error) {
      console.log("Error fetching scan history", error);
      throw error;
    }
  },
};
