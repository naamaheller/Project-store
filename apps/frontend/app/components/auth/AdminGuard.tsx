"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/auth.store";
import LoadingText from "../state/loading/Loading";
import { ROUTES } from "@/app/config/routes.config";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, ready, loading, fetchMe } = useAuthStore();

  const isAdmin = Array.isArray(user?.roles) && user.roles.includes("admin");

  useEffect(() => {
    if (!ready && !loading) {
      fetchMe();
    }
  }, [ready, loading, fetchMe]);

  useEffect(() => {
    if (!ready || loading) return;

    if (!user) {
      router.replace("/pages/auth/login");
    } else if (!isAdmin) {
      router.replace("/");
    }
  }, [ready, loading, user, isAdmin, router]);

  if (!ready || loading) {
    return <LoadingText />;
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
