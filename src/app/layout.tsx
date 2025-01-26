import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";

const geistSans = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans"
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-geist-mono"
});

export const metadata: Metadata = {
    title: "Fadiar | Soluciones Industriales",
    description: "Distribuidor líder en herramientas industriales",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="min-h-screen bg-white antialiased">
        <Header />
        <main className="pt-[10vh]">{children}</main>
        </body>
        </html>
    );
}