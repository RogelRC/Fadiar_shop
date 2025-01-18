"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

function Slideshow() {
    const images = [
        "/image1.png",
        "/image2.png",
        "/image3.png",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 6000); // Cambiar imagen cada 6 segundos

        return () => clearInterval(interval);
    }, [images.length]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    return (
        <div className="flex relative w-full h-[90vh]"> {/* Ajusta la altura según el header */}
            {/* Contenedor de imágenes */}
            <div
                className="flex transition-transform duration-700 ease-in-out w-full h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((src, index) => (
                    <div key={index} className="flex-shrink-0 w-full h-full relative">
                        <Image
                            src={src}
                            alt={`Slide ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                ))}
            </div>

            {/* Texto "CATÁLOGO" */}
            <div className="absolute bottom-10 left-4 m-5 text-white text-2xl font-bold md:text-5xl">
                CATÁLOGO
                {/* Indicadores */}
                <div className="flex gap-2 mt-2">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-gray-400'}`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Flechas de navegación */}
            <div className="absolute bottom-10 right-4 flex gap-4 m-5">
                <button className="text-white text-2xl" onClick={goToPrevious}>
                    <Image src="/Iconos-06.svg" alt="Anterior" width={50} height={50} className="-scale-x-100"/>
                </button>
                <button className="text-white text-2xl" onClick={goToNext}>
                    <Image src="/Iconos-06.svg" alt="Anterior" width={50} height={50}/>
                </button>
            </div>
        </div>
    );
}

export default Slideshow;
