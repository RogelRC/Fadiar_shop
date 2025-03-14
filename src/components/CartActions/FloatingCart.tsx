// FloatingCart.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface CartItem {
    id: number;
    name: string;
    en_carrito: number;
    aliveUntil: number;
    prices: Array<[number, number, string]>;
    restante: number;
    img: string;
    brand: string;
    model: string;
}

interface FloatingCartProps {
    onClose?: () => void;
    cartData: CartData; // Prop from parent
}

interface CartData {
    carrito: CartItem[];
    expiran: boolean;
}

interface CartItemComponentProps {
    item: CartItem;
    expiran: boolean;
    onModifyQuantity: (id_product: number, newCount: number) => void;
    onDeleteProduct: (id_product: number) => void;
}

const useCountdown = (initialSeconds: number) => {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);

    useEffect(() => {
        setTimeLeft(initialSeconds);

        const timer = setInterval(() => {
            setTimeLeft(prev => Math.max(prev - 1, 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [initialSeconds]);

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

let monedas: { value: number; currency: string }[];

const CartItemComponent = ({ item, expiran, onModifyQuantity, onDeleteProduct }: CartItemComponentProps) => {
    const countdown = useCountdown(item.aliveUntil);
    const country = localStorage.getItem("country_code") || "CU";

    const convertPrice = (price: number, fromCurrency: string, toCurrency: string) => {
        const fromRate = monedas.find(c => c.currency === fromCurrency)?.value || 1;
        const toRate = monedas.find(c => c.currency === toCurrency)?.value || 1;
        return Math.ceil((price / fromRate) * toRate * 100) / 100;
    };

    const displayPrice = (price: number, currency: string) => {
        if (country === "CU") {
            if (currency === "CUP") {
                return `${price} CUP`;
            } else if (currency === "USD") {
                return `${convertPrice(price, "USD", "CUP")} CUP`;
            }
        } else {
            if (currency === "USD") {
                return `${price} USD`;
            } else if (currency === "CUP") {
                return `${convertPrice(price, "CUP", "USD")} USD`;
            }
        }
        return `${price} ${currency}`;
    };

    return (
        <div className="border-b border-gray-100 py-4 last:border-0">
            <div className="flex gap-4">
                <img
                    src={`${process.env.NEXT_PUBLIC_API}/${item.img}`}
                    alt={item.name}
                    className="w-20 h-20 object-contain rounded-lg bg-gray-50 p-2 border border-gray-200"
                />
                <div className="flex-1 space-y-1.5">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.brand} - {item.model}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onModifyQuantity(item.id, item.en_carrito - 1)}
                                disabled={item.en_carrito <= 1}
                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-400 disabled:opacity-50 w-6"
                            >
                                -
                            </button>
                            <span className="text-sm font-medium text-gray-900">
                                {item.en_carrito} × {displayPrice(item.prices[0][1], item.prices[0][2])}
                            </span>
                            <button
                                onClick={() => onModifyQuantity(item.id, item.en_carrito + 1)}
                                disabled={item.en_carrito >= item.restante}
                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-400 disabled:opacity-50 w-6"
                            >
                                +
                            </button>
                        </div>
                        <button
                            onClick={() => onDeleteProduct(item.id)}
                            className="text-red-500 hover:text-red-700 ml-2 bg-red-100 w-6 rounded"
                        >
                            ×
                        </button>
                    </div>
                    {expiran && (
                        <div className="flex items-center justify-between bg-red-50 px-3 py-2 rounded-md">
                            <span className="text-xs font-medium text-red-700">Expira en:</span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-semibold text-red-700">
                                    {countdown}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const FloatingCart = ({ onClose }: FloatingCartProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [cartData, setCartData] = useState<CartData>({ carrito: [], expiran: false });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    const fetchCartData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/obtener_productos_carrito`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_user_action: userData.userId,
                    id_user: userData.userId,
                    comisiones: false,
                }),
            });

            if (!response.ok) throw new Error("Error al obtener el carrito");
            const data = await response.json();
            monedas = data.monedas[0].currencys;

            console.log(data);
            console.log(monedas);

            // Actualizar solo si hay cambios reales
            setCartData(prev => JSON.stringify(prev.carrito) === JSON.stringify(data.carrito) ? prev : data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchCartData();
        }
    }, [isOpen]);

    const handleModifyQuantity = async (id_product: number, newCount: number) => {
        try {
            // Actualización optimista
            setCartData(prev => ({
                ...prev,
                carrito: prev.carrito.map(item =>
                    item.id === id_product ? { ...item, en_carrito: newCount } : item
                )
            }));

            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/modificar_cantidad_producto_carrito`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_user_action: userData.userId,
                    id_user: userData.userId,
                    id_product: id_product,
                    newCount: newCount,
                }),
            });

            if (!response.ok) throw new Error('Error al modificar la cantidad');

            // Sincronización silenciosa después de 2 segundos
            setTimeout(fetchCartData, 2000);
        } catch (error) {
            // Revertir cambios si hay error
            fetchCartData();
            setError(error instanceof Error ? error.message : 'Error desconocido al modificar la cantidad');
        }
    };

    const handleDeleteProduct = async (id_product: number) => {
        try {
            // Actualización optimista
            const previousCart = [...cartData.carrito];
            setCartData(prev => ({
                ...prev,
                carrito: prev.carrito.filter(item => item.id !== id_product)
            }));

            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/eliminar_producto_carrito`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_user_action: userData.userId,
                    id_user: userData.userId,
                    id_product: id_product,
                }),
            });

            if (!response.ok) throw new Error('Error al eliminar el producto');

            // Sincronización silenciosa después de 2 segundos
            setTimeout(fetchCartData, 2000);
        } catch (error) {
            // Revertir cambios si hay error
            // @ts-ignore
            setCartData(prev => ({ ...prev, carrito: previousCart }));
            setError(error instanceof Error ? error.message : 'Error desconocido al eliminar el producto');
        }
    };

    const totalItems = cartData.carrito.reduce((acc, item) => acc + item.en_carrito, 0);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 group"
            >
                <span className="relative">
                    <ShoppingCart />
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white w-5 h-5 rounded-full flex items-center justify-center">
                            {totalItems}
                        </span>
                    )}
                </span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-end justify-end p-4 z-50">
                    <div className="bg-white rounded-xl w-full max-w-md p-6 max-h-[85vh] flex flex-col shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Tu Carrito</h2>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    onClose?.();
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                            {error ? (
                                <div className="text-red-500 text-center py-4">{error}</div>
                            ) : cartData.carrito.length === 0 ? (
                                <div className="text-gray-500 text-center py-4">Tu carrito está vacío</div>
                            ) : (
                                cartData.carrito.map((item) => (
                                    <CartItemComponent
                                        key={item.id}
                                        item={item}
                                        expiran={cartData.expiran}
                                        onModifyQuantity={handleModifyQuantity}
                                        onDeleteProduct={handleDeleteProduct}
                                    />
                                ))
                            )}
                        </div>

                        {cartData.carrito.length > 0 && !loading && !error && (
                            <Link href="/purchase" className="block bg-blue-600 text-white p-2 mt-4 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 group">
                                <button className="w-full bg-blue-600...">
                                    Verificar compra
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}