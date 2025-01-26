"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue } from "framer-motion";

interface Product {
    id: number;
    name: string;
    img: string;
    price: number;
    currency: string;
}

export default function Carousel() {
    const [products, setProducts] = useState<Product[]>([]);
    const x = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("https://app.fadiar.com/api/inventory");
                const data = await response.json();
                setProducts(data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts().catch(console.error);
    }, []);

    useEffect(() => {
        if (containerRef.current && products.length > 0) {
            const width = containerRef.current.scrollWidth - containerRef.current.offsetWidth;
            setDragConstraints({ left: -width, right: 0 });
        }
    }, [products]);

    if (products.length === 0) return <div className="h-96 bg-gray-100 animate-pulse" />;

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-[#022953]">
                    Productos Destacados
                </h2>

                <div className="relative overflow-hidden cursor-grab active:cursor-grabbing">
                    <motion.div
                        ref={containerRef}
                        className="flex gap-8"
                        style={{ x }}
                        drag="x"
                        dragConstraints={dragConstraints}
                        dragTransition={{ bounceStiffness: 150, bounceDamping: 30 }}
                    >
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="min-w-[80vw] sm:min-w-[60vw] md:min-w-[40vw] lg:min-w-[30vw] p-4"
                            >
                                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                                    <div className="relative aspect-square mb-6">
                                        <Image
                                            src={`https://app.fadiar.com/api/${product.img}`}
                                            alt={product.name}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 30vw"
                                            priority={product.id === products[0].id}
                                        />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                                    <p className="text-lg font-bold text-[#022953]">
                                        {product.price} {product.currency}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}