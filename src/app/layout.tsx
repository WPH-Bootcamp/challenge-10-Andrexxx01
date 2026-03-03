import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/providers/reduxProvider";
import { QueryProvider } from "@/providers/queryprovider";

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
            {children}
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
