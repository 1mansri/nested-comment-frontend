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
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>@CoHub, Built with Next.js, Clerk, Motia.dev, Shadcn UI and Framer Motion</p>
      </footer>
    </div>
  );
}
