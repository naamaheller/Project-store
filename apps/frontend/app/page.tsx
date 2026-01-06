"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./store/auth.store";
import LoadingText from "./components/state/loading/Loading";

export default function HomePage() {
  const router = useRouter();
  const { user, fetchMe, loading } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (loading) return;

    if (user) router.replace("/pages/product");
    else router.replace("/pages/auth/login");
  }, [loading, user, router]);

  return (
    <LoadingText />
  );
}
