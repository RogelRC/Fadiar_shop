// app/components/SearchBar.tsx
"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { debounce } from "lodash";

export default function SearchBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "");

    // Debounce memoizado con useMemo
    const debouncedSearch = useMemo(
        () =>
            debounce((query: string) => {
                // Crear una copia local de searchParams
                const params = new URLSearchParams(searchParams?.toString() || "");

                if (query) {
                    params.set("search", query);
                } else {
                    params.delete("search");
                }

                if (!pathname.startsWith("/productos")) {
                    router.push(`/productos?${params.toString()}`);
                } else {
                    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                }
            }, 500), // Reducimos el tiempo a 1000ms
        [pathname, searchParams, router]
    );

    useEffect(() => {
        // Sincroniza el input con los parámetros de la URL
        setSearchQuery(searchParams?.get("search") || "");

        // Cancela el debounce al desmontar el componente
        return () => debouncedSearch.cancel();
    }, [searchParams, debouncedSearch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value); // Actualización inmediata del estado
        debouncedSearch(value); // Llamada debounce para la navegación
    };

    return (
        <div className="relative flex w-full max-w-[500px] items-center">
            <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={handleInputChange}
                className="
                    bg-transparent
                    border-0
                    border-b-2
                    border-b-gray-300
                    rounded-none
                    focus:ring-0
                    focus:border-b-blue-500
                    focus-visible:ring-0
                    focus-visible:border-b-blue-500
                    pr-10
                    text-white
                    placeholder:text-gray-400
                    outline-none
                    focus:outline-none
                    focus-visible:outline-none
                    shadow-none
                    ring-offset-0
                "
            />
            <Search className="h-5 w-5 absolute right-0 text-gray-400" />
        </div>
    );
}
