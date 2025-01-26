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

    const parseDescription = (description: string) => {
        return description.split('\n')
            .filter(line => line.startsWith("- "))
            .map(line => line.replace("- ", "").trim());
    };

    return (
        <section className="relative h-screen bg-[url('/background.jpeg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative h-full flex flex-col">
                <div className="container mx-auto px-4 flex-grow flex flex-col">
                    {/* Header */}
                    <div className="py-8 flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-white">Productos</h1>
                        <Link href="/productos" className="text-white/80 hover:text-white transition-colors">
                            Ver más →
                        </Link>
                    </div>

                    {/* Contenido principal */}
                    <div className="flex-grow grid lg:grid-cols-[300px_1fr] gap-8 pb-8">
                        {/* Lista de productos */}
                        <div className="overflow-y-auto pr-4">
                            <Tabs orientation="vertical" defaultValue={products[0]?.id.toString()}>
                                <TabsList className="flex flex-col bg-transparent gap-2">
                                    {products.map((product) => (
                                        <TabsTrigger
                                            key={product.id}
                                            value={product.id.toString()}
                                            className="w-full p-4 text-left bg-white/5 rounded-lg
                                            data-[state=active]:bg-white data-[state=active]:text-[#022953]
                                            hover:bg-white/10 transition-all border border-white/10"
                                            onClick={() => setSelectedProduct(product)}
                                        >
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-sm text-white/60 mt-1">{product.model}</p>
                                            </div>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* Detalles del producto */}
                        {selectedProduct && (
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 flex flex-col h-[calc(100vh-200px)]">
                                <div className="flex-grow overflow-y-auto">
                                    {/* Encabezado */}
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold text-white">{selectedProduct.name}</h2>
                                        <p className="text-white/60">{selectedProduct.model}</p>
                                    </div>

                                    {/* Contenido */}
                                    <div className="grid lg:grid-cols-2 gap-8">
                                        {/* Imagen */}
                                        <div className="relative h-64">
                                            <Image
                                                loader={customLoader}
                                                src={`https://app.fadiar.com/api/${selectedProduct.img}`}
                                                alt={selectedProduct.name}
                                                fill
                                                className="object-contain"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        </div>

                                        {/* Especificaciones */}
                                        <div className="space-y-6">
                                            <div className="bg-white/10 p-6 rounded-lg">
                                                <h3 className="text-lg font-semibold text-white mb-4">Propiedades</h3>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {parseDescription(selectedProduct.description)
                                                        .slice(0, 6)
                                                        .map((spec, index) => (
                                                            <div key={index} className="flex items-start gap-3">
                                                                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                                                                <p className="text-sm text-white/80">{spec}</p>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>

                                            {/* Detalles técnicos */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white/10 p-4 rounded-lg">
                                                    <p className="text-sm text-white/60 mb-1">Marca</p>
                                                    <p className="text-white font-medium">{selectedProduct.brand}</p>
                                                </div>
                                                <div className="bg-white/10 p-4 rounded-lg">
                                                    <p className="text-sm text-white/60 mb-1">Vendidos</p>
                                                    <p className="text-white font-medium">{selectedProduct.sells}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}