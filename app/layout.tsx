import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Defesa de TCC // 2026 — Ronilson Candido",
  description:
    "Convite para a defesa do TCC sobre modelagem e análise formal do protocolo de autenticação EDHOC utilizando o Tamarin Prover.",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050a08",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
