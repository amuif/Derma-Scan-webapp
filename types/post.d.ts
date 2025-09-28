export interface CreatePost {
  title: string;
  content: string;
  category: EducationCategory;
  language: string;
  authorId: string;
  status: Status;
  token: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: EducationCategory;
  language: string;
  authorId: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdatePost {
  title?: string;
  content?: string;
  category?: EducationCategory;
  language?: string;
  status?: Status;
  token: string;
}
