import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/hooks/useCart";
import Heartbeat from "@/components/Heartbeat";
import { TopBar } from "@/components/TopBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
        <CartProvider>
          <Toaster richColors theme="light" />
          <Heartbeat />

          <Navbar />
          <div className="">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
