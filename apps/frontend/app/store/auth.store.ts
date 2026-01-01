"use client";

import { create } from "zustand";
import { loginApi, logoutApi, meApi, type User } from "../api/auth.api";

type AuthState = {
    user: User | null;
    loading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<boolean>;
    fetchMe: () => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    loading: false,
    error: null,

    clearError: () => set({ error: null }),

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const res = await loginApi({ email, password });
            set({ user: res.user, loading: false });
            return true;
        } catch (e: any) {
            set({ error: e?.message || "Login failed", loading: false, user: null });
            return false;
        }
    },

    fetchMe: async () => {
        set({ loading: true, error: null });
        try {
            const res = await meApi();
            set({ user: res.user, loading: false });
        } catch (e: any) {
            // אם אין cookie/לא מחובר → user נשאר null
            set({ user: null, loading: false, error: e?.message || null });
        }
    },

    logout: async () => {
        set({ loading: true, error: null });
        try {
            await logoutApi();
        } catch {
            // גם אם נכשל, ננקה user בפרונט
        } finally {
            set({ user: null, loading: false });
        }
    },
}));
