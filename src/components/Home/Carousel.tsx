"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, animate } from "framer-motion";

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
    const [itemWidth, setItemWidth] = useState(0);
    const [clonedProducts, setClonedProducts] = useState<Product[]>([]);
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
        if (products.length > 0) {
            setClonedProducts([...products, ...products, ...products]);
        }
    }, [products]);

    useEffect(() => {
        if (containerRef.current && products.length > 0) {
            const containerWidth = containerRef.current.offsetWidth;
            const itemCount = containerWidth / (window.innerWidth * 0.8);
            setItemWidth(containerWidth / itemCount);
        }
    }, [products]);

    const handleDragEnd = (_e: PointerEvent, { offset, velocity }: { offset: { x: number }; velocity: { x: number } }) => {
        const newX = x.get() + offset.x;
        const totalWidth = products.length * itemWidth;
        const targetX = newX + velocity.x * 50; // Aumentamos el impulso

        animate(x, targetX, {
            type: "inertia",
            power: 0.8, // Más impulso
            timeConstant: 200,
            bounceStiffness: 500,
            bounceDamping: 50,
            onComplete: () => {
                const currentX = x.get();
                const wrappedX = ((currentX % totalWidth) + totalWidth) % totalWidth;
                x.set(wrappedX - totalWidth);
            }
        });
    };

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
                        dragElastic={0.2} // Elasticidad reducida para mejor control
                        dragMomentum={true} // Habilitar momentum
                        onDragEnd={handleDragEnd}
                        dragTransition={{ power: 0.1, timeConstant: 200 }} // Transición más fluida
                    >
                        {clonedProducts.map((product, index) => (
                            <div
                                key={`${product.id}-${index}`}
                                className="min-w-[80vw] sm:min-w-[60vw] md:min-w-[40vw] lg:min-w-[30vw] p-4"
                            >
                                <div
                                    className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                                    onPointerDown={(e) => e.stopPropagation()} // Evitar arrastre en contenido
                                >
                                    <div
                                        className="relative aspect-square mb-6 touch-pan-y" // Permitir scroll vertical
                                        style={{ touchAction: 'pan-y' }} // Prioridad para scroll vertical
                                    >
                                        <Image
                                            src={`https://app.fadiar.com/api/${product.img}`}
                                            alt={product.name}
                                            fill
                                            className="object-contain pointer-events-none" // Deshabilitar interacciones
                                            sizes="(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 30vw"
                                            priority={index < 3}
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