import type { Metadata } from "next";
import { Schibsted_Grotesk as SchibstedGroteskFont, Martian_Mono as MartianMonoFont, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LightRays from '@/components/LightRays';
import Navbar from "@/components/Navbar";
import { PostHogProvider } from "@/components/PostHogProvider";

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
  title: "EventPlanner",
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
  < Navbar />
<div className="absolute inset-0 -z-10 min-h-screen">
  <LightRays
    raysOrigin="top-center-offset"
    raysColor="#ffffff"
    raysSpeed={1}
    lightSpread={0.8}
    rayLength={3}
    followMouse={true}
    mouseInfluence={0.1}
    noiseAmount={0}
    distortion={0}
    className="custom-rays"
    pulsating={false}
    fadeDistance={1}
    saturation={1}
  />
</div>
      <body className="min-h-full flex flex-col">
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}