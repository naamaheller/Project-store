"use client";

import { useAuthStore } from "@/app/store/auth.store";
import { useEffect, ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  const fetchMe = useAuthStore((state) => state.fetchMe);

  useEffect(() => {
    // Check for user session on mount
    fetchMe();
  }, [fetchMe]);

  return <>{children}</>;
}


