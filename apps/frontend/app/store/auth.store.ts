"use client";

import { create } from "zustand";
import { loginApi, logoutApi, meApi, registerApi } from "../api/auth.api";
import type { User } from "../models/user.model";

type AuthState = {
    user: User | null;
    loading: boolean;
    ready: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    fetchMe: () => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
};

function getErrMessage(e: any) {
    return e?.response?.data?.message || e?.message || "Something went wrong";
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    loading: false,
    ready: false,
    error: null,

    clearError: () => set({ error: null }),

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            await loginApi({ email, password });

            const me = await meApi();
            set({ user: me.user, loading: false, ready: true });

            return true;
        } catch (e: any) {
            set({ user: null, loading: false, error: getErrMessage(e), ready: true });
            return false;
        }
    },

    register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
            await registerApi({ name, email, password });
            set({ loading: false });
            return true;
        } catch (e: any) {
            set({ loading: false, error: getErrMessage(e) });
            return false;
        }
    },

    fetchMe: async () => {

        set({ loading: true, error: null });
        try {
            const res = await meApi();
            set({ user: res.user, loading: false, ready: true });
        } catch (e: any) {

            set({ user: null, loading: false, ready: true, error: null });
        }
    },

    logout: async () => {
        set({ loading: true, error: null });
        try {
            await logoutApi();
        } finally {
            set({ user: null, loading: false, ready: true });
        }
    },
}));
