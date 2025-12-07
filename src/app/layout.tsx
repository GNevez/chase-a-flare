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
import Script from "next/script";

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
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-E8YFKPJYB1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E8YFKPJYB1');
          `}
        </Script>
      </head>

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
