import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Questathon Live CRM | Executive Decision Support",
  description: "Production-grade, evidence-backed CRM intelligence for Eastern Counties Police Alliance & Aldermoor Industrial Group.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-parchment text-ink flex flex-col antialiased selection:bg-pixelYellow selection:text-ink">
        {children}
      </body>
    </html>
  );
}
