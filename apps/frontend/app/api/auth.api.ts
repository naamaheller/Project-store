import apiClient from "./axios";

export type LoginPayload = { email: string; password: string };

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
};

export async function loginApi(payload: LoginPayload) {
  const { data } = await apiClient.post<{ user: User; token?: string }>(
    "/auth/login",
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
