"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";

import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";

export default function LoginPage() {
    const router = useRouter();
    const { login, loading, error, clearError } = useAuthStore();

    const [email, setEmail] = useState("isabell.fritsch@example.com");
    const [password, setPassword] = useState("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        clearError();
        const ok = await login(email, password);
        if (ok) router.push("/pages/me");
    }

    return (
        <div className="min-h-screen bg-background-muted flex items-center justify-center px-4">
            <Card className="w-full max-w-md p-6">
                <h1 className="text-xl font-semibold text-text mb-1">Login</h1>
                <p className="text-sm text-text-muted mb-6">
                    התחברות דרך Cookie (HttpOnly) — בלי לשמור token בפרונט
                </p>

                <form onSubmit={onSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-text">Email</label>
                        <Input
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                            autoComplete="email"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-text">Password</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </div>

                    {error && (
                        <Alert variant="error">
                            {error}
                        </Alert>
                    )}

                    <Button type="submit" disabled={loading}>
                        {loading ? "מתחבר..." : "Login"}
                    </Button>
                </form>

                <div className="mt-4 text-xs text-text-muted">
                    טיפ: אחרי login, נוודא עם /api/auth/me שהדפדפן שולח את ה-cookie.
                </div>
            </Card>
        </div>
    );
}
