import { CreatePost, Post, UpdatePost } from "@/types/post";
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
    console.table({
      title,
      content,
      category,
      language,
      authorId,
      status,
      token,
    });
    try {
      const response = await fetch(`${API_URL}/education/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          category,
          language,
          authorId,
          status,
        }),
      });
      return response.json();
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
      return response.json() as unknown as Post[];
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
      return response.json() as unknown as Post[];
    } catch (error) {
      console.log("Error creating post", error);
    }
  },
  updatePost: async ({
    id,
    title,
    content,
    category,
    language,
    status,
    token,
  }: UpdatePost & { id: string }) => {
    const payload: Record<string, unknown> = {};

    if (title !== undefined) payload.title = title;
    if (status !== undefined) payload.status = status;
    if (content !== undefined) payload.content = content;
    if (language !== undefined) payload.language = language;
    if (category !== undefined) payload.email = category;

    try {
      const response = await fetch(`${API_URL}/education/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      return response.json();
    } catch (error) {
      console.log("Error creating post", error);
    }
  },
  deletePost: async (id: string, token: string) => {
    try {
      const response = await fetch(`${API_URL}/education/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      return response.json();
    } catch (error) {
      console.log("Error creating post", error);
    }
  },
};
