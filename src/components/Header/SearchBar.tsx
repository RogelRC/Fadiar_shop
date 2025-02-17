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
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 640px)");
        setIsMobile(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mediaQuery.addEventListener("change", handler);

        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    const debouncedSearch = useMemo(
        () =>
            debounce((query: string) => {
                const params = new URLSearchParams(searchParams?.toString() || "");

                if (query) {
                    params.set("search", query);
                } else {
                    params.delete("search");
                }

                if (!pathname.startsWith("/products")) {
                    router.push(`/products?${params.toString()}`);
                } else {
                    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                }

                window.dispatchEvent(new CustomEvent('searchUpdate'));
            }, 5),
        [pathname, searchParams, router]
    );

    useEffect(() => {
        setSearchQuery(searchParams?.get("search") || "");
        return () => debouncedSearch.cancel();
    }, [searchParams, debouncedSearch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    return (
        <div className="relative flex w-full max-w-[500px] items-center">
            <Input
                type="text"
                placeholder={isMobile ? "" : "Buscar productos..."}
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
                    placeholder:text-white
                    outline-none
                    focus:outline-none
                    focus-visible:outline-none
                    shadow-none
                    ring-offset-0
                "
            />
            <Search className="h-5 w-5 absolute right-0 text-white" />
        </div>
    );
}