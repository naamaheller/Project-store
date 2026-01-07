"use client";

import ErrorPage from "./components/ui/ErrorPage";

export default function NotFound() {
  return (
    <ErrorPage
      code={404}
      title="Page not found"
      description="The page you’re looking for doesn’t exist or has been moved.Please
          check the URL or return to a safe place."
      backHref="/pages/product"
      backLabel="← Back to products"
    />

  );
}
