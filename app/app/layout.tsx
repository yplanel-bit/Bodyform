import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bodyform — Coach Callisthénie",
  description: "Ton coach de callisthénie personnalisé. Programmes adaptés, suivi de progression, sessions intelligentes.",
  manifest: "/manifest.json",
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#080808",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-animated min-h-screen text-white antialiased">
        {children}
      </body>
    </html>
  );
}
