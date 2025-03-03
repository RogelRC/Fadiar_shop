"use client";

import { useEffect, useState } from "react";
import FloatingCart from "./FloatingCart";

interface Product {
  id: number;
  name: string;
  prices: Array<[number, number, string]>;
}

interface CartData {
  carrito: Array<{
    id: number;
    name: string;
    en_carrito: number;
    restante: number;
    aliveUntil: number;
    prices: Array<[number, number, string]>;
    img: string;
    brand: string;
    model: string;
  }>;
  expiran: boolean;
}

interface CartActionsProps {
  product: Product;
}

const API = process.env.NEXT_PUBLIC_API;

export default function CartActions({ product }: CartActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartData, setCartData] = useState<CartData | null>(null);

  const getCurrentUserId = () => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData).userId : null;
  };

  const fetchCart = async () => {
    const userId = getCurrentUserId();
    if (!userId) return;

    try {
      const response = await fetch(`${API}/obtener_productos_carrito`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_user_action: userId,
          id_user: userId,
          comisiones: false,
        }),
      });

      const data = await response.json();
      setCartData(data.carrito?.length > 0 ? data : null);
    } catch (err) {
      setError("Error al cargar el carrito");
    }
  };

  const fetchAvailableQuantity = async () => {
    const userId = getCurrentUserId();
    if (!userId) return;

    try {
      const response = await fetch(`${API}/cantidad_restante_producto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_user_action: userId,
          id_product: product.id,
        }),
      });

      const data = await response.json();
      setAvailableQuantity(data.cantidad);
    } catch (err) {
      setError("Error al cargar disponibilidad");
    }
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error("Debes iniciar sesión");

      const response = await fetch(`${API}/agregar_producto_carrito`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_user_action: userId,
          id_user: userId,
          id_product: product.id,
          count: quantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al agregar al carrito");
      }

      // Actualización optimizada
      const newCartResponse = await fetch(`${API}/obtener_productos_carrito`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_user_action: userId,
          id_user: userId,
          comisiones: false,
        }),
      });

      const newCartData = await newCartResponse.json();
      setCartData(newCartData.carrito?.length > 0 ? newCartData : null);

      await fetchAvailableQuantity();
      setQuantity(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carga inicial de datos
    const loadData = async () => {
      await Promise.all([fetchAvailableQuantity(), fetchCart()]);
    };
    loadData();

    // Configurar intervalo para actualizar la disponibilidad cada 5 segundos
    const intervalId = setInterval(fetchAvailableQuantity, 5000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, [product.id]); // Dependencia en product.id

  return (
      <div className="mt-4">
        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}

        <div className="flex items-center gap-2">
          <input
              type="number"
              min="1"
              max={availableQuantity}
              value={quantity}
              onChange={(e) => {
                const value = Math.max(1, Math.min(availableQuantity, Number(e.target.value)));
                setQuantity(value);
              }}
              className="border p-1 rounded w-16 text-center"
              disabled={availableQuantity === 0}
          />

          <button
              onClick={handleAddToCart}
              disabled={loading || availableQuantity === 0}
              className={`px-4 py-2 text-sm rounded transition-colors ${
                  loading
                      ? "bg-gray-400"
                      : availableQuantity === 0
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
          >
            {loading ? "Agregando..." : "Agregar al carrito"}
          </button>
        </div>

        {/* Botón flotante siempre visible cuando hay items */}
        {cartData?.carrito && cartData.carrito.length > 0 && (
            <FloatingCart cartData={cartData} />
        )}
      </div>
  );
}