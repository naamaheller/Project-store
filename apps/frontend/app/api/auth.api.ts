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
  try {
    const { data } = await apiClient.post<{ user: User; token?: string }>(
      "/auth/login",
      payload
    );
    return data;
  } catch (err: any) {
    throw err.apiError;
  }
}

export async function registerApi(payload: RegisterPayload) {
  try {
    const { data } = await apiClient.post<{ message: string; user: User }>(
    "/auth/register",
    payload
  );
  return data;
  } catch (err: any) {
    throw err.apiError;
  }
  
}

export async function meApi() {
  try {
  const { data } = await apiClient.get<{ user: User }>("/auth/me");
  return data;
  } catch (err: any) {
    throw err.apiError;
  }
}

export async function logoutApi() {
  try{
  const { data } = await apiClient.post<{ message: string }>("/auth/logout");
  return data;
  } catch (err: any) {
    throw err.apiError;
  }
}
