"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";

import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { BackgroundBubbles } from "@/app/components/state/loading/Bubbles";

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const isEmailValid = useMemo(() => {
    if (!email) return true;
    return email.includes("@") && email.includes(".");
  }, [email]);

  const isPasswordValid = useMemo(() => {
    if (!password) return true;
    return password.trim().length >= 6;
  }, [password]);

  const canSubmit = useMemo(() => {
    return (
      name.trim().length >= 2 &&
      isEmailValid &&
      email.trim().length > 3 &&
      isPasswordValid &&
      password.trim().length >= 6 &&
      !loading
    );
  }, [name, email, password, loading, isEmailValid, isPasswordValid]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    clearError();

    if (!isEmailValid || !isPasswordValid) return;

    const ok = await register(name.trim(), email.trim(), password);

    if (ok) {
      clearError();
      router.push("/pages/login");
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <BackgroundBubbles />
      <div className="relative z-10 w-full max-w-md">
        <Card className="w-full max-w-md p-10 min-h-[440px] border-2 border-primary/50">
          <div className="mx-auto w-full max-w-sm">
            <h1 className="text-2xl font-semibold text-center mb-8">
              Register
            </h1>

            <form onSubmit={onSubmit} className="grid gap-6">
              {error && <Alert variant="error">{error}</Alert>}

              <div className="grid gap-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  autoComplete="email"
                  error={!isEmailValid ? "Invalid email address" : undefined}
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
                    autoComplete="new-password"
                    className="pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {!isPasswordValid && (
                  <p className="text-xs text-error">
                    Password must be at least 6 characters
                  </p>
                )}
              </div>

              <Button type="submit" disabled={!canSubmit}>
                {loading ? "Creating account..." : "Create account"}
              </Button>

              <div className="text-center text-sm text-text-muted">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/pages/login")}
                  className="text-primary font-medium hover:underline"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
