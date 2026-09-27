import type { Metadata } from "next";
import { Inter, Teko } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import SmoothScroller from "@/components/SmoothScroller";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const teko = Teko({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-teko" });

export const metadata: Metadata = {
  title: "GeeksForGeeks: Into the Spider-Verse",
  description: "Join the ultimate cinematic superhero event.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${teko.variable} font-sans bg-[#050505] text-white antialiased`}>
        <SmoothScroller />
        <Navigation />
        <main className="relative min-h-screen z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
