// components/CartActions.tsx
"use client";

import { useEffect, useState } from "react";

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

interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  is_purchased: boolean;
  added_at: string;
}

interface CartActionsProps {
  product: Product;
}

const CART_API_BASE = "http://localhost/carts";

export default function CartActions({ product }: CartActionsProps) {
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  // Retrieve token from storage
  const getAuthToken = () => {
    return localStorage.getItem('token'); // Adjust based on your auth setup
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(CART_API_BASE, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al obtener el carrito");
      const data = await res.json();
      setCartItems(data);
      const item = data.find((item: CartItem) => item.product_id === product.id);
      if (item) {
        setCartItem(item);
        setQuantity(item.quantity);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  const handleAddToCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const res = await fetch(CART_API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: quantity,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error al agregar al carrito");
      }
      const newCartItem = await res.json();
      setCartItem(newCartItem);
      fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCart = async () => {
    if (!cartItem) return;
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const res = await fetch(`${CART_API_BASE}/${cartItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity: quantity,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error al actualizar el carrito");
      }
      const updatedItem = await res.json();
      setCartItem(updatedItem);
      fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Acciones de Carrito</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="font-medium">
          Cantidad:
        </label>
        <input
          type="number"
          id="quantity"
          min="1"
          max={product.count}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border p-2 rounded w-20"
        />
        {cartItem ? (
          <button
            onClick={handleUpdateCart}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Actualizar Carrito
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Agregar al Carrito
          </button>
        )}
      </div>
      {loading && (
        <div className="mt-4">
          <p>Cargando...</p>
        </div>
      )}
      <div className="mt-6">
        <button
          onClick={() => setShowCart(!showCart)}
          className="underline text-blue-500"
        >
          {showCart ? "Ocultar Carrito" : "Ver Carrito"}
        </button>
        {showCart && (
          <div className="mt-4 border p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">Items en el Carrito</h3>
            {cartItems.length === 0 ? (
              <p>No hay items en el carrito.</p>
            ) : (
              <ul>
                {cartItems.map((item) => (
                  <li key={item.id}>
                    Producto ID: {item.product_id} - Cantidad: {item.quantity}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
