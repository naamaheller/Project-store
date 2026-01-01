"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";

import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";

export default function LoginPage() {
    const router = useRouter();
    const { login, loading, error, clearError } = useAuthStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);

    const canSubmit = useMemo(
        () => email.trim().length > 3 && password.trim().length >= 1 && !loading,
        [email, password, loading]
    );
    // טיפול בטופס התחברות
    async function onSubmit(e: React.FormEvent) {
      
        e.preventDefault();
        clearError();

        const ok = await login(email.trim(), password);
        if (ok) router.push("/pages/me");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-muted px-4">
            <Card className="w-full max-w-md p-6">
                <h1 className="text-2xl font-semibold text-text text-center mb-6">
                    Login
                </h1>

                <form onSubmit={onSubmit} className="grid gap-4">
                    {error && (
                        <Alert variant="error">
                            {error}
                        </Alert>
                    )}

                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-text">Email</label>
                        <Input
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setEmail(e.target.value)
                            }
                            placeholder="email@example.com"
                            autoComplete="email"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-text">Password</label>
                        <div className="relative">
                            <Input
                                type={show ? "text" : "password"}
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="••••••••"
                                autoComplete="current-password"
                                className="pr-20"
                            />
                            <button
                                type="button"
                                onClick={() => setShow((v) => !v)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:underline"
                            >
                                {show ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" disabled={!canSubmit}>
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
