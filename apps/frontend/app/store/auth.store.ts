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

function getErrMessage(e: any) {
    // axios error shape
    return (
        e?.response?.data?.message ||
        e?.message ||
        "Something went wrong"
    );
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    loading: false,
    error: null,

    clearError: () => set({ error: null }),

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            await loginApi({ email, password });

            const me = await meApi();

            set({ user: me.user, loading: false });
            return true;
        } catch (e: any) {
            set({ user: null, loading: false, error: getErrMessage(e) });
            return false;
        }
    },

    fetchMe: async () => {
        set({ loading: true, error: null });
        try {
            const res = await meApi();
            set({ user: res.user, loading: false });
        } catch (e: any) {
            set({ user: null, loading: false, error: getErrMessage(e) });
        }
    },

    logout: async () => {
        set({ loading: true, error: null });
        try {
            await logoutApi();
        } finally {
            set({ user: null, loading: false });
        }
    },
}));
