"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./store/auth.store";
import { ROUTES } from "./config/routes.config";

export default function HomePage() {
  const router = useRouter();
  const { user, fetchMe, loading } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (loading) return;
    router.replace(ROUTES.auth.login);
  }, [loading, user, router]);

  return null;
}
