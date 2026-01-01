// apps/frontend/app/api/auth.api.ts
export type LoginPayload = { email: string; password: string };

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
};

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // ✅ שולח cookies
  });

  if (!res.ok) {
    // מחזירים הודעה נוחה
    let msg = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.message || msg;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  return res.json() as Promise<T>;
}

export function loginApi(payload: LoginPayload) {
  // Laravel שם cookie HttpOnly. אנחנו לא שומרים token.
  return apiFetch<{ user: User }>(`/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function meApi() {
  return apiFetch<{ user: User }>(`/api/auth/me`, { method: "GET" });
}

export function logoutApi() {
  return apiFetch<{ message: string }>(`/api/auth/logout`, { method: "POST" });
}
