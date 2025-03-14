"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Filter } from 'lucide-react';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from "framer-motion";

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
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [allowedCurrencies, setAllowedCurrencies] = useState<Currency[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState("CUP");
    const [userCountry, setUserCountry] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [filterBrand, setFilterBrand] = useState("all");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(9999999999);
    const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "out">("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    const searchTerm = searchParams.get('search') || '';

    const getDefaultCurrency = (country: string) => {
        if (country === 'CU') return 'CUP';
        return 'USD';
    };

    const API = process.env.NEXT_PUBLIC_API;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener datos de inventario
                const inventoryResponse = await fetch(`${API}/inventory`);
                if (!inventoryResponse.ok) throw new Error("Error al cargar los productos");
                const inventoryData = await inventoryResponse.json();

                // Obtener ubicación del usuario
                let country = 'CU';
                try {
                    const countryResponse = await fetch("https://ipapi.co/json/");
                    const countryData = await countryResponse.json();
                    countryData.error === true ? country = 'CU' : country = countryData.country_code;
                    // Guardar una cookie
                    localStorage.setItem("country_code", country);
                } catch (err) {
                    console.error("Error obteniendo ubicación:", err);
                }

                // Filtrar monedas según ubicación
                let filteredCurrencies = inventoryData.currencys.currencys;
                if (country === 'CU') {
                    filteredCurrencies = filteredCurrencies.filter((c: Currency) =>
                        ['CUP'].includes(c.currency)
                    );
                } else {
                    filteredCurrencies = filteredCurrencies.filter((c: Currency) =>
                        ['USD'].includes(c.currency)
                    );
                }

                // Establecer valores iniciales
                setUserCountry(country);
                setCurrencies(inventoryData.currencys.currencys);
                setAllowedCurrencies(filteredCurrencies);
                setProducts(inventoryData.products);

                // Establecer moneda por defecto
                const defaultCurrency = getDefaultCurrency(country);
                setSelectedCurrency(defaultCurrency);

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
        setMaxPrice(9999999999);
    }, [selectedCurrency]);

    const resetFilters = () => {
        const defaultCurrency = getDefaultCurrency(userCountry);
        setSelectedCurrency(defaultCurrency);
        setSortBy("name");
        setFilterBrand("all");
        setMinPrice(0);
        setMaxPrice(9999999999);
        setAvailabilityFilter("all");
    };

    const getPriceInCurrency = (prices: Array<[number, number, string]>) => {
        const directPrice = prices.find(p => p[2] === selectedCurrency);
        if (directPrice) return { price: directPrice[1], currency: selectedCurrency };

        const originalCurrency = currencies.find(c => c.currency === prices[0][2]);
        const targetCurrency = currencies.find(c => c.currency === selectedCurrency);

        if (!originalCurrency || !targetCurrency) {
            return { price: prices[0][1], currency: prices[0][2] };
        }

        const priceInUSD = prices[0][1] / originalCurrency.value;
        const convertedPrice = priceInUSD * targetCurrency.value;

        return { price: convertedPrice, currency: selectedCurrency };
    };

    const filteredProducts = products
        .filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(product =>
            filterBrand === "all" || product.brand.toLowerCase() === filterBrand.toLowerCase()
        )
        .filter(product => {
            const { price } = getPriceInCurrency(product.prices);
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
                    <h1 className="text-3xl font-bold text-[#022953]">Productos</h1>

                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">Filtrar por</span>
                            <button
                                className="p-2 border rounded-full hover:bg-gray-100"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Image
                                    src="/filter-icon.svg"
                                    alt="Icono de filtro"
                                    width={30}
                                    height={30}
                                />
                            </button>
                        </div>

                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    key="filters"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-wrap gap-4"
                                >
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
                                        className="px-4 py-2 bg-[#EFEFEF] text-black border rounded-lg hover:bg-gray-300"
                                    >
                                        Reiniciar filtros
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => {
                        const { price, currency } = getPriceInCurrency(product.prices);

                        return (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 ease-in-out hover:scale-110 flex flex-col h-full transform-gpu">
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={`${API}/${product.img}`}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                </div>

                                <div className="p-4 flex flex-col flex-1">
                                    <div className="mb-2">
                                        <h3 className="text-xl font-semibold">{product.name}</h3>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">{product.brand}</span>
                                            <span className="text-sm text-gray-500">{product.model}</span>
                                        </div>
                                    </div>

                                    <p className="text-lg font-bold text-[#022953]">
                                        {price.toFixed(2)} {currency}
                                    </p>

                                    <div className="mt-auto flex justify-between items-center">
                                        <span
                                            className={`text-sm ${product.count > 0 ? "text-green-600" : "text-red-600"
                                                }`}
                                        >
                                            {product.count > 0 ? "Disponible" : "Agotado"}
                                        </span>
                                        <button
                                            onClick={() => {
                                                const productId = product.id;
                                                localStorage.setItem('selectedProductId', productId.toString());
                                                router.push('/details');
                                            }}
                                            className="px-3 py-1 bg-[#022953] text-white rounded hover:bg-[#011a3a] text-sm"
                                        >
                                            Ver detalles
                                        </button>
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