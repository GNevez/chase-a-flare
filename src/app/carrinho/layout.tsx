import React from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"], 
  variable: "--font-plus-jakarta-sans", 
});

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className={plusJakartaSans.className}>{children}</div>;
};

export default Layout;
