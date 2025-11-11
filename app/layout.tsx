import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
