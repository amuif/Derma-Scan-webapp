"use client";
import { authStorage } from "@/lib/auth";
import { postApi } from "@/lib/post";
import { CreatePost, UpdatePost } from "@/types/post";
import { useMutation, useQuery } from "@tanstack/react-query";

export const usePostCreation = () => {
  return useMutation({
    mutationFn: async ({
      title,
      content,
      category,
      language,
      authorId,
      status,
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
      title,
      content,
      category,
      language,
      status,
    }: UpdatePost) => {
      const token = await authStorage.getToken();

      if (!token) return;
      return postApi.updatePost({
        title,
        content,
        category,
        language,
        status,
        token,
      });
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
  });
};
