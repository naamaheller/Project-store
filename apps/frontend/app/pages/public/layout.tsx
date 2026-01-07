import Header from "@/app/components/Header/Header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="pt-8">{children}</main>
    </div>
  );
}
