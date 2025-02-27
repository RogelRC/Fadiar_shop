"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Suspense, useState, useEffect, useRef } from "react";
import SearchBar from "./SearchBar";
import { Menu } from "lucide-react";

export default function Header() {
    const pathname = usePathname();
    const [isMobile, setIsMobile] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Verificar estado de autenticación al cargar
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        setIsLoggedIn(!!token);
    }, []);

    // Detectar tamaño de pantalla
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");
        setIsMobile(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mediaQuery.addEventListener("change", handler);

        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    // Detectar clics fuera del menú para cerrarlo
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

    // Manejar cierre de sesión
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        setIsLoggedIn(false);
        setIsMenuOpen(false);
        window.location.href = "/";
    };

    // Enlaces de navegación
    const navLinks = [
        { name: "Inicio", href: "/" },
        { name: "Productos", href: "/products" },
        { name: "Mi Cuenta", href: "/account", authOnly: true },
        { name: "Mis Pedidos", href: "/orders", authOnly: true },
    ];

    // Filtrar enlaces según autenticación
    const filteredLinks = navLinks.filter(
        (link) => !link.authOnly || (link.authOnly && isLoggedIn)
    );

    return (
        <header className="fixed top-0 w-full h-[10vh] min-h-[80px] z-50 bg-black">
            {/* Fondo con efecto blur */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute inset-0 backdrop-blur-md"
                    style={{
                        backgroundImage: "url('/landscape.webp')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: "blur(4px)",
                        transform: "scale(1.05)",
                    }}
                />
                <div className="absolute inset-0" />
            </div>

            {/* Contenido del header */}
            <div className="container mx-auto px-4 h-full flex items-center justify-between relative">
                {/* Logo */}
                <Link
                    href="/"
                    className={`relative h-full ${
                        isMobile ? "w-[70px]" : "w-36"
                    } hover:opacity-90 transition-opacity`}
                >
                    <Image
                        src={isMobile ? "/favicon.png" : "/logo.png"}
                        alt="Fadiar Logo"
                        fill
                        priority
                        className="object-contain"
                    />
                </Link>

                {/* Barra de búsqueda */}
                <Suspense
                    fallback={
                        <div className="w-full max-w-[500px] h-10 bg-gray-200 animate-pulse" />
                    }
                >
                    <SearchBar />
                </Suspense>

                {/* Menú de navegación */}
                <div className="relative ml-4" ref={menuRef}>
                    {isMobile ? (
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white focus:outline-none"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    ) : (
                        <nav className="flex items-center gap-6">
                            {filteredLinks.map((link) => (
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
                            {!isLoggedIn ? (
                                <Link
                                    href="/login"
                                    className="bg-white text-[#022953] px-8 py-3 rounded-lg hover:bg-[#011a3a] hover:text-white transition-colors"
                                >
                                    Autenticarse
                                </Link>
                            ) : (
                                <div className="relative group">
                                    <button className="flex items-center gap-2 text-white">
                                        <img
                                            src="/user-avatar.png"
                                            className="h-8 w-8 rounded-full"
                                            alt="Perfil de usuario"
                                        />
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg hidden group-hover:block">
                                        <Link
                                            href="/account"
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                        >
                                            Mi Cuenta
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </div>
                            )}
                        </nav>
                    )}

                    {/* Menú desplegable móvil */}
                    {isMenuOpen && isMobile && (
                        <div className="absolute top-10 right-0 mt-2 w-40 bg-black rounded-lg shadow-lg z-50">
                            {filteredLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block px-4 py-2 text-white hover:bg-gray-800"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {isLoggedIn ? (
                                <button
                                    onClick={handleLogout}
                                    className="block w-full px-4 py-2 text-white hover:bg-gray-800 text-left"
                                >
                                    Cerrar Sesión
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className="block px-4 py-2 text-white hover:bg-gray-800"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Autenticarse
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}