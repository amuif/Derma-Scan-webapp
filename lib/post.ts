import { CreatePost, UpdatePost } from "@/types/post";
import { API_URL } from "@/constants/backend-url";

export const postApi = {
  createPost: async ({
    title,
    content,
    category,
    language,
    authorId,
    status,
    token,
  }: CreatePost) => {
    const form = new FormData();
    form.append("title", title);
    form.append("content", content);
    form.append("category", category);
    form.append("language", language);
    form.append("authorId", authorId);
    form.append("status", status);
    try {
      const response = await fetch(`${API_URL}/education/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      return response;
    } catch (error) {
      console.log("Error creating post", error);
    }
  },
  findAllAllowedPosts: async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/education/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.log("Error creating post", error);
    }
  },
  findAllowedPosts: async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/education`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      console.log("Error creating post", error);
    }
  },
  updatePost: async ({
    title,
    content,
    category,
    language,
    status,
    token,
  }: UpdatePost) => {
    const form = new FormData();
    if (title) {
      form.append("title", title);
    }
    if (content) {
      form.append("content", content);
    }
    if (status) {
      form.append("status", status);
    }
    if (language) {
      form.append("language", language);
    }
    if (category) {
      form.append("category", category);
    }
    try {
      const response = await fetch(`${API_URL}/education`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      return response;
    } catch (error) {
      console.log("Error creating post", error);
    }
  },
  deletePost: async (id: string, token: string) => {
    try {
      const response = await fetch(`${API_URL}/education`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      return response;
    } catch (error) {
      console.log("Error creating post", error);
    }
  },
};
