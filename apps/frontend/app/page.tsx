"use client";

import { useRouter } from "next/navigation";

import { Card } from "./components/ui/Card";
import { Button } from "./components/ui/Button";
import ProductPage from "./pages/product/page";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background-muted flex items-center justify-center px-4">
      <ProductPage />
      <Card className="w-full max-w-md p-6 text-center">
        <h1 className="text-xl font-semibold text-text mb-2">
          Frontend
        </h1>

        <p className="text-sm text-text-muted mb-6">
          Cookie Auth (HttpOnly) · Laravel Passport
        </p>

        <div className="flex gap-3 justify-center">
          <Button onClick={() => router.push("/pages/login")}>
            Login
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/pages/me")}
          >
            Me
          </Button>
        </div>
      </Card>
    </main>
  );
}
