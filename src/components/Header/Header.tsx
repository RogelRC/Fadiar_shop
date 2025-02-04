"use client";

import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {Suspense, useState, useEffect} from "react";
import SearchBar from "./SearchBar";
import {Menu} from "lucide-react";

export default function Header() {
    const pathname = usePathname();
    const [isMobile, setIsMobile] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");
        setIsMobile(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mediaQuery.addEventListener("change", handler);

        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    const navLinks = [
        {name: "Inicio", href: "/"},
        {name: "Productos", href: "/Products"},
    ];

    return (
        <header className="fixed top-0 w-full h-[10vh] z-50 bg-black">
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
                <div className="absolute inset-0"/>
            </div>

            <div className="container mx-auto px-4 h-full flex items-center justify-between relative">
                <Link href="/"
                      className={`relative h-full ${isMobile ? "w-[70px]" : "w-40"} hover:opacity-90 transition-opacity`}>
                    <Image
                        src={isMobile ? "/favicon.png" : "/logo.png"}
                        alt="Fadiar Logo"
                        fill
                        priority
                        className="object-contain"
                    />
                </Link>

                <Suspense fallback={<div className="w-full max-w-[500px] h-10 bg-gray-200 animate-pulse"/>}>
                    <SearchBar/>
                </Suspense>

                {/* Menú de navegación */}
                <div className="relative ml-4"> {/* Espaciado agregado */}
                    {isMobile ? (
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white focus:outline-none"
                        >
                            {/* Icono de menú hamburguesa */}
                            <Menu
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            />
                        </button>
                    ) : (
                        <nav className="flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm text-white transition-colors hover:text-blue-400 ${
                                        pathname === link.href ? "font-extrabold" : ""
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    )}

                    {/* Menú desplegable */}
                    {isMenuOpen && isMobile && (
                        <div className="absolute top-10 right-0 mt-2 w-40 bg-black rounded-lg shadow-lg z-50">
                            {/* Ajuste de z-index para evitar que se esconda */}
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block px-4 py-2 text-white hover:bg-gray-800"
                                    onClick={() => setIsMenuOpen(false)} // Cierra el menú al hacer clic
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
