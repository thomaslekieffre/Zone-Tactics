import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default:
      "Zone Tactics — Tactiques basketball animées (mobile, partage, audio)",
    template: "%s · Zone Tactics",
  },
  description:
    "Crée et anime tes systèmes de basket sur téléphone ou tablette. Partage par lien (sans compte pour tes joueurs), commentaires audio par séquence. Pour coachs, écoles de basket et créateurs de contenu.",
  keywords: [
    "tactique basketball",
    "playbook basket",
    "schéma basket animé",
    "coach basketball",
    "entraînement basket",
    "tableau tactique",
    "FastDraw alternative",
    "animation tactique",
    "partage tactique WhatsApp",
  ],
  authors: [{ name: "Zone Tactics" }],
  creator: "Zone Tactics",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Zone Tactics",
    title: "Zone Tactics — Tactiques basketball animées",
    description:
      "Le tableau noir numérique pour coachs : dessine, anime, enregistre ta voix, partage en un lien.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zone Tactics — Tactiques basketball animées",
    description:
      "Dessine tes systèmes sur mobile, exporte en vidéo pour les réseaux, partage avec ton équipe.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" theme="system" richColors />
      </body>
    </html>
  );
}
