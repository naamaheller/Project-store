"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";

import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";

export default function RegisterPage() {
    const router = useRouter();
    const { register, loading, error, clearError } = useAuthStore();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [show, setShow] = useState(false);

    const canSubmit = useMemo(() => {
        return (
            name.trim().length >= 2 &&
            email.trim().length > 3 &&
            password.trim().length >= 6 &&
            !loading
        );
    }, [name, email, password, loading]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        clearError();

        const ok = await register(name.trim(), email.trim(), password);
        if (ok) router.push("/pages/login");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-muted px-4">
            <Card className="w-full max-w-md p-6">
                <h1 className="text-2xl font-semibold text-text text-center mb-6">
                    Register
                </h1>

                <form onSubmit={onSubmit} className="grid gap-4">
                    {error && <Alert variant="error">{error}</Alert>}

                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-text">Name</label>
                        <Input
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setName(e.target.value)
                            }
                            placeholder="Your name"
                            autoComplete="name"
                        />
                    </div>

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
                                autoComplete="new-password"
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

                        <p className="text-xs text-text-muted">
                            Password must be at least 6 characters.
                        </p>
                    </div>

                    <Button type="submit" disabled={!canSubmit}>
                        {loading ? "Creating account..." : "Create account"}
                    </Button>

                    <div className="text-center text-sm text-text-muted">
                        <button
                            type="button"
                            onClick={() => router.push("/pages/login")}
                            className="text-text hover:underline font-medium"
                        >
                            Login
                        </button>
                        {" "}?Already have an account
                    </div>

                </form>
            </Card>
        </div>
    );
}
