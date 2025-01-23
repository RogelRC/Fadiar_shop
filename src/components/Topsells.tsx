"use client";

import * as React from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Definir el tipo para los productos
interface Product {
    img: string;
    id: number;
    brand: string;
    count: number;
    description: string;
    model: string;
    name: string;
    regret: number;
    sells: number;
}

function BestSellers() {
    const [products, setProducts] = React.useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
        null
    );

    // Hacer la petición al cargar el componente
    React.useEffect(() => {
        fetch("https://app.fadiar.com/api/mas_vendidos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ count: 4 }), // Parámetro count para obtener los 4 productos más vendidos
        })
            .then((response) => response.json()) // Convertir la respuesta en JSON
            .then((data) => {
                if (Array.isArray(data)) {
                    // Si el servidor devuelve un array directamente
                    setProducts(data);
                    setSelectedProduct(data[0] || null); // Establecer el primer producto o null
                } else if (data?.products && Array.isArray(data.products)) {
                    // Si el servidor devuelve un objeto con `products`
                    setProducts(data.products);
                    setSelectedProduct(data.products[0] || null);
                } else {
                    console.error("Formato de respuesta inesperado:", data);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error); // Manejar errores
            });
    }, []);

    if (products.length === 0) {
        return <div className="text-center">Cargando productos...</div>;
    }

    return (
        <div className="flex flex-col gap-6 w-full h-[88vh] bg-[#022953] relative">
            <div className="absolute top-[10%] bottom-[10%] left-1/2 w-[1px] bg-white z-1000"></div>
            <div className="flex w-full h-[10vh] bg-amber-700">
                Header
            </div>
            <div className="flex w-full h-[80vh]">
                {/* Lista de productos (sección izquierda) */}
                <Tabs defaultValue={products[0]?.id.toString()} className="w-2/3 h-full">
                    <TabsList className="flex flex-col gap-4 w-full h-full bg-[#022953]">
                        {products.map((product) => (
                            <TabsTrigger
                                key={product.id}
                                value={product.id.toString()}
                                className="flex items-center gap-2 p-2 w-1/2 h-full"
                                onClick={() => setSelectedProduct(product)}
                            >
                                <div className="flex justify-center w-full">
                                    <span className="text-sm font-medium">{product.name}</span>
                                </div>
                                <div className="flex w-1/2 h-full">
                                    <Image
                                        loader={() =>
                                            "https://app.fadiar.com/api/" + product.img
                                        }
                                        src={"https://app.fadiar.com/api/" + product.img}
                                        alt={product.name}
                                        width={50}
                                        height={50}
                                        className="rounded-lg w-full"
                                    />
                                </div>

                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                {/* Detalle del producto seleccionado (sección derecha) */}
                {selectedProduct && (
                    <div className="w-2/3 flex flex-col items-center text-lg text-white">
                        <div className="relative w-full h-64 rounded">
                            <Image
                                loader={() =>
                                    "https://app.fadiar.com/api/" + selectedProduct.img
                                }
                                src={"https://app.fadiar.com/api/" + selectedProduct.img}
                                alt={selectedProduct.name}
                                layout="fill"
                                objectFit="contain"
                                className="rounded-lg"
                            />
                        </div>
                        <h2 className="mt-6 text-2xl font-bold">{selectedProduct.name}</h2>
                        <p className="mt-2 px-14 pt-10 justify-center">{selectedProduct.description}</p>
                    </div>
                )}
            </div>

        </div>
    );
}

export default BestSellers;
