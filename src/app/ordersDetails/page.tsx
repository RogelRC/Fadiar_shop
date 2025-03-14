"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import 'tailwindcss/tailwind.css';

const API = process.env.NEXT_PUBLIC_API;

interface Order {
  acepted_date: string | null;
  chat: {
    messages: Array<{
      cellphone1: number;
      date: string;
      id: number;
      id_order: number;
      id_user: number;
      lastname1: string;
      lastname2: string;
      message: string;
      name: string;
      type: string;
    }>;
  };
  client_cell: number;
  client_ci: number;
  client_last_names: string;
  client_name: string;
  date: string;
  direccionExacta: string;
  id: number;
  manager_name: string;
  municipio: string;
  products: Array<{
    brand: string;
    commissions: Array<[number, number, string]>;
    count: number;
    description: string;
    id: number;
    model: string;
    name: string;
    prices: Array<[number, number, string, number]>;
    img: string;
  }>;
  provincia: string;
  state: number;
}

interface UserData {
  userId: number;
}

interface IpApiResponse {
  country: string;
}

export default function OrderDetails() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<'USD' | 'CUP'>('USD');
  const router = useRouter();

  const getCurrentUserId = (): number | null => {
    const userData = localStorage.getItem("userData");
    if (!userData) return null;
    try {
      return JSON.parse(userData).userId;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data: IpApiResponse = await response.json();
        setCurrency(data.country === 'CU' ? 'CUP' : 'USD');
      } catch (error) {
        console.error('Error detecting country:', error);
        setCurrency('CUP');
      }
    };

    const fetchOrderDetails = async () => {
      try {
        const orderId = localStorage.getItem("orderId");
        const userId = getCurrentUserId();

        if (!orderId || !userId) {
          throw new Error(orderId ? 'Usuario no autenticado' : 'Pedido no encontrado');
        }

        const response = await fetch(`${API}/getOrder`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_user_action: userId,
            id_order: parseInt(orderId, 10)
          }),
        });

        if (!response.ok) throw new Error('Error al obtener detalles');

        const data: Order = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    detectCountry();
    fetchOrderDetails();
  }, []);

  const getPrice = (prices: Array<[number, number, string, number]>, currency: string) => {
    const price = prices.find(p => p[2] === currency);
    return price ? price[1] : null;
  };

  const calculateTotal = () => {
    if (!order) return 0;

    return order.products.reduce((total, product) => {
      const price = getPrice(product.prices, currency);
      return total + (price ? price * product.count : 0);
    }, 0);
  };

  const getEstadoStyle = (state: number) => {
    switch (state) {
      case -1: return 'bg-red-500 text-white';
      case 0: return 'bg-blue-100 text-blue-800';
      case 1: return 'bg-green-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#022953]"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
      <p>Error: {error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-[#022953] text-white rounded hover:bg-blue-700"
      >
        Reintentar
      </button>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
      <p>No se encontró el pedido</p>
      <button
        onClick={() => router.back()}
        className="mt-4 px-4 py-2 bg-[#022953] text-white rounded hover:bg-blue-700"
      >
        Volver
      </button>
    </div>
  );

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-[#022953] hover:text-blue-700"
        >
          <span className="mr-2">&larr;</span>
          Volver a pedidos
        </button>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <h1 className="text-2xl font-bold text-[#022953] mb-4 md:mb-0">
              Pedido #{order.id}
            </h1>
            <span className={`px-3 py-1 rounded-full ${getEstadoStyle(order.state)}`}>
              {order.state === -1 ? 'Cancelada' : 
               order.state === 1 ? 'Aceptado' : 'En espera'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-[#022953] mb-2">Información del Cliente</h3>
                <p>{order.client_name} {order.client_last_names}</p>
                <p>CI: {String(order.client_ci).padStart(11, '0')}</p>
                <p>Teléfono: {order.client_cell}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-[#022953] mb-2">Ubicación</h3>
                <p>{order.direccionExacta}</p>
                <p>{order.municipio}, {order.provincia}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-[#022953] mb-2">Detalles del Pedido</h3>
                <p>Fecha: {new Date(order.date).toLocaleDateString()}</p>
                <p>Hora: {new Date(order.date).toLocaleTimeString()}</p>
                {order.acepted_date && (
                  <p>Aceptado: {new Date(order.acepted_date).toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-6 border-[#022953]">
            <h2 className="text-xl font-bold text-[#022953] mb-6">Productos</h2>
            <div className="space-y-6">
              {order.products.map((product, index) => {
                const price = getPrice(product.prices, currency);
                const imageUrl = `${API}/${product.img}`;

                return (
                  <div key={product.id}>
                    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="object-contain rounded-lg w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                          }}
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-gray-600 text-sm">{product.brand} {product.model}</p>
                        <p className="text-sm mt-2">{product.description}</p>

                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div className="flex flex-col">
                            <p className="text-gray-600">Precio unitario:</p>
                            <p className="font-medium truncate">
                              {price ? `${price.toFixed(2)} ${currency}` : 'N/A'}
                            </p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-gray-600">Cantidad:</p>
                            <p className="font-medium">{product.count}</p>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-white rounded border border-[#022953]">
                          <p className="text-sm font-medium">
                            Total producto: {price ? (price * product.count).toFixed(2) : 'N/A'} {currency}
                          </p>
                        </div>
                      </div>
                    </div>
                    {index < order.products.length - 1 && (
                      <hr className="my-6 border-t border-[#022953]" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-4 bg-[#022953] text-white rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total del pedido:</span>
                <span className="text-xl font-bold">
                  {calculateTotal().toFixed(2)} {currency}
                </span>
              </div>
            </div>
          </div>
        </div>

        {order.chat.messages.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#022953] mb-6">Notas</h2>
            <div className="space-y-4">
              {order.chat.messages.map((message) => (
          <div key={message.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-[#022953]">
            {message.name} {message.lastname1}
                </p>
                <p className="text-sm text-gray-500">{message.type}</p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(message.date).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-800 whitespace-pre-wrap">{message.message}</p>
          </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}