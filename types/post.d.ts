import { User } from "./user";
export type PostCategory =
  | "PREVENTION"
  | "TREATMENT"
  | "AWARENESS"
  | "RESEARCH";
export interface CreatePost {
  title: string;
  content: string;
  category: EducationCategory;
  language: string;
  authorId: string;
  status: string;
  token: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: EducationCategory;
  language: string;
  author: User;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePost {
  title?: string;
  content?: string;
  category?: EducationCategory;
  language?: string;
  status?: Status;
  token: string;
}
