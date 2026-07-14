export type Role = "ADMIN" | "DEPO" | "ZIMMET" | "PERSONEL";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  user: User;
}
