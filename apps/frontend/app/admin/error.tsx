// app/admin/error.tsx
"use client";

import ErrorPage from "../components/ui/ErrorPage";

export default function AdminError({
  error,
}: {
  error: unknown;
  reset: () => void;
}) {
  const anyErr = error as any;
  const status =
    anyErr?.status ??
    anyErr?.apiError?.status ??
    500;

  if (status === 403) {
    return (
      <ErrorPage
        code={403}
        title="Admin access required"
        description="You do not have permission to view this admin page."
      />
    );
  }

  return (
    <ErrorPage
      code={500}
      title="Admin error"
      description="An unexpected error occurred in the admin area."
    />
  );
}
