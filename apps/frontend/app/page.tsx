"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./store/auth.store";

export default function HomePage() {
  const router = useRouter();
  const { user, fetchMe, loading } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (loading) return;

    if (user) router.replace("/pages/product");
    else router.replace("/pages/login");
  }, [loading, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <span>Loading...</span>
    </div>
  );
}
