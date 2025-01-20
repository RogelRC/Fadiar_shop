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
    const images = [
        { id: 1, src: "/image1.png", alt: "Imagen 1" },
        { id: 2, src: "/image2.png", alt: "Imagen 2" },
        { id: 3, src: "/image3.png", alt: "Imagen 3" },
        { id: 4, src: "/image2.png", alt: "Imagen 4" },
        { id: 5, src: "/image3.png", alt: "Imagen 5" },
    ];

    return (
        <div className="flex justify-center items-center w-[100vw] h-[100vh] pt-20">
            <Carousel
                opts={{
                    loop: true,
                }}
                className="flex justify-items-center"
            >
                <CarouselContent className="flex-1 w-[80vw]">
                    {images.map((image) => (
                        <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="flex-1">
                                <Card className="border-0">
                                    <CardContent className="p-0 flex items-center justify-center h-[70vh]">
                                        <div className="relative w-full h-full"> {/* Ajusta el tamaño aquí */}
                                            <Image
                                                src={image.src}
                                                alt={image.alt}
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
