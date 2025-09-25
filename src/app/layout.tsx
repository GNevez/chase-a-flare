import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chase a Flare",
  description: "Premium eyewear for the bold and adventurous.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt_BR" className="border-border">
      <body
        className={cn(
          geistSans.className,
          "min-h-screen min-w-screen bg-background text-foreground font-poppins antialiased"
        )}
      >
        <Toaster richColors theme="light" />
        <Navbar />
        <div className="">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
