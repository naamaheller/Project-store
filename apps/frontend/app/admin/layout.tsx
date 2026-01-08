"use client";

import { AdminGuard } from "../components/auth/AdminGuard";
import Header from "../components/Header/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <Header />
      <main>{children}</main>
    </AdminGuard>
  );
}