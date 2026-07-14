import { api } from "./axios";
import type { LoginResponse, User } from "../types/user";

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
  return data;
}

export async function register(name: string, email: string, password: string): Promise<{ message: string; user: User }> {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
}
