import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FluxBlink — Pay-per-Second Streaming Protocol | Solana",
  description:
    "Streaming de conteúdo com pagamento por segundo na Solana. Sem assinaturas, sem intermediários. Pague apenas pelo que você assiste.",
  keywords: ["Solana", "streaming", "pay-per-second", "crypto", "blockchain", "Blinks", "DeFi"],
  openGraph: {
    title: "FluxBlink — Pay-per-Second Streaming",
    description: "O futuro da monetização de conteúdo. Pagamento em tempo real na Solana.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#06060a] noise-overlay">
        {children}
      </body>
    </html>
  );
}
