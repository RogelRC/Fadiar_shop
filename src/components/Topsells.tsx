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
        <div className="flex gap-6 w-[90vw] mx-auto my-10 bg-[#F3F4F6] p-6 rounded-lg shadow-md">
            {/* Lista de productos (sección izquierda) */}
            <Tabs defaultValue={products[0]?.id.toString()} className="w-1/3">
                <TabsList className="flex flex-col gap-4">
                    {products.map((product) => (
                        <TabsTrigger
                            key={product.id}
                            value={product.id.toString()}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200"
                            onClick={() => setSelectedProduct(product)}
                        >
                            <Image
                                loader={() =>
                                    "https://app.fadiar.com/api/" + product.img
                                }
                                src={"https://app.fadiar.com/api/" + product.img}
                                alt={product.name}
                                width={50}
                                height={50}
                                className="rounded"
                            />
                            <span className="text-sm font-medium">{product.name}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* Detalle del producto seleccionado (sección derecha) */}
            {selectedProduct && (
                <div className="w-2/3 flex flex-col items-center">
                    <div className="relative w-full h-64">
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
                    <p className="text-gray-600 mt-2">{selectedProduct.description}</p>
                    <ul className="mt-4 space-y-2">
                        <li>
                            <strong>Modelo:</strong> {selectedProduct.model}
                        </li>
                        <li>
                            <strong>Marca:</strong> {selectedProduct.brand}
                        </li>
                        <li>
                            <strong>Ventas:</strong> {selectedProduct.sells}
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default BestSellers;
