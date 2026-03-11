import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "qhumaOS — La plataforma educativa del futuro",
  description: "El primer sistema operativo educativo con IA adaptativa, aprendizaje por proyectos y mentoría personalizada. Alineado con la LOMLOE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased font-sans`}>
        <LangProvider>
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
