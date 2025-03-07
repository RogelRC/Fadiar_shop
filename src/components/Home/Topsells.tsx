"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

interface Product {
    id: number;
    name: string;
    img: string;
    description: string;
    brand: string;
    model: string;
    sells: number;
    regret: number;
}

const customLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
};

export default function TopSells() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const API = process.env.NEXT_PUBLIC_API;

    useEffect(() => {
        fetch(`${API}/mas_vendidos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ count: 4 }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setProducts(data);
                    setSelectedProduct(data[0] || null);
                } else if (data?.products) {
                    setProducts(data.products);
                    setSelectedProduct(data.products[0] || null);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    if (products.length === 0) {
        return <div className="text-center text-white p-8">Cargando productos...</div>;
    }

    return (
        <div
            className="flex flex-col min-h-screen relative bg-cover bg-center"
            style={{
                backgroundImage: "url('/background.jpeg')",
            }}
        >
            {/* Header */}
            <div className="container mx-auto px-4 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-0">
                    Productos destacados
                </h1>
                <Link
                    href="/products"
                    className="text-white hover:text-blue-300 transition-colors duration-300 flex items-center gap-2 group"
                >
                    Ver más
                    <span className="group-hover:translate-x-1 transition-transform duration-300">&gt;</span>
                </Link>
            </div>

            <div className="container mx-auto px-4 lg:px-8 flex-1 flex flex-col lg:flex-row gap-8 py-8">
                {/* Product List */}
                <div className="w-full lg:w-1/2">
                    <Tabs defaultValue={products[0]?.id.toString()}>
                        <TabsList className="grid grid-cols-1 gap-4 bg-transparent">
                            {products.map((product) => (
                                <TabsTrigger
                                    key={product.id}
                                    value={product.id.toString()}
                                    className={`group relative h-32 lg:h-36 w-full rounded-xl p-4 transition-all duration-300 ${
                                        selectedProduct?.id === product.id
                                            ? "bg-white/20 backdrop-blur-sm"
                                            : "bg-transparent hover:bg-white/10"
                                    }`}
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        setIsExpanded(false);
                                    }}
                                >
                                    <div className="flex items-center justify-between w-full h-full gap-4">
                                        <span
                                            className={`text-lg font-bold ${
                                                selectedProduct?.id === product.id
                                                    ? "text-[#022953]"
                                                    : "text-white"
                                            }`}
                                        >
                                            {product.name}
                                        </span>
                                        <div className="relative w-24 h-24 lg:w-32 lg:h-32">
                                            <Image
                                                loader={customLoader}
                                                src={`https://app.fadiar.com/api/${product.img}`}
                                                alt={product.name}
                                                fill
                                                className="object-contain transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                    </div>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Product Details */}
                {selectedProduct && (
                    <div className="w-full lg:w-1/2 flex flex-col items-center text-white p-4 lg:p-8">
                        <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm">
                            <Image
                                loader={customLoader}
                                src={`https://app.fadiar.com/api/${selectedProduct.img}`}
                                alt={selectedProduct.name}
                                fill
                                className="object-contain p-4"
                            />
                        </div>
                        <h2 className="mt-6 text-2xl lg:text-3xl font-bold text-center">
                            {selectedProduct.name}
                        </h2>
                        <div className="mt-6 w-full relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm lg:text-base">
                                {selectedProduct.description
                                    .replace(/• /g, "\n")
                                    .split('\n')
                                    .filter((line, index) => isExpanded || index < 6)
                                    .map((line, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-2 bg-white/5 rounded-lg p-3 backdrop-blur-sm"
                                        >
                                            <span className="text-blue-300 shrink-0">•</span>
                                            <span className="flex-1">{line}</span>
                                        </div>
                                    ))}
                            </div>

                            {!isExpanded && selectedProduct.description.split('\n').length > 6 && (
                                <button
                                    className="mt-4 w-full text-center text-blue-300 hover:text-blue-400 transition-colors duration-300"
                                    onClick={() => setIsExpanded(true)}
                                >
                                    Mostrar más características
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}