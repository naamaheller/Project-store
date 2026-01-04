"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";

function LogoutIcon({ size = 18 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M10 7V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M15 12H3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M6 9l-3 3 3 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function Header() {
    const router = useRouter();
    const { user, logout, loading } = useAuthStore();

    return (
        <header className="sticky top-0 z-40 w-full h-16 bg-white/80 backdrop-blur border-b border-border">
            {/* FULL WIDTH CONTAINER */}
            <div className="w-full h-full px-6 flex items-center">
                {/* הכי שמאלה */}
                <div className="flex items-center gap-3">
                    {user && (
                        <>
                            <span className="text-sm text-text-muted">
                                Hello, <span className="font-medium text-text">{user.name}</span>
                            </span>

                            <button
                                onClick={async () => {
                                    if (loading) return;
                                    await logout();
                                    router.replace("/pages/login");
                                }}
                                aria-label="Logout"
                                title="Logout"
                                className="text-text-muted transition hover:text-primary hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                <LogoutIcon size={18} />
                            </button>
                        </>
                    )}
                </div>

                {/* דוחף את הכותרת הכי ימינה */}
                <div className="flex-1" />

                {/* הכי ימינה */}
                <h1 className="text-lg font-semibold text-text tracking-wide">
                    Store
                </h1>
            </div>
        </header>
    );
}
