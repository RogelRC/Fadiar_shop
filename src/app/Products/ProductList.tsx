// app/Products/ProductList.tsx
"use client";

import {useSearchParams} from "next/navigation";
import {useState, useEffect} from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
    id: number;
    name: string;
    brand: string;
    model: string;
    img: string;
    description: string;
    prices: Array<[number, number, string]>;
    count: number;
}

interface Currency {
    currency: string;
    value: number;
}

export default function ProductList() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState("CUP");
    const [sortBy, setSortBy] = useState("name");
    const [filterBrand, setFilterBrand] = useState("all");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(9999999999);
    const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "out">("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const searchTerm = searchParams.get('search') || '';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://app.fadiar.com/api/inventory");
                if (!response.ok) throw new Error("Error al cargar los Products");

                const data = await response.json();
                setProducts(data.products);
                setCurrencies(data.currencys.currencys);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error desconocido");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setMinPrice(0);
        setMaxPrice(selectedCurrency === "CUP" ? 9999999999 : 9999999999);
    }, [selectedCurrency]);

    const resetFilters = () => {
        setSelectedCurrency("CUP");
        setSortBy("name");
        setFilterBrand("all");
        setMinPrice(0);
        setMaxPrice(9999999999);
        setAvailabilityFilter("all");
    };

    const getPriceInCurrency = (prices: Array<[number, number, string]>) => {
        const directPrice = prices.find(p => p[2] === selectedCurrency);
        if (directPrice) return {price: directPrice[1], currency: selectedCurrency};

        const originalCurrency = currencies.find(c => c.currency === prices[0][2]);
        const targetCurrency = currencies.find(c => c.currency === selectedCurrency);

        if (!originalCurrency || !targetCurrency) {
            return {price: prices[0][1], currency: prices[0][2]};
        }

        const priceInUSD = prices[0][1] / originalCurrency.value;
        const convertedPrice = priceInUSD * targetCurrency.value;

        return {price: convertedPrice, currency: selectedCurrency};
    };

    const filteredProducts = products
        .filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(product =>
            filterBrand === "all" || product.brand.toLowerCase() === filterBrand.toLowerCase()
        )
        .filter(product => {
            const {price} = getPriceInCurrency(product.prices);
            return price >= minPrice && price <= maxPrice;
        })
        .filter(product => {
            if (availabilityFilter === "available") return product.count > 0;
            if (availabilityFilter === "out") return product.count <= 0;
            return true;
        })
        .sort((a, b) => {
            const priceA = getPriceInCurrency(a.prices).price;
            const priceB = getPriceInCurrency(b.prices).price;

            switch (sortBy) {
                case "price-asc":
                    return priceA - priceB;
                case "price-desc":
                    return priceB - priceA;
                default:
                    return a.name.localeCompare(b.name);
            }
        });

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
            <p>Error: {error}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Reintentar
            </button>
        </div>
    );

    return (
        <section className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-[#022953]">Catálogo Completo</h1>

                    <div className="flex flex-wrap gap-4">
                        <select
                            value={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.target.value)}
                            className="px-3 py-2 border rounded-lg"
                        >
                            {currencies.map(currency => (
                                <option key={currency.currency} value={currency.currency}>
                                    {currency.currency}
                                </option>
                            ))}
                        </select>

                        <select
                            value={availabilityFilter}
                            onChange={(e) => setAvailabilityFilter(e.target.value as "all" | "available" | "out")}
                            className="px-3 py-2 border rounded-lg"
                        >
                            <option value="all">Todos</option>
                            <option value="available">Disponibles</option>
                            <option value="out">Agotados</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border rounded-lg"
                        >
                            <option value="name">Ordenar por nombre</option>
                            <option value="price-asc">Precio: Menor a Mayor</option>
                            <option value="price-desc">Precio: Mayor a Menor</option>
                        </select>

                        <select
                            value={filterBrand}
                            onChange={(e) => setFilterBrand(e.target.value)}
                            className="px-3 py-2 border rounded-lg"
                        >
                            <option value="all">Todas las marcas</option>
                            {[...new Set(products.map(p => p.brand))].map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>

                        <div className="flex flex-col">
                            <label className="text-sm">Rango de precios:</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(Number(e.target.value))}
                                    className="w-20 px-2 py-1 border rounded"
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    className="w-20 px-2 py-1 border rounded"
                                />
                            </div>
                        </div>
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Reiniciar filtros
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => {
                        const {price, currency} = getPriceInCurrency(product.prices);

                        return (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
                            >
                                {/* Imagen del producto */}
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={`https://app.fadiar.com/api/${product.img}`}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                </div>

                                {/* Contenido del producto */}
                                <div className="p-4 flex flex-col flex-1">
                                    {/* Título y detalles */}
                                    <div className="mb-2">
                                        <h3 className="text-xl font-semibold">{product.name}</h3>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">{product.brand}</span>
                                            <span className="text-sm text-gray-500">{product.model}</span>
                                        </div>
                                    </div>

                                    {/* Precio */}
                                    <p className="text-lg font-bold text-[#022953]">
                                        {price.toFixed(2)} {currency}
                                    </p>

                                    {/* Disponibilidad y botón de detalles */}
                                    <div className="mt-auto flex justify-between items-center">
                                        <span
                                            className={`text-sm ${
                                                product.count > 0 ? "text-green-600" : "text-red-600"
                                            }`}
                                        >
                                          {product.count > 0 ? "Disponible" : "Agotado"}
                                        </span>
                                        <Link
                                            href={`/Products/${product.id}`}
                                            className="px-3 py-1 bg-[#022953] text-white rounded hover:bg-[#011a3a] text-sm"
                                        >
                                            Ver detalles
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );

                    })}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No se encontraron productos con los filtros seleccionados
                    </div>
                )}
            </div>
        </section>
    );
}
