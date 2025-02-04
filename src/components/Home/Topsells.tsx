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

    useEffect(() => {
        fetch("https://app.fadiar.com/api/mas_vendidos", {
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
        return <div className="text-center text-white">Cargando productos...</div>;
    }

    return (
        <div
            className="flex flex-col gap-6 w-full h-[90vh] relative"
            style={{
                backgroundImage: "url('/background.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="flex absolute top-[15%] bottom-[5%] left-[50%] w-[1px] bg-white z-50"></div>

            {/* Header */}
            <div className="flex w-full h-[10vh] px-14 pt-2 text-white font-bold">
                <h1 className="flex w-full h-full text-5xl">Productos destacados</h1>
                <Link href="/Products" className="flex w-full h-full justify-end items-center hover:text-blue-300">
                    Ver más {">"}
                </Link>
            </div>

            <div className="flex w-full h-[80vh]">
                {/* Lista de Products */}
                <Tabs defaultValue={products[0]?.id.toString()} className="w-1/2 h-full justify-items-center">
                    <TabsList className="flex flex-col gap-4 w-2/3 h-full bg-transparent">
                        {products.map((product) => (
                            <TabsTrigger
                                key={product.id}
                                value={product.id.toString()}
                                className="flex items-center gap-4 p-2 w-full h-36 group"
                                onClick={() => {
                                    setSelectedProduct(product);
                                    setIsExpanded(false);
                                }}
                            >
                                <div className="flex justify-center w-1/2">
                                    <span className="text-lg font-bold text-white group-data-[state=active]:text-[#022953]">
                                        {product.name}
                                    </span>
                                </div>
                                <div className="relative w-1/2 h-full">
                                    <Image
                                        loader={customLoader}
                                        src={`https://app.fadiar.com/api/${product.img}`}
                                        alt={product.name}
                                        fill
                                        className="rounded-lg object-contain"
                                    />
                                </div>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                {/* Detalle del producto */}
                {selectedProduct && (
                    <div className="w-1/2 flex flex-col items-center text-lg text-white p-8">
                        <div className="relative w-64 h-64 rounded-2xl overflow-hidden">
                            <Image
                                loader={customLoader}
                                src={`https://app.fadiar.com/api/${selectedProduct.img}`}
                                alt={selectedProduct.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h2 className="mt-6 text-2xl font-bold">{selectedProduct.name}</h2>
                        <div className="mt-2 px-14 pt-10 relative w-full">
                            <div className="grid grid-cols-2 gap-x-8 text-left font-bold">
                                {/* Columna izquierda */}
                                <div className="space-y-4">
                                    {selectedProduct.description
                                        .replace(/• /g, "\n")
                                        .split('\n')
                                        .filter((line, index) => isExpanded || index < 6)
                                        .slice(0, Math.ceil((isExpanded ? selectedProduct.description.split('\n').length : 6) / 2))
                                        .map((line, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <span className="text-white shrink-0">•</span>
                                                <span>{line}</span>
                                            </div>
                                        ))}
                                </div>

                                {/* Columna derecha */}
                                <div className="space-y-4">
                                    {selectedProduct.description
                                        .replace(/• /g, "\n")
                                        .split('\n')
                                        .filter((line, index) => isExpanded || index < 6)
                                        .slice(Math.ceil((isExpanded ? selectedProduct.description.split('\n').length : 6) / 2))
                                        .map((line, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <span className="text-white shrink-0">•</span>
                                                <span>{line}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {!isExpanded && selectedProduct.description.split('\n').length > 6 && (
                                <span
                                    className="absolute bottom-0 right-0 cursor-pointer text-blue-300 hover:text-blue-400"
                                    onClick={() => setIsExpanded(true)}
                                >
                                    ...
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}