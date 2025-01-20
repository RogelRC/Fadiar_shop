"use client"

import * as React from "react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

function Slider() {
    // Estado para almacenar las imágenes
    const [images, setImages] = React.useState([]);

    // Hacer la petición al cargar el componente
    React.useEffect(() => {
        fetch("https://app.fadiar.com/api/inventory")
            .then(response => response.json())  // Convertir la respuesta en JSON
            .then(data => {
                const imageUrls = data.products.map(product => {
                    return "https://app.fadiar.com/api/" + product.img;  // Concatenar la base de la URL con la imagen
                });
                setImages(imageUrls);  // Establecer las URLs de las imágenes en el estado
            })
            .catch(error => {
                console.error('Error fetching data:', error);  // Manejar errores
            });
    }, []);  // Solo se ejecuta una vez, cuando el componente se monta

    return (
        <div className="flex justify-center items-center w-[100vw] h-[100vh] pt-20">
            <Carousel
                opts={{
                    loop: true,
                }}
                className="flex justify-items-center"
            >
                <CarouselContent className="flex-1 w-[80vw]">
                    {images.map((image, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <div className="flex-1">
                                <Card className="border-0">
                                    <CardContent className="p-0 flex items-center justify-center h-[70vh]">
                                        <div className="relative w-full h-full"> {/* Ajusta el tamaño aquí */}
                                            <Image
                                                loader={() => image}
                                                src={image}
                                                alt={`Image ${index}`}
                                                layout="fill"
                                                objectFit="contain"
                                                className="rounded-md"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}

export default Slider;
