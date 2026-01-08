"use client";

import { create } from "zustand";
import { loginApi, logoutApi, meApi, registerApi } from "../api/auth.api";
import type { User } from "../models/user.model";
import { useProductStore } from "./product.store";

type AuthState = {
    user: User | null;
    loading: boolean;
    checking: boolean;
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
    checking: false,
    ready: false,
    error: null,

    clearError: () => set({ error: null }),

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const res = await loginApi({ email, password });

            if (res?.user) {
                set({ user: res.user, ready: true });
                return true;
            }

            const me = await meApi();
            set({ user: me.user, ready: true });
            return true;
        } catch (e: any) {
            set({ user: null, error: getErrMessage(e), ready: true });
            return false;
        } finally {
            set({ loading: false });
        }
    },

    register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
            await registerApi({ name, email, password });
            return true;
        } catch (e: any) {
            set({ error: getErrMessage(e) });
            return false;
        } finally {
            set({ loading: false });
        }
    },

    fetchMe: async () => {
        set({ checking: true });

        try {
            const res = await meApi();
            set({ user: res.user, ready: true });
        } catch {
            set({ user: null, ready: true });
        } finally {
            set({ checking: false });
        }
    },


    logout: async () => {
        set({ loading: true, error: null });
        try {
            await logoutApi();
        } finally {
            useProductStore.getState().resetStore();
            set({ user: null, loading: false, ready: true, error: null });
        }
    },
}));
