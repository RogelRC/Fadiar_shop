import React from "react";
import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

const Carousel = () => {
    const settings = {
        dots: false, // Ocultamos los puntos de navegación
        infinite: true, // Carrusel infinito
        speed: 500, // Velocidad de transición
        slidesToShow: 3, // Cantidad visible por fila (ajústalo según el diseño)
        slidesToScroll: 1, // Cuántas imágenes avanza al desplazarse
        autoplay: true, // Avance automático
        autoplaySpeed: 2000, // Velocidad de desplazamiento automático
        variableWidth: true, // Cada imagen ocupa su ancho natural
        arrows: true, // Mostrar flechas de navegación
    };

    // Lista de imágenes
    const images = [
        { id: 1, src: "/image1.png", alt: "Imagen 1" },
        { id: 2, src: "/image1.png", alt: "Imagen 2" },
        { id: 3, src: "/image1.png", alt: "Imagen 3" },
        { id: 4, src: "/image1.png", alt: "Imagen 4" },
        { id: 5, src: "/image1.png", alt: "Imagen 5" },
        { id: 6, src: "/image1.png", alt: "Imagen 6" },
        { id: 7, src: "/image1.png", alt: "Imagen 7" },
        { id: 8, src: "/image1.png", alt: "Imagen 8" },
        { id: 9, src: "/image1.png", alt: "Imagen 9" },
    ];

    // Dividimos las imágenes en dos filas
    const firstRowImages = images.filter((_, index) => index % 2 === 0);
    const secondRowImages = images.filter((_, index) => index % 2 !== 0);

    return (
        <div style={{ margin: "20px" }}>
            <h2>Two-Row Infinite Carousel</h2>

            {/* Primera fila */}
            <Slider {...settings}>
                {firstRowImages.map((image) => (
                    <div key={image.id}>
                        <Image
                            src={image.src}
                            alt={image.alt}
                            style={{
                                margin: "0 auto",
                                maxWidth: "100%",
                                height: "auto",
                                display: "block",
                            }}
                        />
                    </div>
                ))}
            </Slider>

            {/* Segunda fila */}
            <Slider {...settings}>
                {secondRowImages.map((image) => (
                    <div key={image.id}>
                        <Image
                            src={image.src}
                            alt={image.alt}
                            style={{
                                margin: "0 auto",
                                maxWidth: "100%",
                                height: "auto",
                                display: "block",
                            }}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Carousel;
