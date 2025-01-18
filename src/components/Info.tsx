"use client";

import Image from "next/image";
import {Button} from "@/components/ui/button";

function Info() {

    return (
        <div className="flex flex-col relative w-full h-[90vh] bg-gray-100">
            {/* Ajusta la altura según el header */}
            <div className="flex w-full h-1/3 items-center justify-center gap-4 px-5">
                <div
                    className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-2 w-4/5 h-2/3 lg:mx-[5vw]">
                    <Image src="/Iconos-03.svg" alt="Productividad" width={50} height={50}/>
                    <h3 className="mt-2 text-center text-sm font-semibold">Productividad</h3>
                </div>

                <div
                    className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-2 w-4/5 h-2/3 lg:mx-[5vw]">
                    <Image src="/Iconos-04.svg" alt="Comunicación" width={50} height={50}/>
                    <h3 className="mt-2 text-center text-sm font-semibold">Comunicación</h3>
                </div>

                <div
                    className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-2 w-4/5 h-2/3 lg:mx-[5vw]">
                    <Image src="/Iconos-01.svg" alt="Entrega a tiempo" width={50} height={50}/>
                    <h3 className="mt-2 text-center text-sm font-semibold">Entrega a tiempo</h3>
                </div>

                <div
                    className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-2 w-4/5 h-2/3 lg:mx-[5vw]">
                    <Image src="/Iconos-02.svg" alt="Recogida de pedidos" width={50} height={50}/>
                    <h3 className="mt-2 text-center text-sm font-semibold">Recogida de pedidos</h3>
                </div>
            </div>

            <div className="flex w-full h-2/3 justify-center items-center">
                <div className="hidden lg:flex relative w-1/2 h-full justify-center items-center">
                    <Image
                        loader={() => "https://app.fadiar.com/api/images/_Split_2_T.jpg"}
                        src="https://app.fadiar.com/api/images/_Split_2_T.jpg"
                        alt="Image"
                        width={350}
                        height={200}
                        className="rounded-lg"
                    />
                </div>
                <div className="flex flex-col w-full lg:w-1/2 h-full justify-center p-10 lg:p-20">
                    <h2 className="font-bold text-4xl">Objetivos:</h2>
                    <p className="py-10">
                        Este texto debe explicar brevemente cual es el objetivo de la empresa Lorem ipsum dolor sit
                        amet, consectetur adipisicing elit. Aliquam blanditiis cupiditate eligendi esse hic in incidunt
                        labore laudantium numquam obcaecati officia provident quasi sapiente soluta suscipit tempore,
                        voluptates. Placeat, similique.
                    </p>
                    <Button className="w-3/5 bg-[#022953]">Leer mas</Button>
                </div>
            </div>
        </div>

    );
}

export default Info;
