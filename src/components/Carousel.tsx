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
    // Estado para almacenar los productos
    const [products, setProducts] = React.useState<Product[]>([]);

    // Hacer la petición al cargar el componente
    React.useEffect(() => {
        fetch("https://app.fadiar.com/api/inventory")
            .then(response => response.json()) // Convertir la respuesta en JSON
            .then((data: { products: Product[] }) => {
                setProducts(data.products); // Establecer los productos en el estado
            })
            .catch(error => {
                console.error('Error fetching data:', error); // Manejar errores
            });
    }, []); // Solo se ejecuta una vez, cuando el componente se monta

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
                    {products.map((product, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <div className="flex-1">
                                <Card className="border-0 m-5">
                                    <CardContent className="p-0 flex h-[60vh] flex-col">
                                        <div className="relative w-full h-4/5"> {/* Ajusta el tamaño aquí */}
                                            <Image
                                                loader={() => "https://app.fadiar.com/api/" + product.img} // Usar el loader para especificar la URL
                                                src={"https://app.fadiar.com/api/" + product.img}
                                                alt={`Image ${index}`}
                                                layout="fill"
                                                objectFit="contain"
                                                className="rounded-lg overflow-hidden"
                                            />
                                        </div>
                                        <div className="mt-6 p-2 text-center">
                                            {/* Reemplazar el texto de Lorem Ipsum por los datos del producto */}
                                            <p className="text-sm text-[#022953]">
                                                {product.name} - {product.prices[0][1]} {product.prices[0][2]}
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
