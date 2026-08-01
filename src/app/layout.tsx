import type { Metadata } from "next";
import "./globals.css";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { AudioControl } from "@/components/ui/AudioControl";

export const metadata: Metadata = {
  title: "Tanish Soni | Cinematic Interactive Portfolio",
  description: "AI Engineer, Full Stack Developer, Hackathon Builder, and Product Builder.",
  openGraph: {
    title: "Tanish Soni | Cinematic Interactive Portfolio",
    description: "An interactive cinematic web experience of Tanish Soni's engineering journey.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-background text-text-primary antialiased selection:bg-accent-blue selection:text-black">
        <CustomCursor />
        <AudioControl />
        <main className="relative min-h-screen w-full overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
