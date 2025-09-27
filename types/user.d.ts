export type UserRole = "ADMIN" | "USER";

export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
}
