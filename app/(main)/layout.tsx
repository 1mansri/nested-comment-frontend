import { Header } from "@/components/layout/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen px-8 flex flex-col">
      {/* <Header /> */}
      <main className="flex-1 container py-8 px-4 md:px-6 lg:px-8">
        {children}
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>Built with Next.js, Clerk, and Framer Motion</p>
      </footer>
    </div>
  );
}
