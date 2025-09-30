"use client";
import { authApi, authStorage } from "@/lib/auth";
import { scanApi } from "@/lib/scan";
import { useAuthStore } from "@/stores/auth";
import { User } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UploadVariables {
  imageFile: File;
  symptoms: string;
}
export const useTokenQuery = () => {
  return useQuery({
    queryKey: authQueryKeys.token(),
    queryFn: authStorage.getToken,
    staleTime: Infinity,
  });
};

export const useUserQuery = () => {
  const tokenQuery = useTokenQuery();

  return useQuery({
    queryKey: authQueryKeys.user(),
    queryFn: authStorage.getUser,
    staleTime: Infinity,
    enabled: !!tokenQuery.data,
  });
};

export const useCurrentUserQuery = () => {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: authQueryKeys.currentUser(),
    queryFn: async () => {
      const token = await authStorage.getToken();
      if (!token || !user) return;
      return authApi.getCurrentUser(token, user?.id);
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: async (data) => {
      setCookie("authToken", data.accessToken, { path: "/" });

      const safeUser = sanitizeUser(data.user);
      setUser(safeUser);
      queryClient.setQueryData(authQueryKeys.token(), data.accessToken);
      queryClient.setQueryData(authQueryKeys.user(), safeUser);
      queryClient.setQueryData(authQueryKeys.currentUser(), safeUser);
      router.push("/home");
      console.log(data);
      toast.success(`Welcome back, ${data.user.name}`);
    },
    onError: (error) => {
      console.error("Login error:", error.message);
    },
  });
};
export const useUpdateCurrentUser = () => {
  const { setUser, user } = useAuthStore();
  return useMutation({
    mutationKey: ["update-current-user"],
    mutationFn: async (data: FormData) => {
      const token = await authStorage.getToken();
      if (!token) {
        throw new Error("No token found in storage");
      }
      if (!user?.id) {
        throw new Error("No user found in storage");
      }
      return authApi.updateCurrentUser(user.id, data, token);
    },
    onSuccess: async (data) => {
      console.log(data);
      setUser(data.user);

      // Also update the user in SecureStore to keep it in sync
      authStorage.setUser(data.user);
    },
    onError: (error) => {
      console.error("user update error:", error.message);
    },
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: ({
      email,
      password,
      firstName,
      lastName,
      profilePicture,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      profilePicture?: string;
    }) => {
      const name = firstName + " " + lastName;
      return authApi.register(email, password, name, profilePicture);
    },
    onSuccess: async (data) => {
      // Make sure to import from 'cookies-next' if you use setCookie
      setCookie("authToken", data.accessToken, { path: "/" });

      const safeUser = sanitizeUser(data.user);
      setUser(safeUser);

      queryClient.setQueryData(authQueryKeys.token(), data.accessToken);
      queryClient.setQueryData(authQueryKeys.user(), safeUser);
      queryClient.setQueryData(authQueryKeys.currentUser(), safeUser);

      toast.success(`Glad to have you on board, ${data.user.name}`);

      router.push("/home");
    },
    onError: (error) => {
      console.error("Registration error:", error);
      toast.error("Failed to create account. Try again.");
    },
  });
};
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: async () => {
      router.replace("/login");
      queryClient.removeQueries({ queryKey: authQueryKeys.all });
    },
    onError: async (error) => {
      console.error("Logout error:", error);
      await authStorage.clearAuth();
      queryClient.removeQueries({ queryKey: authQueryKeys.all });
    },
  });
};

export const useDeleteMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await authStorage.getToken();
      authApi.deleteCurrentUser(id, token!);
    },
    onSuccess: async () => {
      router.replace("/login");

      queryClient.removeQueries({ queryKey: authQueryKeys.all });
    },
    onError: async (error) => {
      console.error("Delete Current user error", error);
      await authStorage.clearAuth();
      queryClient.removeQueries({ queryKey: authQueryKeys.all });
    },
  });
};

export const useImageUploadMutation = () => {
  const { user } = useAuthStore();
  return useMutation({
    mutationFn: async ({ imageFile, symptoms }: UploadVariables) => {
      const token = await authStorage.getToken();

      if (!user?.id) {
        throw new Error("No user found in storage");
      }
      return scanApi.uploadImage(token!, imageFile, user.id, symptoms);
    },
    onSuccess: () => {
      console.log("uploaded successfully!");
    },
    onError: (error) => {
      console.error("Error uploading image", error);
    },
  });
};

export const authQueryKeys = {
  all: ["auth"] as const,
  user: () => [...authQueryKeys.all, "user"] as const,
  token: () => [...authQueryKeys.all, "token"] as const,
  currentUser: () => [...authQueryKeys.all, "current-user"] as const,
};
function sanitizeUser(user: User) {
  if (!user) return user;
  return JSON.parse(JSON.stringify(user));
}
