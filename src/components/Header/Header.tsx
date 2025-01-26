"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";

export default function Header() {
    const pathname = usePathname();

    const navLinks = [
        { name: "Inicio", href: "/" },
        { name: "Productos", href: "/productos" },
        { name: "Contacto", href: "/contacto" },
    ];

    return (
        <header className="fixed top-0 w-full bg-black/80 backdrop-blur-md z-50 h-[10vh]">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="relative h-12 w-40 hover:opacity-90 transition-opacity">
                    <Image
                        src="/logo.png"
                        alt="Fadiar Logo"
                        fill
                        priority
                        className="object-contain"
                    />
                </Link>

                {/* Barra de búsqueda */}
                <SearchBar />

                {/* Navegación */}
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