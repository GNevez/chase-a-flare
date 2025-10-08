import React from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"], // '300' é o peso 'light'
  variable: "--font-plus-jakarta-sans", // Cria uma variável CSS para usar no Tailwind
});

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className={plusJakartaSans.className}>{children}</div>;
};

export default Layout;
