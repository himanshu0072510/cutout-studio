import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cutout Studio — Free background remover & photo editor",
  description:
    "Remove backgrounds, replace them, crop, adjust, and export — free, private, runs in your browser. No upload, no signup.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Cutout Studio",
    description: "Free, private background remover & photo editor that runs in your browser.",
    type: "website",
    images: ["/icon.svg"],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
        {children}
      </body>
    </html>
  );
}
