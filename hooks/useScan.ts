import { authStorage } from "@/lib/auth";
import { scanApi } from "@/lib/scan";
import { useAuthStore } from "@/stores/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCurrentUserQuery } from "./useAuth";

interface TextInputProps {
  symptoms: string;
  consent: string;
}
interface ApproveScan {
  scanId: string;
}
interface UploadVariables {
  imageFile: File;
  symptoms: string;
  consent: string;
}

interface ApproveScan {
  scanId: string;
}

export const useCheckImage = () => {
  const { data: user } = useCurrentUserQuery();
  return useMutation({
    mutationFn: async (file: File) => {
      const token = await authStorage.getToken();
      if (!user || !token) return;
      return scanApi.checkImage(token, file);
    },
  });
};
export const useImageUploadMutation = () => {
  const { user } = useAuthStore();
  return useMutation({
    mutationFn: async ({ imageFile, symptoms, consent }: UploadVariables) => {
      const token = await authStorage.getToken();

      if (!user?.id) {
        throw new Error("No user found in storage");
      }
      return scanApi.uploadImage(token!, imageFile, user.id, consent, symptoms);
    },
    onSuccess: () => {
      console.log("uploaded successfully!");
    },
    onError: (error) => {
      console.error("Error uploading image", error);
    },
  });
};

export const useTextScan = () => {
  const { user } = useAuthStore();
  return useMutation({
    mutationKey: ["get-text-scan"],
    mutationFn: async ({ symptoms, consent }: TextInputProps) => {
      const token = await authStorage.getToken();
      if (!token || !user) return;
      return scanApi.textUpload(token, symptoms, consent, user?.id);
    },
  });
};
export const useScanHistory = () => {
  return useQuery({
    queryKey: ["get-scan-history"],
    queryFn: async () => {
      const token = await authStorage.getToken();
      return scanApi.scanHistory(token!);
    },
  });
};
export const useSelfScanHistory = () => {
  const { data: user } = useCurrentUserQuery();
  return useQuery({
    queryKey: ["get-self-scan-history"],
    queryFn: async () => {
      const token = await authStorage.getToken();
      if (!token || !user) return;
      return scanApi.selfScanHistory(token, user.id);
    },
  });
};

export const useApproveScan = () => {
  return useMutation({
    mutationFn: async ({ scanId }: ApproveScan) => {
      const token = await authStorage.getToken();
      console.log("scaId", scanId);
      return scanApi.approveScan(token!, scanId);
    },
  });
};
