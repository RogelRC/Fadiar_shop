"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const images = [
    "/image1.png",
    "/image2.png",
    "/image3.png",
];

export default function Slideshow() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[90vh] overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={images[currentIndex]}
                        alt={`Slide ${currentIndex + 1}`}
                        fill
                        priority
                        className="object-cover"
                        sizes="100vw"
                    />
                </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-8 left-8 text-white z-10">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">CATÁLOGO</h1>

                <div className="flex gap-2">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                                currentIndex === idx ? "bg-white" : "bg-gray-400"
                            }`}
                            aria-label={`Ir a slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>

            <div className="absolute bottom-8 right-8 flex gap-4 z-10">
                <NavArrow direction="left" onClick={() => setCurrentIndex(prev => (prev - 1 + images.length) % images.length)} />
                <NavArrow direction="right" onClick={() => setCurrentIndex(prev => (prev + 1) % images.length)} />
            </div>
        </div>
    );
}

function NavArrow({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label={`Slide ${direction === "left" ? "anterior" : "siguiente"}`}
        >
            <Image
                src="/Iconos-06.svg"
                alt=""
                width={40}
                height={40}
                className={direction === "left" ? "rotate-180" : ""}
            />
        </button>
    );
}