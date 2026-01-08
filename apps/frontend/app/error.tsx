// app/error.tsx
"use client";

import { useEffect } from "react";
import ErrorPage from "./components/ui/ErrorPage";

type ApiErrorLike = {
  status?: number;
  message?: string;
};

export default function Error({
  error,
  reset,
}: {
  error: unknown;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  const anyErr = error as any;

  const apiErr: ApiErrorLike | undefined =
    typeof anyErr?.status === "number"
      ? anyErr
      : typeof anyErr?.apiError?.status === "number"
      ? anyErr.apiError
      : undefined;

  const status = apiErr?.status ?? 500;

  if (status === 403) {
    return (
      <ErrorPage
        code={403}
        title="Access denied"
        description="You do not have permission to access this page."
      />
    );
  }

  if (status === 401) {
    return (
      <ErrorPage
        code={401}
        title="Unauthenticated"
        description="Please sign in to continue."
      />
    );
  }

  return (
    <ErrorPage
      code={500}
      title="Server error"
      description="We’re having trouble processing your request right now."
    />
  );
}
