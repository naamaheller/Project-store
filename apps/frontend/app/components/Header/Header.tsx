"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";
import { Button } from "../ui/Button";

export default function AppHeader() {
    const router = useRouter();
    const { user, logout, loading } = useAuthStore();

    return (
        <header className="w-full bg-white/70 backdrop-blur border-b border-border">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                <h1 className="text-lg font-semibold text-text">Store</h1>

                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-text-muted">
                            Hello, <span className="font-medium text-text">{user.name}</span>
                        </span>

                        <Button
                            variant="outline"
                            disabled={loading}
                            onClick={async () => {
                                await logout();
                                router.replace("/pages/login");
                            }}
                        >
                            Logout
                        </Button>
                    </div>
                ) : null}
            </div>
        </header>
    );
}
