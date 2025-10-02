import { User } from "@/types/user";
import { API_URL } from "@/constants/backend-url";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

export const authStorage = {
  getToken: async (): Promise<string | null> => {
    try {
      const token = getCookie("authToken");
      return token ? String(token) : null;
    } catch (error) {
      console.error("Error retrieving token from storage", error);
      return null;
    }
  },

  setToken: async (token: string): Promise<void> => {
    try {
      setCookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    } catch (error) {
      console.error("Error setting token", error);
    }
  },

  getUser: async (): Promise<User | null> => {
    try {
      const userString = getCookie("user");
      return userString ? JSON.parse(String(userString)) : null;
    } catch (error) {
      console.error("Error retrieving user", error);
      return null;
    }
  },

  setUser: async (user: User): Promise<void> => {
    try {
      setCookie("user", JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    } catch (error) {
      console.error("Error saving user to storage", error);
    }
  },

  clearAuth: async (): Promise<void> => {
    try {
      deleteCookie("authToken");
      deleteCookie("user");
    } catch (error) {
      console.error("Error clearing auth storage", error);
    }
  },
};

export const authApi = {
  login: async (
    email: string,
    password: string,
  ): Promise<{ user: User; accessToken: string }> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return response.json();
  },

  register: async (
    email: string,
    password: string,
    name: string,
    profilePicture?: string,
  ) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name, profilePicture }),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    return response.json();
  },

  logout: async () => {
    return await authStorage.clearAuth();
  },

  getAllUsers: async (token: string) => {
    const response = await fetch(`${API_URL}/auth/all`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return response.json() as unknown as User[];
  },

  getCurrentUser: async (token: string, id: string) => {
    const response = await fetch(`${API_URL}/auth/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return response.json() as unknown as User;
  },

  updateCurrentUser: async (
    id: string,
    data: FormData,
    token: string,
  ): Promise<{ user: User }> => {
    const response = await fetch(`${API_URL}/auth/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    return response.json();
  },

  deleteCurrentUser: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(id),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return response.json();
  },
};
