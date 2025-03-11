"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const features = [
    {
        icon: "/Iconos-03.svg",
        title: "Productividad",
    },
    {
        icon: "/Iconos-04.svg",
        title: "Comunicación",
    },
    {
        icon: "/Iconos-01.svg",
        title: "Entrega a tiempo",
    },
    {
        icon: "/Iconos-02.svg",
        title: "Recogida de pedidos",
    }
];

export default function Info() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Sección de características */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {features.map((feature, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className="relative w-16 h-16 mb-4">
                                    <Image
                                        src={feature.icon}
                                        alt={feature.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Sección de objetivos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative aspect-video rounded-xl overflow-hidden">
                        <Image
                            src="/objetivos.jpeg"
                            alt="Objetivos de la empresa"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#022953] mb-6">
                            Nuestros Objetivos
                        </h2>
                        <p className="text-lg text-gray-700 mb-6">
                            En Fadiar nos comprometemos a revolucionar la industria mediante:
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center">
                                <div className="w-2 h-2 bg-[#022953] rounded-full mr-3" />
                                Innovación tecnológica constante
                            </li>
                            <li className="flex items-center">
                                <div className="w-2 h-2 bg-[#022953] rounded-full mr-3" />
                                Desarrollo sostenible de soluciones
                            </li>
                            <li className="flex items-center">
                                <div className="w-2 h-2 bg-[#022953] rounded-full mr-3" />
                                Atención personalizada 24/7
                            </li>
                        </ul>
                        {/* <button className="bg-[#022953] text-white px-8 py-3 rounded-lg hover:bg-[#011a3a] transition-colors">
                            Conoce más
                        </button> */}
                    </div>
                </div>
            </div>
        </section>
    );
}