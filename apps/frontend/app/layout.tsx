import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ToastProvider } from "./components/ui/Toast";
import Header from "./components/Header/Header";
import { AuthProvider } from "./components/auth/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Store",
  description: "Modern store application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          "antialiased min-h-screen bg-background text-text",
        ].join(" ")}
      >
        <AuthProvider>
        <ToastProvider>
          <Header />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
        </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
