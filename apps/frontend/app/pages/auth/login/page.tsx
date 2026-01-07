"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/auth.store";

import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Alert } from "../../../components/ui/Alert";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { BackgroundBubbles } from "@/app/components/state/loading/Bubbles";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const canSubmit = useMemo(
    () => email.trim().length > 3 && password.trim().length >= 1 && !loading,
    [email, password, loading]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();

    const ok = await login(email.trim(), password);
    if (ok) router.push("/pages/public/product");
  }

  return (
    <>
      <BackgroundBubbles />
      <div className="relative z-10 w-full max-w-md">
        <Card className="w-full max-w-md p-10 min-h-[440px] border-2 border-primary/50">
          <div className="mx-auto w-full max-w-sm">
            <h1 className="text-2xl font-semibold text-center mb-8">Login</h1>

            <form onSubmit={onSubmit} className="grid gap-6">
              {error && <Alert variant="error">{error}</Alert>}

              <div className="grid gap-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Password</label>

                <div className="relative">
                  <Input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2
                             text-text-muted hover:text-text transition"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={!canSubmit}>
                {loading ? "Logging in..." : "Login"}
              </Button>

              <div className="text-center text-sm text-text-muted">
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/pages/auth/register")}
                  className="text-primary font-medium hover:underline"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </>
  );
}
