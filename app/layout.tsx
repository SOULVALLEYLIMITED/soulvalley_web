import localFont  from "next/font/local";
import "./globals.css";
import type { Metadata } from "next";

const satoshi = localFont({
  src: "../public/fonts/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Variable.woff",
  variable: "--font-heading",
  weight: "100 900",
  display: "swap",
});

const dmSans = localFont({
  src: "../public/fonts/DMSans-VariableFont_opsz,wght.ttf",
  variable: "--font-body",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Soul Valley",
  description: "Building The Solution For Today.",
  icons: {
    icon: "/images/avatar_logo.png",  // ✅ No "/public" prefix
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body
        className="min-h-full"
      >
        {children}
      </body>
    </html>
  );
}