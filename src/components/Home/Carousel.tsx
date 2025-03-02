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

type GridSpan = {
    rows: number;
    cols: number;
};

const API = process.env.NEXT_PUBLIC_API;

const spanVariants: GridSpan[] = [
    { rows: 2, cols: 2 }, // 2x2
    { rows: 2, cols: 3 }, // 2x3 (antes era 2x4)
    { rows: 4, cols: 2 }, // 4x2 (cuando es 4x2 la imagen va arriba y el texto abajo)
    { rows: 4, cols: 3 }, // 4x3
];

const getRandomBackground = () => {
    const colors = ["#E8EEEE", "#F5F5F5", "#C7D6E7"];
    return colors[Math.floor(Math.random() * colors.length)];
};


export default function Carousel() {
    const [products, setProducts] = useState<Product[]>([]);
    const x = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [clonedProducts, setClonedProducts] = useState<Product[]>([]);
    const [spans, setSpans] = useState<GridSpan[]>([]);
    const [backgrounds, setBackgrounds] = useState<string[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API}/inventory`);
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
            const newSpans = [];
            const newBackgrounds = [];
            const cloned = [...products, ...products, ...products];

            let rowCounter = 0;
            for (let i = 0; i < cloned.length; i++) {
                let availableSpans;

                if (rowCounter === 0) {
                    availableSpans = spanVariants;
                } else {
                    const remainingRows = 4 - rowCounter;
                    availableSpans = spanVariants.filter((s) => s.rows <= remainingRows);
                }

                if (availableSpans.length === 0) {
                    availableSpans = spanVariants;
                    rowCounter = 0;
                }

                const variant = availableSpans[Math.floor(Math.random() * availableSpans.length)];
                newSpans.push(variant);
                newBackgrounds.push(getRandomBackground());
                rowCounter += variant.rows;

                if (rowCounter >= 4) rowCounter = 0;
            }

            setSpans(newSpans);
            setBackgrounds(newBackgrounds);
            setClonedProducts(cloned);
        }
    }, [products]);

    const handleDragEnd = (
        _e: PointerEvent,
        { offset, velocity }: { offset: { x: number }; velocity: { x: number } }
    ) => {
        const newX = x.get() + offset.x;
        const containerWidth = containerRef.current?.offsetWidth || 0;
        const totalWidth = containerRef.current?.scrollWidth || 0;
        const targetX = newX + velocity.x * 50;

        animate(x, targetX, {
            type: "inertia",
            power: 0.8,
            timeConstant: 200,
            bounceStiffness: 500,
            bounceDamping: 50,
            onComplete: () => {
                const currentX = x.get();
                const wrappedX = ((currentX % totalWidth) + totalWidth) % totalWidth;
                x.set(wrappedX - totalWidth);
            },
        });
    };

    if (products.length === 0) return <div className="h-[80vh] bg-gray-100 animate-pulse" />;

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="relative overflow-hidden cursor-grab active:cursor-grabbing">
                    <motion.div
                        ref={containerRef}
                        className="grid grid-flow-col auto-cols-[15vw] gap-4"
                        style={{
                            x,
                            gridTemplateRows: "repeat(4, 20vh)",
                        }}
                        drag="x"
                        dragElastic={0.2}
                        dragMomentum={true}
                        onDragEnd={handleDragEnd}
                        dragTransition={{ power: 0.1, timeConstant: 200 }}
                    >
                        {clonedProducts.map((product, index) => {
                            const span = spans[index] || { rows: 2, cols: 2 };
                            const is4x2 = span.rows === 4 && span.cols === 2;

                            return (
                                <div
                                    key={`${product.id}-${index}`}
                                    className="rounded-xl p-4 hover:shadow-lg transition-shadow"
                                    style={{
                                        gridRow: `span ${span.rows}`,
                                        gridColumn: `span ${span.cols}`,
                                        backgroundColor: backgrounds[index],
                                    }}
                                >
                                    <div className="w-full h-full flex flex-col">
                                        <div className={`relative flex-1 ${is4x2 ? "order-1" : ""}`}>
                                            <Image
                                                src={`https://app.fadiar.com/api/${product.img}`}
                                                alt={product.name}
                                                fill
                                                className="object-cover rounded-lg pointer-events-none"
                                                sizes="(max-width: 768px) 30vw, 20vw"
                                                priority={index < 6}
                                            />
                                        </div>
                                        <div className={`mt-4 ${is4x2 ? "order-2" : ""}`}>
                                            <h3 className="font-semibold text-gray-800 text-xl">{product.name}</h3>
                                            <p className="font-bold text-[#022953] text-lg">
                                                {product.price} {product.currency}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
