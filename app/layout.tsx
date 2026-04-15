import type { Metadata } from "next";
import { Schibsted_Grotesk as SchibstedGroteskFont, Martian_Mono as MartianMonoFont, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const Schibsted_Grotesk = SchibstedGroteskFont({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const Martian_Mono = MartianMonoFont({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "eventplanner",
  description: "the hub for all your event planning needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", Schibsted_Grotesk.variable, Martian_Mono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
