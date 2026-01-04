import apiClient from "./axios";
import type { User } from "@/app/models/user.model";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export async function loginApi(payload: LoginPayload) {
  const { data } = await apiClient.post<{ user: User; token?: string }>(
    "/auth/login",
    payload
  );
  return data;
}

export async function registerApi(payload: RegisterPayload) {
  const { data } = await apiClient.post<{ message: string; user: User }>(
    "/auth/register",
    payload
  );
  return data;
}

export async function meApi() {
  const { data } = await apiClient.get<{ user: User }>("/auth/me");
  return data;
}

export async function logoutApi() {
  const { data } = await apiClient.post<{ message: string }>("/auth/logout");
  return data;
}
