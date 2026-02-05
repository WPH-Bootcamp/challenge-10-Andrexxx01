import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/providers/reduxProvider";
import { QueryProvider } from "@/providers/queryprovider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Blog App Challenge",
  description: "Blog Application Challenge - Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground antialiased">
        <ReduxProvider>
          <QueryProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
