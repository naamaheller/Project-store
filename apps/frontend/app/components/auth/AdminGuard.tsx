"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/auth.store";
import { Skeleton } from "@/app/components/ui/Skeleton";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, ready, loading, fetchMe } = useAuthStore();

  useEffect(() => {
    if (!ready && !loading) {
      fetchMe();
    }
  }, [ready, loading, fetchMe]);

  useEffect(() => {
    if (ready && !loading) {
      if (!user) {
        router.replace("/pages/login");
      } else if (user.role !== "admin") {
        router.replace("/");
      }
    }
  }, [ready, loading, user, router]);

  // Show loading state while checking auth
  if (!ready || loading || !user || user.role !== "admin") {
    return <Skeleton className="h-screen w-full" />;
  }

  return <>{children}</>;
}
