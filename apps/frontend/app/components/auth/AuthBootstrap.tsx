"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/app/store/auth.store";

export default function AuthBootstrap()  {
    const fetchMe = useAuthStore((s) => s.fetchMe);
    const ready = useAuthStore((s) => s.ready);
    const checking = useAuthStore((s) => s.checking);

    useEffect(() => {
        if (!ready && !checking) fetchMe();
    }, [ready, checking, fetchMe]);

    return null;
}
