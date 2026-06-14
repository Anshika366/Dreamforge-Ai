import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AchievementTracker from "@/components/AchievementTracker";

export const metadata: Metadata = {
  title: "DreamForge AI - Convert Business Documents Into Adventures",
  description: "Upload business documents, specifications, or code files and watch them transform into interactive fantasy worlds complete with characters, quests, and boss encounters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-white">
        <div className="radial-bg" />
        <AchievementTracker />
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

