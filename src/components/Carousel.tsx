"use client"

import * as React from "react";
import Image from "next/image";

import {Card, CardContent} from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

// Definir el tipo para los productos
interface Product {
    img: string;
    id: number;
    brand: string;
    carrito: number;
    commissions: [number, number, string][];
    count: number;
    description: string;
    model: string;
    name: string;
    onWait: number;
    prices: [number, number, string][];
    regret: number;
}

function Slider() {
    // Estado para almacenar las imágenes (ahora es un array de strings)
    const [images, setImages] = React.useState<string[]>([]);

    // Hacer la petición al cargar el componente
    React.useEffect(() => {
        fetch("https://app.fadiar.com/api/inventory")
            .then(response => response.json())  // Convertir la respuesta en JSON
            .then((data: { products: Product[] }) => {
                const imageUrls = data.products.map((product: Product) => {
                    return "https://app.fadiar.com/api/" + product.img;  // Concatenar la base de la URL con la imagen
                });
                setImages(imageUrls);  // Establecer las URLs de las imágenes en el estado
            })
            .catch(error => {
                console.error('Error fetching data:', error);  // Manejar errores
            });
    }, []);  // Solo se ejecuta una vez, cuando el componente se monta

    return (
        <div className="flex justify-center w-[100vw] h-[90vh] items-center bg-[#F3F4F6]">
            <Carousel
                opts={{
                    loop: true,
                    dragFree: true
                }}
                className="flex"
            >
                <CarouselContent className="flex-1 w-[80vw] h-full">
                    {images.map((image, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <div className="flex-1">
                                <Card className="border-0">
                                    <CardContent className="p-0 flex h-[75vh] flex-col">
                                        <div className="relative w-full h-4/5"> {/* Ajusta el tamaño aquí */}
                                            <Image
                                                loader={() => image}  // Usar el loader para especificar la URL
                                                src={image}
                                                alt={`Image ${index}`}
                                                layout="fill"
                                                objectFit="contain"
                                                className="rounded-md"
                                            />
                                        </div>
                                        <div className="mt-6 p-2 text-center">
                                            <p className="text-sm text-gray-500">
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
                                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
                                                maiores perferendis porro repellendus sunt! Corporis culpa debitis,
                                                dolorum, enim, eos eveniet iusto nemo quidem repudiandae sunt ullam
                                                voluptate. Maxime, similique!
                                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam autem
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious/>
                <CarouselNext/>
            </Carousel>
        </div>
    );
}

export default Slider;
