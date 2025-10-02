"use client";
import { authStorage } from "@/lib/auth";
import { postApi } from "@/lib/post";
import { CreatePost, Post, UpdatePost } from "@/types/post";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePostCreation = () => {
  return useMutation({
    mutationFn: async ({
      title,
      content,
      category,
      authorId,
      language = "en",
      status = "pending",
    }: CreatePost) => {
      const token = await authStorage.getToken();

      if (!token) return;
      return postApi.createPost({
        title,
        content,
        category,
        language,
        authorId,
        status,
        token,
      });
    },
    onSuccess: () => {
      toast.success("Post created successfully");
    },
    onError: () => {
      toast.error("Failed to create post, please try again later");
    },
  });
};

export const useGetAllowedPost = () => {
  return useQuery({
    queryKey: ["get-allowed-post"],
    queryFn: async () => {
      const token = await authStorage.getToken();
      if (!token) return;

      return postApi.findAllowedPosts(token);
    },
  });
};
export const useGetAllAllowedPost = () => {
  return useQuery({
    queryKey: ["get-all-allowed-post"],
    queryFn: async () => {
      const token = await authStorage.getToken();
      if (!token) return;

      return postApi.findAllAllowedPosts(token);
    },
  });
};

export const useUpdatePost = () => {
  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
      category,
      language,
      status,
    }: Partial<Post>) => {
      const token = await authStorage.getToken();

      if (!token || !id) return;
      return postApi.updatePost({
        id,
        title,
        content,
        category,
        language,
        status,
        token,
      });
    },
    onSuccess: () => {
      toast.success("Successfully updated post");
    },
    onError: () => {
      toast.error("Error occured updated user");
    },
  });
};

export const useDeletePost = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const token = await authStorage.getToken();
      if (!token) return;

      return postApi.deletePost(id, token);
    },
    onSuccess: () => {
      toast.success("Successfully deleted post");
    },
    onError: () => {
      toast.error("Error occured deleting user");
    },
  });
};
