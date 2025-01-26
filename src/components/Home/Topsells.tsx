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
}

const customLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
};

export default function Topsells() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("https://app.fadiar.com/api/mas_vendidos", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ count: 4 }),
                });

                const data = await response.json();
                setProducts(data);
                if (data.length > 0) {
                    setSelectedProduct(data[0]);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    // Función para extraer los 6 datos principales de la descripción
    const getProductSpecs = (description: string) => {
        return description.split('\n')
            .filter(line => line.startsWith("- "))
            .map(line => line.replace("- ", "").trim())
            .slice(0, 6);
    };

    return (
        <section className="relative py-20 bg-[url('/background.jpeg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative container mx-auto px-4 z-10">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-4xl font-bold text-white">
                        Productos Destacados
                    </h2>
                    <Link
                        href="/productos"
                        className="text-white hover:text-blue-300 transition-colors"
                    >
                        Ver todos →
                    </Link>
                </div>

                <div className="grid grid-cols-[1fr_2fr] gap-0 border-l border-white/20">
                    <Tabs
                        orientation="vertical"
                        className="h-[600px] border-r border-white/20"
                        defaultValue={products[0]?.id.toString()}
                    >
                        <TabsList className="flex flex-col h-full bg-transparent gap-0 pr-2">
                            {products.map((product, index) => (
                                <TabsTrigger
                                    key={product.id}
                                    value={product.id.toString()}
                                    className="w-full h-32 bg-transparent rounded-none border-b border-white/20
                                    data-[state=active]:bg-white data-[state=active]:text-[#022953]
                                    transition-all group"
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    <div className="flex items-center gap-4 w-full px-4">
                                        <div className="relative h-20 w-20 flex-shrink-0">
                                            <Image
                                                loader={customLoader}
                                                src={`https://app.fadiar.com/api/${product.img}`}
                                                alt={product.name}
                                                fill
                                                className="object-contain"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        </div>
                                        <div className="text-left space-y-1">
                                            <span className="text-lg font-bold block group-data-[state=active]:text-[#022953]">
                                                {product.name}
                                            </span>
                                            <span className="text-sm text-white/80 group-data-[state=active]:text-[#022953]/80">
                                                {product.model}
                                            </span>
                                        </div>
                                    </div>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    {selectedProduct && (
                        <div className="bg-white/5 backdrop-blur-sm p-8 h-[600px] flex flex-col">
                            <div className="grid grid-cols-2 gap-8 flex-grow">
                                <div className="space-y-8">
                                    <div className="relative h-60 w-full">
                                        <Image
                                            loader={customLoader}
                                            src={`https://app.fadiar.com/api/${selectedProduct.img}`}
                                            alt={selectedProduct.name}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/10 rounded-lg">
                                            <p className="text-sm text-white/60">Marca</p>
                                            <p className="text-white font-bold">{selectedProduct.brand}</p>
                                        </div>
                                        <div className="p-4 bg-white/10 rounded-lg">
                                            <p className="text-sm text-white/60">Modelo</p>
                                            <p className="text-white font-bold">{selectedProduct.model}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-bold text-white">
                                            Especificaciones Clave
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            {getProductSpecs(selectedProduct.description).map((spec, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                                                    <p className="text-sm text-white/80">{spec}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-auto p-4 bg-white/10 rounded-lg">
                                        <p className="text-sm text-white/60">Unidades vendidas</p>
                                        <p className="text-3xl font-bold text-blue-400">{selectedProduct.sells}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}