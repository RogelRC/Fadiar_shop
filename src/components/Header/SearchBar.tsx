"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="relative flex w-full max-w-[500px] items-center">
            <Input
                type="text"
                placeholder="Buscar productos..."
                className="bg-transparent border-b border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-blue-500 pr-10 text-white placeholder:text-gray-400"
            />
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:bg-transparent hover:text-white"
            >
                <Search className="h-5 w-5" />
            </Button>
        </div>
    );
}