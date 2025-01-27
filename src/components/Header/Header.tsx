"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import SearchBar from "./SearchBar";

export default function Header() {
    const pathname = usePathname();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");
        setIsMobile(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mediaQuery.addEventListener("change", handler);

        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    const navLinks = [
        { name: "Inicio", href: "/" },
        { name: "Productos", href: "/productos" },
    ];

    return (
        <header className="fixed top-0 w-full h-[10vh] z-50 overflow-hidden bg-black">
            <div
                className="absolute inset-0 backdrop-blur-md"
                style={{
                    backgroundImage: "url('/landscape.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(4px)",
                    transform: "scale(1.05)",
                }}
            >
                <div className="absolute inset-0" />
            </div>

            <div className="container mx-auto px-4 h-full flex items-center justify-between relative">
                <Link href="/" className="relative h-full w-40 hover:opacity-90 transition-opacity">
                    <Image
                        src={isMobile ? "/favicon.png" : "/logo.png"}
                        alt="Fadiar Logo"
                        fill
                        priority
                        className="object-contain"
                    />
                </Link>

                <Suspense fallback={<div className="w-full max-w-[500px] h-10 bg-gray-200 animate-pulse" />}>
                    <SearchBar />
                </Suspense>

                <nav className="flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                                pathname === link.href ? "text-blue-400" : "text-white"
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}