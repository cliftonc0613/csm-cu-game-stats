import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { PageTransition } from "@/components/layout/PageTransition";

export const metadata: Metadata = {
  title: "Clemson Sports Statistics",
  description: "Comprehensive Clemson Tigers athletics statistics and game data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex min-h-screen flex-col" suppressHydrationWarning>
        <Header />
        <ErrorBoundary>
          <main className="flex-1">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </ErrorBoundary>
        <Footer />
      </body>
    </html>
  );
}
