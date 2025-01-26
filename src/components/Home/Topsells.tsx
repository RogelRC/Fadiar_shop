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
    specs: string[];
}

// Configuración del loader personalizado
const customLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
};

export default function Topsells() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/featured-products");
                const data = await response.json();
                setProducts(data);
                setSelectedProduct(data[0]);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Tabs
                        orientation="vertical"
                        className="h-[600px]"
                        defaultValue={products[0]?.id.toString()}
                    >
                        <TabsList className="flex flex-col h-full bg-transparent gap-4">
                            {products.map((product) => (
                                <TabsTrigger
                                    key={product.id}
                                    value={product.id.toString()}
                                    className="w-full h-32 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all"
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="relative h-20 w-20">
                                            <Image
                                                loader={customLoader}
                                                src={product.img}
                                                alt={product.name}
                                                fill
                                                className="object-contain"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        </div>
                                        <span className="text-lg font-semibold text-white">
                                            {product.name}
                                        </span>
                                    </div>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    {selectedProduct && (
                        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
                            <div className="relative h-96 w-full">
                                <Image
                                    loader={customLoader}
                                    src={selectedProduct.img}
                                    alt={selectedProduct.name}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                            <div className="mt-8 text-white">
                                <h3 className="text-2xl font-bold mb-4">
                                    {selectedProduct.name}
                                </h3>
                                <p className="mb-4">{selectedProduct.description}</p>
                                <ul className="list-disc pl-6">
                                    {selectedProduct.specs.map((spec, index) => (
                                        <li key={index}>{spec}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}