"use client";

import { useRouter } from "next/navigation";
import { Card } from "./components/ui/Card";
import { Button } from "./components/ui/Button";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background-muted flex items-center justify-center">
      <Card className="p-6">
        <h1 className="text-xl font-semibold text-text mb-4">Frontend</h1>

        <div className="flex gap-3">
          <Button onClick={() => router.push("/pages/login")}>Login</Button>

          <Button variant="outline" onClick={() => router.push("/pages/me")}>
            Me
          </Button>
        </div>
      </Card>
    </main>
  );
}
