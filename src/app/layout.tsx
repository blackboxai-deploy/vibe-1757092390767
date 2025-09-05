import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientWrapper } from '@/components/layout/ClientWrapper';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mom's Kitchen Community",
  description: "A warm community where housewives share their daily cooking creations, recipes, and connect with neighbors.",
  keywords: ["cooking", "recipes", "community", "family", "food", "sharing"],
  authors: [{ name: "Mom's Kitchen Community" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#FF7043",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-gradient-to-br from-orange-50 via-white to-orange-50 min-h-screen`}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}