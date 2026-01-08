"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/auth.store";
import { Skeleton } from "@/app/components/ui/Skeleton";
import LoadingText from "../state/loading/Loading";
import { ROUTES } from "@/app/config/routes.config";

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
      console.log("USER: ",user);
      
      if (!user) {
        router.replace(ROUTES.auth.login);
      } else if (!user.roles.includes("admin")) {
        router.replace(ROUTES.base);
      }
    }
  }, [ready, loading, user, router]);

  // Show loading state while checking auth
  if (!ready || loading || !user || !user.roles.includes("admin")) {
    return <LoadingText />;
  }

  return <>{children}</>;
}
