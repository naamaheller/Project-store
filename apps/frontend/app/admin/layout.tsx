"use client";

import { AdminGuard } from "../components/auth/AdminGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      
      <main>{children}</main>
    </AdminGuard>
  );
}