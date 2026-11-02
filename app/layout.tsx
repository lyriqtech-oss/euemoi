import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Eu e Moi — Natália Mello",
    template: "%s | Eu e Moi",
  },
  description: "Portfólio literário e espaço de escritos de Natália Mello. Contos, crônicas e poesias que buscam traduzir o silêncio e o que permanece.",
  keywords: ["Natália Mello", "Eu e Moi", "Contos", "Crônicas", "Poesias", "Literatura", "Escritora brasileira"],
  authors: [{ name: "Natália Mello" }],
  openGraph: {
    title: "Eu e Moi — Natália Mello",
    description: "Portfólio literário e escritos de Natália Mello.",
    url: "https://euemoi.vercel.app",
    siteName: "Eu e Moi",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eu e Moi — Natália Mello",
    description: "Portfólio literário e escritos de Natália Mello.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${ebGaramond.variable} ${inter.variable}`}>
      <body className="antialiased selection:bg-accent-red/20 selection:text-accent-red">
        {children}
      </body>
    </html>
  );
}
