"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-[#022953]">Productos destacados</h1>
                    <Link
                        href="/products"
                        className="text-[#022953] hover:text-blue-500 transition-colors duration-300"
                    >
                        Ver más
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Product List */}
                    <div className="w-full lg:w-1/2">
                        <Tabs defaultValue={products[0]?.id.toString()} className="w-full">
                            <TabsList className="grid grid-cols-1 gap-6 bg-transparent">
                                {products.map((product) => (
                                    <TabsTrigger
                                        key={product.id}
                                        value={product.id.toString()}
                                        className={`bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 ease-in-out hover:scale-110 flex flex-col h-full transform-gpu ${
                                            selectedProduct?.id === product.id ? "border-2 border-[#022953]" : ""
                                        }`}
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setIsExpanded(false);
                                        }}
                                    >
                                        <div className="relative h-48 w-full">
                                            <Image
                                                loader={customLoader}
                                                src={`https://app.fadiar.com/api/${product.img}`}
                                                alt={product.name}
                                                layout="fill"
                                                objectFit="cover"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        </div>
                                        <div className="p-4 flex flex-col flex-1">
                                            <div className="mb-2">
                                                <h3 className="text-xl font-semibold text-[#022953]">{product.name}</h3>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">{product.brand}</span>
                                                    <span className="text-sm text-gray-500">{product.model}</span>
                                                </div>
                                            </div>
                                            <div className="mt-auto">
                                                <button
                                                    className="px-3 py-1 bg-[#022953] text-white rounded hover:bg-[#011a3a] text-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedProduct(product);
                                                        setIsExpanded(false);
                                                    }}
                                                >
                                                    Ver detalles
                                                </button>
                                            </div>
                                        </div>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Product Details */}
                    <AnimatePresence mode="wait">
                        {selectedProduct && (
                            <motion.div
                                key={selectedProduct.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full lg:w-1/2 flex flex-col items-center p-6 bg-white rounded-xl shadow-md"
                            >
                                <div className="relative w-full max-w-xs h-48 rounded-xl overflow-hidden">
                                    <Image
                                        loader={customLoader}
                                        src={`https://app.fadiar.com/api/${selectedProduct.img}`}
                                        alt={selectedProduct.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h2 className="mt-6 text-xl font-semibold text-[#022953] text-center">
                                    {selectedProduct.name}
                                </h2>
                                <div className="mt-4 w-full">
                                    {(() => {
                                        const descriptionLines = selectedProduct.description
                                            .replace(/• /g, "\n")
                                            .split("\n")
                                            .filter((line) => line.trim() !== "");
                                        return (
                                            <>
                                                <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
                                                    {descriptionLines
                                                        .slice(0, isExpanded ? descriptionLines.length : 6)
                                                        .map((line, index) => (
                                                            <div key={index} className="flex items-start gap-2">
                                                                <span className="text-[#022953]">•</span>
                                                                <span>{line}</span>
                                                            </div>
                                                        ))}
                                                </div>
                                                {!isExpanded && descriptionLines.length > 6 && (
                                                    <button
                                                        className="mt-4 w-full px-3 py-1 bg-[#022953] text-white rounded hover:bg-[#011a3a] text-sm"
                                                        onClick={() => setIsExpanded(true)}
                                                    >
                                                        Mostrar más características
                                                    </button>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}