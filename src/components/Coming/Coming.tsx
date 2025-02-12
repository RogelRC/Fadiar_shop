import { Button } from "../ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem, CarouselNext, CarouselPrevious
} from "@/components/ui/carousel"
import { Card, CardContent } from "../ui/card";

export default function Coming() {
    return (
        <div className={"flex w-full h-[70vh] bg-[#F5F5F5] px-10 py-20 items-center"}>
            <div className={"flex flex-col gap-10 w-2/5 h-full text-[#022953] justify-center"}>
                <h1 className={"font-bold text-3xl"}>Productos próximamente a su alcance</h1>
                <p>En este texto se debe explicar brevemente la empresa, cual es su finalidad, los servicios más importantes que se ofrecen, entre otras cuestiones.</p>
                <Button className={"flex bg-[#022953] font-bold rounded-none w-52"}>LEER MÁS</Button>
            </div>
            <div className={"flex w-3/5 h-full items-center justify-center p-5 relative"}>
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="flex aspect-square items-center justify-center p-6">
                                            <span className="text-3xl font-semibold">Waiting for the endpoint {index + 1}</span>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="absolute bottom-[-30px] right-8 flex space-x-2">
                        <CarouselPrevious className="bg-[#022953] hover:bg-white/50 text-white" />
                        <CarouselNext className="bg-[#022953] hover:bg-white/50 text-white" />
                    </div>
                </Carousel>
            </div>
        </div>
    )
}