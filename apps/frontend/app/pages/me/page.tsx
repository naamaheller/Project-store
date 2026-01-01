"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";

import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import { Skeleton } from "../../components/ui/Skeleton";

export default function MePage() {
    const router = useRouter();
    const { user, loading, error, fetchMe, logout } = useAuthStore();

    useEffect(() => {
        fetchMe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function onLogout() {
        await logout();
        router.push("/pages/login");
    }

    return (
        <div className="min-h-screen bg-background-muted px-4 py-10">
            <Card className="mx-auto max-w-2xl p-6">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-xl font-semibold text-text">Me</h1>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => fetchMe()} disabled={loading}>
                            Refresh
                        </Button>
                        <Button onClick={onLogout} disabled={loading}>
                            Logout
                        </Button>
                    </div>
                </div>

                <div className="mt-6">
                    {loading && (
                        <div className="grid gap-3">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                    )}

                    {!loading && user && (
                        <div className="rounded-md border border-border bg-white p-4">
                            <p className="text-sm text-text-muted mb-2">
                                המשתמש הגיע מ־<code>/api/auth/me</code> על בסיס cookie.
                            </p>

                            <pre className="text-xs overflow-auto">
                                {JSON.stringify(user, null, 2)}
                            </pre>
                        </div>
                    )}

                    {!loading && !user && (
                        <div className="grid gap-3">
                            <Alert variant="warning" title="אין משתמש מחובר">
                                {error || "כנראה שאין cookie / לא התחברת."}
                            </Alert>

                            <Button variant="outline" onClick={() => router.push("/pages/login")}>
                                Go to Login
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
